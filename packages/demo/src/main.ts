import './style.css';
import { SalveEngine } from '@salve/core';
import { SalveDevTools } from '@salve/devtools';
import { GregorianCalendarPlugin } from '@salve/calendars-gregorian';
import { HijriCalendarPlugin } from '@salve/calendars-hijri';
import { PaschaCalendarPlugin } from '@salve/calendars-pascha';
import { SpecialtyCalendarPlugin } from '@salve/calendars-specialty';
import { DEMO_PACKS } from './packs';

const engine = new SalveEngine();

engine.registerPlugin(new GregorianCalendarPlugin());
engine.registerPlugin(new HijriCalendarPlugin());
engine.registerPlugin(new PaschaCalendarPlugin());
engine.registerPlugin(new SpecialtyCalendarPlugin());

for (const pack of DEMO_PACKS) {
  engine.registerPack(pack);
}

engine.registerHonorifics({
  locale: 'de-DE',
  titles: { male: 'Herr', female: 'Frau', unspecified: '' },
  formats: {
    formal: '{fullHonorific} {lastName}',
    informal: '{firstName}',
    standard: '{firstName} {lastName}',
  },
});
engine.registerHonorifics({
  locale: 'en-GB',
  titles: { male: 'Mr', female: 'Ms', unspecified: 'Mx' },
  formats: {
    formal: '{fullHonorific} {lastName}',
    informal: '{firstName}',
    standard: '{firstName} {lastName}',
  },
});

const devTools = new SalveDevTools(engine);

const $ = (id: string) => document.getElementById(id)!;
const pad2 = (n: number) => String(n).padStart(2, '0');
const fmtISO = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const esc = (s: string) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] ?? c)
  );

const AFFILIATIONS = [
  { id: 'civil', label: 'Civil' },
  { id: 'islamic', label: 'Islam' },
  { id: 'orthodox', label: 'Orthodox' },
  { id: 'catholic', label: 'Catholic' },
  { id: 'protestant', label: 'Protestant' },
  { id: 'chinese_traditional', label: 'Chinese Tradition' },
];

let selectedAff = new Set(['civil', 'islamic', 'orthodox', 'chinese_traditional']);
let autoTimer: ReturnType<typeof setInterval> | null = null;
let autoIndex = 0;
let resumeTimer: ReturnType<typeof setTimeout> | null = null;

interface TimelineItem {
  date: Date;
  key: string;
  label: string;
  type: string;
  eventId?: string;
  domain?: string;
  calendar?: string;
}
let timelineItems: TimelineItem[] = [];

function stateSnapshot() {
  const tzSel = ($('timezone') as HTMLSelectElement).value;
  const tz =
    tzSel === 'auto'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : tzSel;

  const dateStr = ($('date') as HTMLInputElement).value || fmtISO(new Date());
  const timeStr = ($('time') as HTMLInputElement).value || '12:00';
  const m = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  const hh = m ? Math.min(23, Math.max(0, parseInt(m[1], 10))) : 12;
  const mm = m ? Math.min(59, Math.max(0, parseInt(m[2], 10))) : 0;
  const now = new Date(dateStr + 'T' + pad2(hh) + ':' + pad2(mm) + ':00');

  const namesRaw = ($('givenNames') as HTMLInputElement).value.trim();
  const names = namesRaw ? namesRaw.split(';').map((s) => s.trim()).filter(Boolean) : [];
  const primaryName = names[0] || '';

  const birthdayISO = ($('birthday') as HTMLInputElement).value || null;

  return {
    now,
    timezone: tz,
    mode: ($('mode') as HTMLSelectElement).value,
    formality: ($('formality') as HTMLSelectElement).value as 'formal' | 'informal',
    residenceLocale: ($('residenceLocale') as HTMLSelectElement).value,
    greetingLanguage: ($('greetingLanguage') as HTMLSelectElement).value,
    scriptPref: ($('scriptPref') as HTMLSelectElement).value,
    affiliations: Array.from(selectedAff),
    names,
    primaryName,
    surname: ($('surname') as HTMLInputElement).value.trim(),
    gender: ($('gender') as HTMLSelectElement).value,
    titleRole: ($('titleRole') as HTMLSelectElement).value,
    birthdayISO,
    outputMode: ($('outputMode') as HTMLSelectElement).value,
    relationship: ($('relationship') as HTMLSelectElement).value,
    setting: ($('setting') as HTMLSelectElement).value,
    civilParticipation: ($('civilParticipation') as HTMLInputElement).checked,
    namedaysEnabled: ($('namedaysEnabled') as HTMLInputElement).checked,
  };
}

function buildContext(state: ReturnType<typeof stateSnapshot>): Record<string, unknown> {
  return {
    now: state.now,
    locale: state.greetingLanguage,
    formality: state.formality,
    affiliations: state.affiliations,
    relationship: state.relationship,
    setting: state.setting === 'ui' ? 'direct_address' : state.setting === 'chat' ? 'chat_message' : 'email_opening',
    phase: state.mode === 'opening' ? 'open' : 'close',
    profile: {
      firstName: state.primaryName || undefined,
      lastName: state.surname || undefined,
      gender: state.gender !== 'unknown' ? state.gender : undefined,
      academicTitles: state.titleRole === 'dr' ? ['Dr.']
        : state.titleRole === 'prof' ? ['Prof.']
        : state.titleRole === 'prof_dr' ? ['Prof.', 'Dr.']
        : undefined,
      professionalRole: state.titleRole === 'judge' ? 'judge'
        : state.titleRole === 'police' ? 'police'
        : state.titleRole === 'clergy' ? 'clergy'
        : undefined,
    },
  };
}

function classifyDomain(domain: string) {
  if (domain === 'personal') return 'personal';
  if (domain === 'civil' || domain === 'temporal') return 'civil';
  if (domain === 'religious') return 'relig';
  return 'season';
}
function badgeClass(type: string) {
  return type === 'civil' ? 'b-civil' : type === 'relig' ? 'b-relig' : type === 'personal' ? 'b-personal' : 'b-season';
}
function badgeLabel(type: string) {
  return type === 'civil' ? 'civil' : type === 'relig' ? 'religious' : type === 'personal' ? 'personal' : 'seasonal';
}

function iVar(display: string, ctrl: string) {
  return `<span class="var"><span class="vd">${display}</span><span class="ve" style="display:none">${ctrl}</span></span>`;
}
function iSelCtrl(id: string, opts: string) {
  return `<select id="${id}">${opts}</select>`;
}
function iInpCtrl(id: string, type: string, val: string, extra = '') {
  return `<input type="${type}" id="${id}" value="${esc(val)}"${extra}>`;
}
function mkOpts(pairs: [string, string][], sel: string) {
  return pairs.map(([v, l]) => `<option value="${v}"${sel === v ? ' selected' : ''}>${l}</option>`).join('');
}

async function updateFromUI(opts = { setMemory: true }) {
  const state = stateSnapshot();
  const ctx = buildContext(state);

  let result;
  try {
    result = await engine.resolve(ctx as any);
  } catch (e) {
    console.error('Engine resolve failed:', e);
    $('heroGreeting').textContent = 'Hello!';
    $('plainExplain').textContent = 'Engine error — see console.';
    return;
  }

  devTools.updateTrace(result);

  $('heroGreeting').textContent = result.salutation || result.greeting || 'Hello!';

  const ev = result.metadata?.eventId || '—';
  const domain = result.metadata?.domain || '—';
  const score = result.metadata?.score ?? '—';
  const locale = result.metadata?.locale || state.greetingLanguage;

  $('metaEvent').textContent = `event: ${ev}`;
  $('metaWhy').textContent = `priority ${score} · ${domain}`;
  $('metaLang').textContent = `${locale} / ${state.scriptPref}`;
  $('metaKey').textContent = `pack: ${locale}`;

  const devBadge = document.getElementById('devBadge');
  if (devBadge) devBadge.textContent = ev;
  const devTrace = document.getElementById('devTrace');
  if (devTrace) devTrace.textContent = JSON.stringify(result.metadata?.trace ?? result.metadata, null, 2);
  const devContext = document.getElementById('devContext');
  if (devContext) devContext.textContent = JSON.stringify(ctx, null, 2);
  const devCandidates = document.getElementById('devCandidates');
  if (devCandidates) devCandidates.textContent = JSON.stringify({ greeting: result.greeting, address: result.address, salutation: result.salutation }, null, 2);

  const dateIso = fmtISO(state.now);
  const timeIso = `${pad2(state.now.getHours())}:${pad2(state.now.getMinutes())}`;

  const safeDisplayName = (locale: string, type: 'language' | 'region' | 'script', code: string) => {
    try { return new Intl.DisplayNames([locale], { type }).of(code) || code; }
    catch { return code; }
  };

  const localDate = new Intl.DateTimeFormat(state.residenceLocale, { dateStyle: 'full' }).format(state.now);
  const localTime = new Intl.DateTimeFormat(state.residenceLocale, { timeStyle: 'short' }).format(state.now);
  const langEndonym = safeDisplayName(state.greetingLanguage, 'language', state.greetingLanguage);
  const regionCode = state.residenceLocale.split('-')[1] || state.residenceLocale;
  const regionLang = state.residenceLocale.split('-')[0] || 'en';
  const localRegion = safeDisplayName(regionLang, 'region', regionCode);

  const tzDisplay = state.timezone;
  const scenarioSel = ($('scenario') as HTMLSelectElement).value;
  const namesDisplay = state.primaryName || '—';

  const scenarioLabels: Record<string, string> = {
    '': '—', de_secular: 'German secular', de_doctor: 'German: Herr Doktor', en_judge: 'English: Your Honor',
    tr_muslim_de: 'Turkish Muslim in Germany', el_orthodox: 'Greek Orthodox',
    zh_diaspora: 'Chinese diaspora', dev_mixed: 'Mixed: English + Arabic Eid',
  };

  const tzOpts = mkOpts([['auto', 'auto'], ['UTC', 'UTC'], ['Europe/Berlin', 'Europe/Berlin'], ['Europe/Brussels', 'Europe/Brussels'], ['Europe/Athens', 'Europe/Athens'], ['Asia/Istanbul', 'Asia/Istanbul'], ['Asia/Shanghai', 'Asia/Shanghai']], ($('timezone') as HTMLSelectElement).value);
  const langOpts = mkOpts([['de-DE', 'de-DE'], ['en-GB', 'en-GB'], ['el-GR', 'el-GR'], ['tr-TR', 'tr-TR'], ['ar', 'ar'], ['zh-CN', 'zh-CN'], ['zh-TW', 'zh-TW']], state.greetingLanguage);
  const scriptOpts = mkOpts([['latin', 'latin'], ['native', 'native'], ['arabic', 'arabic'], ['simplified', 'simplified'], ['traditional', 'traditional']], state.scriptPref);
  const regionOpts = mkOpts([['de-DE', 'de-DE'], ['nl-BE', 'nl-BE'], ['el-GR', 'el-GR'], ['tr-TR', 'tr-TR'], ['en-GB', 'en-GB'], ['zh-CN', 'zh-CN']], state.residenceLocale);
  const formalityOpts = mkOpts([['informal', 'informal'], ['formal', 'formal']], state.formality);
  const modeOpts = mkOpts([['opening', 'opening'], ['closing', 'closing']], state.mode);
  const scenarioOpts = mkOpts([['', '—'], ['de_secular', 'de_secular'], ['de_doctor', 'de_doctor'], ['en_judge', 'en_judge'], ['tr_muslim_de', 'tr_muslim_de'], ['el_orthodox', 'el_orthodox'], ['zh_diaspora', 'zh_diaspora'], ['dev_mixed', 'dev_mixed']], scenarioSel);
  const outOpts = mkOpts([['salutation', 'salutation'], ['greeting', 'greeting'], ['address', 'address']], state.outputMode);
  const relOpts = mkOpts([['stranger', 'stranger'], ['acquaintance', 'acquaintance'], ['friend', 'friend'], ['family', 'family'], ['superior', 'superior'], ['subordinate', 'subordinate']], state.relationship);
  const setOpts = mkOpts([['ui', 'ui'], ['chat', 'chat'], ['email', 'email']], state.setting);
  const genderOpts = mkOpts([['unknown', 'unknown'], ['male', 'male'], ['female', 'female'], ['nonbinary', 'nonbinary']], state.gender);
  const titleOpts = mkOpts([['none', 'none'], ['mr', 'mr'], ['mrs', 'mrs'], ['ms', 'ms'], ['mx', 'mx'], ['dr', 'dr'], ['prof', 'prof'], ['prof_dr', 'prof_dr'], ['judge', 'judge'], ['police', 'police'], ['clergy', 'clergy']], state.titleRole);

  const activeAffs = AFFILIATIONS.filter((a) => selectedAff.has(a.id));
  const activeChipsHtml = activeAffs.map((a) => `<span class="aff-chip on" data-aff="${a.id}">${a.label}</span>`).join(' ');
  const allChipsHtml = AFFILIATIONS.map((a) => `<span class="aff-chip${selectedAff.has(a.id) ? ' on' : ''}" data-aff="${a.id}">${a.label}</span>`).join(' ');
  const affHtml = `<span id="affActive">${activeChipsHtml} <span class="aff-chip" id="affToggle">+</span></span><span id="affAll" style="display:none">${allChipsHtml} <span class="aff-chip" id="affCollapse">\u2212</span></span>`;

  const namedaysLbl = state.namedaysEnabled ? 'celebrate namedays' : 'do not celebrate namedays';
  const civilLbl = state.civilParticipation ? 'participate in residence civil holidays' : 'do not participate in residence civil holidays';

  const p =
    `Today is ${iVar(esc(localDate), iInpCtrl('inlineDate', 'date', dateIso))}; ` +
    `it is ${iVar(esc(localTime), iInpCtrl('inlineTime', 'time', timeIso))} in ${iVar(esc(tzDisplay), iSelCtrl('inlineTZ', tzOpts))}. ` +
    `Your user is a ${iVar(esc(scenarioLabels[scenarioSel] || '—'), iSelCtrl('inlineScenario', scenarioOpts))}: ` +
    `they speak ${iVar(esc(langEndonym), iSelCtrl('inlineLang', langOpts))}, ` +
    `read in ${iVar(esc(state.scriptPref), iSelCtrl('inlineScript', scriptOpts))} script, ` +
    `and reside in ${iVar(esc(localRegion), iSelCtrl('inlineRegion', regionOpts))}. ` +
    `They identify culturally as ${affHtml}, ` +
    `<label style="cursor:pointer"><input type="checkbox" id="inlineNamedays"${state.namedaysEnabled ? ' checked' : ''}> ${namedaysLbl}</label>, ` +
    `and <label style="cursor:pointer"><input type="checkbox" id="inlineCivil"${state.civilParticipation ? ' checked' : ''}> ${civilLbl}</label>. ` +
    `They are ${iVar(esc(state.titleRole), iSelCtrl('inlineTitleRole', titleOpts))} ` +
    `${iVar(esc(state.surname || '—'), iInpCtrl('inlineSurname', 'text', state.surname, ' placeholder="surname" style="width:140px"'))} ` +
    `(${iVar(esc(state.gender), iSelCtrl('inlineGender', genderOpts))}), ` +
    `and are called ${iVar(esc(namesDisplay), iInpCtrl('inlineName', 'text', state.names.join('; '), ' placeholder="name(s)" style="width:140px"'))}. ` +
    `You are greeting them ${iVar(esc(state.mode), iSelCtrl('inlineMode', modeOpts))} ` +
    `as a ${iVar(esc(state.relationship), iSelCtrl('inlineRelationship', relOpts))} ` +
    `via ${iVar(esc(state.setting), iSelCtrl('inlineSetting', setOpts))}, ` +
    `and want ${iVar(state.formality === 'formal' ? 'formal' : 'informal', iSelCtrl('inlineFormality', formalityOpts))} address. ` +
    `Output is ${iVar(esc(state.outputMode), iSelCtrl('inlineOutputMode', outOpts))}. ` +
    `Therefore you should greet them with:`;

  const pe = $('plainExplain');
  pe.innerHTML = p;
  wireInlineControls(pe);
  renderAlsoStrip(state);
}

function wireInlineControls(pe: HTMLElement) {
  pe.querySelectorAll('.var').forEach((wrap) => {
    const vd = wrap.querySelector('.vd') as HTMLElement;
    const ve = wrap.querySelector('.ve') as HTMLElement;
    if (!vd || !ve) return;
    const ctrl = ve.querySelector('select, input') as HTMLElement;
    if (!ctrl) return;
    vd.onclick = () => { pauseAuto(); vd.style.display = 'none'; ve.style.display = 'inline'; ctrl.focus(); };
    ctrl.addEventListener('blur', () => { setTimeout(() => { ve.style.display = 'none'; vd.style.display = 'inline'; }, 150); });
  });

  const bind = (inlineId: string, drawerId: string) => {
    const a = document.getElementById(inlineId) as HTMLInputElement | HTMLSelectElement | null;
    const b = document.getElementById(drawerId) as HTMLInputElement | HTMLSelectElement | null;
    if (!a || !b) return;
    a.onchange = () => { b.value = a.value; pauseAuto(); rebuildTimelineAndUpdate(true); };
  };
  bind('inlineDate', 'date'); bind('inlineTime', 'time'); bind('inlineTZ', 'timezone');
  bind('inlineLang', 'greetingLanguage'); bind('inlineScript', 'scriptPref'); bind('inlineRegion', 'residenceLocale');
  bind('inlineFormality', 'formality'); bind('inlineMode', 'mode'); bind('inlineName', 'givenNames');
  bind('inlineSurname', 'surname'); bind('inlineOutputMode', 'outputMode'); bind('inlineRelationship', 'relationship');
  bind('inlineSetting', 'setting'); bind('inlineGender', 'gender'); bind('inlineTitleRole', 'titleRole');

  const inlineScenario = document.getElementById('inlineScenario') as HTMLSelectElement | null;
  if (inlineScenario) {
    inlineScenario.onchange = () => { pauseAuto(); ($('scenario') as HTMLSelectElement).value = inlineScenario.value; if (inlineScenario.value) applyScenario(inlineScenario.value); };
  }

  const bindChk = (inlineId: string, drawerId: string) => {
    const a = document.getElementById(inlineId) as HTMLInputElement | null;
    const b = document.getElementById(drawerId) as HTMLInputElement | null;
    if (!a || !b) return;
    a.onchange = () => { b.checked = a.checked; pauseAuto(); rebuildTimelineAndUpdate(true); };
  };
  bindChk('inlineNamedays', 'namedaysEnabled'); bindChk('inlineCivil', 'civilParticipation');

  const affToggle = document.getElementById('affToggle');
  const affCollapse = document.getElementById('affCollapse');
  const affActiveEl = document.getElementById('affActive');
  const affAllEl = document.getElementById('affAll');
  if (affToggle && affActiveEl && affAllEl) affToggle.onclick = () => { affActiveEl.style.display = 'none'; affAllEl!.style.display = 'inline'; };
  if (affCollapse && affActiveEl && affAllEl) affCollapse.onclick = () => { affAllEl.style.display = 'none'; affActiveEl!.style.display = 'inline'; };

  pe.querySelectorAll('.aff-chip[data-aff]').forEach((chip) => {
    (chip as HTMLElement).onclick = () => {
      pauseAuto();
      const aid = (chip as HTMLElement).dataset.aff!;
      if (selectedAff.has(aid)) selectedAff.delete(aid); else selectedAff.add(aid);
      if (selectedAff.size === 0) selectedAff.add('civil');
      renderAffChips();
      rebuildTimelineAndUpdate(true);
    };
  });
}

function renderAlsoStrip(state: ReturnType<typeof stateSnapshot>) {
  const host = $('alsoStrip');
  host.innerHTML = '';
  const samples = [
    { flag: '🇩🇪', lang: 'de-DE' },
    { flag: '🇬🇧', lang: 'en-GB' },
    { flag: '🇬🇷', lang: 'el-GR' },
    { flag: '🇸🇦', lang: 'ar' },
    { flag: '🇨🇳', lang: 'zh-CN' },
  ];
  for (const s of samples) {
    const div = document.createElement('div');
    div.className = 'chip';
    div.innerHTML = `${s.flag} <span class="mono">…</span>`;
    host.appendChild(div);
    engine.resolve({ ...buildContext(state), locale: s.lang } as any).then((r) => {
      div.innerHTML = `${s.flag} <span class="mono">${esc(r.salutation || r.greeting || '—')}</span>`;
    }).catch(() => {});
  }
}

async function computeTimeline(state: ReturnType<typeof stateSnapshot>): Promise<TimelineItem[]> {
  const items: TimelineItem[] = [];
  const base = new Date(state.now.getFullYear(), state.now.getMonth(), state.now.getDate(), state.now.getHours(), state.now.getMinutes());

  items.push({ date: new Date(base), key: fmtISO(base), label: 'Today', type: 'civil' });

  const seen = new Set<string>();
  for (let i = 1; i <= 365; i++) {
    const dt = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i, 12, 0);
    try {
      const ctx = { ...buildContext(state), now: dt };
      const res = await engine.resolve(ctx as any);
      const eid = res.metadata?.eventId;
      const dom = res.metadata?.domain;
      if (!eid || dom === 'temporal' || dom === 'cultural_baseline') continue;
      if (seen.has(eid)) continue;
      seen.add(eid);
      const type = classifyDomain(dom || 'civil');
      items.push({
        date: dt, key: `${fmtISO(dt)}:${eid}`,
        label: eid.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        type, eventId: eid, domain: dom,
      });
    } catch { /* skip */ }
    if (items.length >= 12) break;
  }
  items.sort((a, b) => a.date.getTime() - b.date.getTime());
  return items.slice(0, 12);
}

function renderTimeline(selectedKey: string) {
  const track = $('timelineTrack');
  track.innerHTML = '';
  const loc = (document.getElementById('residenceLocale') as HTMLSelectElement)?.value || 'en-GB';
  for (const it of timelineItems) {
    const node = document.createElement('div');
    node.className = 'node' + (it.key === selectedKey ? ' sel' : '');
    const when = it.label === 'Today' ? 'Today' : it.date.toLocaleDateString(loc, { day: 'numeric', month: 'long' });
    node.innerHTML =
      `<div class="when">${esc(when)}</div>` +
      `<div class="label">${esc(it.label)}</div>` +
      `<div class="cal-info"></div>` +
      `<div><span class="badge ${badgeClass(it.type)}">${badgeLabel(it.type)}</span></div>`;
    node.onclick = () => {
      restartAuto();
      setDateInUI(it.date);
      updateFromUI({ setMemory: false });
      highlightTimeline(it.key, true);
    };
    track.appendChild(node);
  }
}

function highlightTimeline(key: string, scrollIntoView: boolean) {
  const nodes = Array.from($('timelineTrack').querySelectorAll('.node'));
  nodes.forEach((n, i) => {
    const it = timelineItems[i];
    n.classList.toggle('sel', it && it.key === key);
    if (scrollIntoView && it && it.key === key) {
      n.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }
  });
}

function setDateInUI(d: Date) {
  ($('date') as HTMLInputElement).value = fmtISO(d);
  ($('time') as HTMLInputElement).value = `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function startAuto() {
  if (autoTimer) clearInterval(autoTimer);
  autoTimer = setInterval(() => {
    if (timelineItems.length <= 1) return;
    autoIndex = (autoIndex + 1) % timelineItems.length;
    const it = timelineItems[autoIndex];
    setDateInUI(it.date);
    updateFromUI({ setMemory: false });
    highlightTimeline(it.key, true);
  }, 3500);
}
function restartAuto() {
  if (resumeTimer) { clearTimeout(resumeTimer); resumeTimer = null; }
  autoIndex = 0;
  startAuto();
}
function pauseAuto() {
  if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  if (resumeTimer) clearTimeout(resumeTimer);
  resumeTimer = setTimeout(() => { resumeTimer = null; startAuto(); }, 15000);
}

async function rebuildTimelineAndUpdate(isUserAction = false) {
  const state = stateSnapshot();
  timelineItems = await computeTimeline(state);
  const match = timelineItems[0];
  renderTimeline(match?.key || '');
  autoIndex = 0;
  await updateFromUI({ setMemory: !isUserAction });
}

function renderAffChips() {
  const host = $('affChips');
  host.innerHTML = '';
  for (const a of AFFILIATIONS) {
    const chip = document.createElement('div');
    chip.className = 'a ' + (selectedAff.has(a.id) ? 'on' : '');
    chip.textContent = a.label;
    chip.onclick = () => {
      if (selectedAff.has(a.id)) selectedAff.delete(a.id); else selectedAff.add(a.id);
      if (selectedAff.size === 0) selectedAff.add('civil');
      renderAffChips();
      rebuildTimelineAndUpdate(true);
    };
    host.appendChild(chip);
  }
}

function applyScenario(id: string) {
  const s: Record<string, () => void> = {
    de_secular: () => {
      ($('surname') as HTMLInputElement).value = 'Müller'; ($('gender') as HTMLSelectElement).value = 'male';
      ($('titleRole') as HTMLSelectElement).value = 'none'; ($('relationship') as HTMLSelectElement).value = 'stranger';
      ($('setting') as HTMLSelectElement).value = 'ui'; ($('outputMode') as HTMLSelectElement).value = 'salutation';
      ($('residenceLocale') as HTMLSelectElement).value = 'de-DE'; ($('greetingLanguage') as HTMLSelectElement).value = 'de-DE';
      ($('scriptPref') as HTMLSelectElement).value = 'latin'; selectedAff = new Set(['civil']);
      ($('givenNames') as HTMLInputElement).value = 'Johannes'; ($('namedaysEnabled') as HTMLInputElement).checked = false;
      ($('civilParticipation') as HTMLInputElement).checked = true;
    },
    de_doctor: () => {
      ($('residenceLocale') as HTMLSelectElement).value = 'de-DE'; ($('greetingLanguage') as HTMLSelectElement).value = 'de-DE';
      ($('scriptPref') as HTMLSelectElement).value = 'latin'; selectedAff = new Set(['civil']);
      ($('givenNames') as HTMLInputElement).value = 'Hans'; ($('surname') as HTMLInputElement).value = 'Müller';
      ($('gender') as HTMLSelectElement).value = 'male'; ($('titleRole') as HTMLSelectElement).value = 'dr';
      ($('relationship') as HTMLSelectElement).value = 'stranger'; ($('formality') as HTMLSelectElement).value = 'formal';
      ($('setting') as HTMLSelectElement).value = 'ui'; ($('outputMode') as HTMLSelectElement).value = 'salutation';
    },
    en_judge: () => {
      ($('residenceLocale') as HTMLSelectElement).value = 'en-GB'; ($('greetingLanguage') as HTMLSelectElement).value = 'en-GB';
      ($('scriptPref') as HTMLSelectElement).value = 'latin'; selectedAff = new Set(['civil']);
      ($('givenNames') as HTMLInputElement).value = 'Alex'; ($('surname') as HTMLInputElement).value = '';
      ($('gender') as HTMLSelectElement).value = 'unknown'; ($('titleRole') as HTMLSelectElement).value = 'judge';
      ($('relationship') as HTMLSelectElement).value = 'subordinate'; ($('formality') as HTMLSelectElement).value = 'formal';
    },
    tr_muslim_de: () => {
      ($('residenceLocale') as HTMLSelectElement).value = 'de-DE'; ($('greetingLanguage') as HTMLSelectElement).value = 'tr-TR';
      ($('scriptPref') as HTMLSelectElement).value = 'latin'; selectedAff = new Set(['civil', 'islamic']);
      ($('givenNames') as HTMLInputElement).value = 'Mehmet';
    },
    el_orthodox: () => {
      ($('residenceLocale') as HTMLSelectElement).value = 'el-GR'; ($('greetingLanguage') as HTMLSelectElement).value = 'el-GR';
      ($('scriptPref') as HTMLSelectElement).value = 'native'; selectedAff = new Set(['civil', 'orthodox']);
      ($('givenNames') as HTMLInputElement).value = 'Γιάννης'; ($('namedaysEnabled') as HTMLInputElement).checked = true;
    },
    zh_diaspora: () => {
      ($('residenceLocale') as HTMLSelectElement).value = 'de-DE'; ($('greetingLanguage') as HTMLSelectElement).value = 'zh-CN';
      ($('scriptPref') as HTMLSelectElement).value = 'simplified'; selectedAff = new Set(['civil', 'chinese_traditional']);
      ($('givenNames') as HTMLInputElement).value = 'Wei';
    },
    dev_mixed: () => {
      ($('residenceLocale') as HTMLSelectElement).value = 'en-GB'; ($('greetingLanguage') as HTMLSelectElement).value = 'ar';
      ($('scriptPref') as HTMLSelectElement).value = 'arabic'; selectedAff = new Set(['islamic']);
      ($('givenNames') as HTMLInputElement).value = 'Amina';
    },
  };
  if (s[id]) s[id]();
  renderAffChips();
  rebuildTimelineAndUpdate(true);
}

function openDrawer() {
  document.getElementById('drawer')?.classList.add('open');
  document.getElementById('overlay')?.classList.add('show');
}

function closeDrawer() {
  document.getElementById('drawer')?.classList.remove('open');
  document.getElementById('overlay')?.classList.remove('show');
}

function wireDrawer() {
  $('btnSettings')?.addEventListener('click', openDrawer);
  $('btnClose')?.addEventListener('click', closeDrawer);
  $('overlay')?.addEventListener('click', closeDrawer);
}

function wireInputs() {
  const ids = ['mode', 'formality', 'outputMode', 'relationship', 'setting', 'gender', 'surname', 'titleRole', 'date', 'time', 'timezone', 'givenNames', 'birthday', 'residenceLocale', 'greetingLanguage', 'scriptPref', 'civilParticipation', 'namedaysEnabled'];
  ids.forEach((id) => {
    $(id)?.addEventListener('change', () => { pauseAuto(); rebuildTimelineAndUpdate(true); });
  });
  $('scenario')?.addEventListener('change', (e) => {
    const v = (e.target as HTMLSelectElement).value;
    if (v) applyScenario(v);
  });

  $('timelineTrack')?.addEventListener('wheel', () => restartAuto(), { passive: true });
  $('timelineTrack')?.addEventListener('touchstart', () => restartAuto(), { passive: true });
}

async function init() {
  devTools.mount();
  devTools.setOnContextChange((newCtx: Partial<{ now: Date; formality: string }>) => {
    if (newCtx.now) setDateInUI(newCtx.now);
    if (newCtx.formality) ($('formality') as HTMLSelectElement).value = newCtx.formality;
    rebuildTimelineAndUpdate(true);
  });

  const now = new Date();
  setDateInUI(now);
  ($('timezone') as HTMLSelectElement).value = 'auto';

  const nav = (navigator.language || 'en-GB').toLowerCase();
  const residence = nav.startsWith('el') ? 'el-GR' : nav.startsWith('tr') ? 'tr-TR' : nav.startsWith('zh') ? 'zh-CN' : nav.startsWith('nl') ? 'nl-BE' : nav.startsWith('de') ? 'de-DE' : 'de-DE';
  ($('residenceLocale') as HTMLSelectElement).value = residence;
  ($('greetingLanguage') as HTMLSelectElement).value = residence === 'nl-BE' ? 'de-DE' : residence;

  ($('givenNames') as HTMLInputElement).value = 'Jan; Mehmet; Giannis';
  ($('surname') as HTMLInputElement).value = 'Müller';
  ($('gender') as HTMLSelectElement).value = 'male';
  ($('titleRole') as HTMLSelectElement).value = 'dr';
  ($('relationship') as HTMLSelectElement).value = 'stranger';
  ($('setting') as HTMLSelectElement).value = 'ui';
  ($('outputMode') as HTMLSelectElement).value = 'salutation';
  ($('mode') as HTMLSelectElement).value = 'opening';
  ($('formality') as HTMLSelectElement).value = 'informal';

  selectedAff = new Set(['civil', 'islamic', 'orthodox', 'chinese_traditional']);
  renderAffChips();
  wireDrawer();
  wireInputs();

  const devPacks = document.getElementById('devPacks');
  if (devPacks) devPacks.textContent = JSON.stringify(DEMO_PACKS, null, 2);

  await rebuildTimelineAndUpdate(false);
  startAuto();
}

init();
