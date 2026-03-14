import './style.css';
import { SalveEngine, AddressEngine, CompositionEngine } from '@salve/core';
import type { AddressAudience, AddressRecipient, AddressTitleToken, SalveRenderPolicy } from '@salve/types';
import { globalAddressPacks, globalProtocolPacks } from '@salve/pack-global-addresses';
import { DEMO_PACKS } from './packs';

const engine = new SalveEngine();
// Register Greek National & Religious Holidays (Fixed Dates)
// Plugins removed until available in build path

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

// Persistent state for invisible controls
const state = {
  now: new Date(),
  timezone: 'auto',
  mode: 'opening',
  formality: 'informal' as 'formal' | 'informal',
  residenceLocale: 'de-DE',
  greetingLanguage: 'de-DE',
  scriptPref: 'latin',
  names: ['Jan', 'Mehmet', 'Giannis'],
  surname: 'Müller',
  gender: 'male',
  titleRole: 'dr',
  outputMode: 'salutation',
  relationship: 'stranger',
  setting: 'ui',
  civilParticipation: true,
  namedaysEnabled: true,
  scenario: '',
};

interface TimelineItem {
  date: Date;
  key: string;
  label: string;
  type: string;
  eventId?: string;
  domain?: string;
}
let timelineItems: TimelineItem[] = [];

function buildContext(): Record<string, unknown> {
  const tz = state.timezone === 'auto' ? Intl.DateTimeFormat().resolvedOptions().timeZone : state.timezone;
  return {
    now: state.now,
    locale: state.greetingLanguage,
    formality: state.formality,
    affiliations: Array.from(selectedAff),
    relationship: state.relationship,
    setting: state.setting === 'ui' ? 'ui' : state.setting === 'chat' ? 'chat' : 'email',
    phase: state.mode === 'opening' ? 'encounter' : 'parting',
    profile: {
      firstName: state.names[0] || undefined,
      lastName: state.surname || undefined,
      gender: state.gender !== 'unknown' ? state.gender : undefined,
      academicTitles: state.titleRole === 'dr' ? ['Dr.']
        : state.titleRole === 'prof' ? ['Prof.']
          : state.titleRole === 'prof_dr' ? ['Prof.', 'Dr.']
            : undefined,
      professionalRole: state.titleRole === 'judge' ? 'judge'
        : state.titleRole === 'police' ? 'police'
          : state.titleRole === 'clergy' ? 'clergy'
            : state.titleRole === 'teacher' ? 'teacher'
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

async function updateFromUI() {
  const ctx = buildContext();
  let result;
  try {
    result = await engine.resolve(ctx as any);
  } catch (e) {
    console.error('Engine resolve failed:', e);
    $('heroGreeting').textContent = 'Hello!';
    return;
  }

  $('heroGreeting').textContent = result.salutation || result.greeting || 'Hello!';

  const ev = result.metadata?.eventId || '—';
  const domain = result.metadata?.domain || '—';
  const score = result.metadata?.score ?? '—';
  const locale = result.metadata?.locale || state.greetingLanguage;

  $('metaEvent').textContent = `event: ${ev}`;
  $('metaWhy').textContent = `priority ${score} · ${domain}`;
  $('metaLang').textContent = `${locale} / ${state.scriptPref}`;
  $('metaKey').textContent = `pack: ${locale}`;

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

  const scenarioLabels: Record<string, string> = {
    '': '—', de_secular: 'sculptor from Berlin', de_doctor: 'academic from Munich', en_judge: 'formal judge',
    tr_muslim_de: 'Turkish diaspora', el_orthodox: 'Greek Orthodox',
    zh_diaspora: 'Chinese diaspora', dev_mixed: 'Mixed cultural context',
    el_teacher: 'teacher from Athens',
  };

  const tzOpts = mkOpts([['auto', 'auto'], ['UTC', 'UTC'], ['Europe/Berlin', 'Europe/Berlin'], ['Europe/Brussels', 'Europe/Brussels'], ['Europe/Athens', 'Europe/Athens'], ['Asia/Istanbul', 'Asia/Istanbul'], ['Asia/Shanghai', 'Asia/Shanghai']], state.timezone);
  const langOpts = mkOpts([['de-DE', 'German'], ['en-GB', 'English'], ['el-GR', 'Greek'], ['tr-TR', 'Turkish'], ['ar', 'Arabic'], ['zh-CN', 'Chinese (Simp)'], ['zh-TW', 'Chinese (Trad)']], state.greetingLanguage);
  const scriptOpts = mkOpts([['latin', 'latin'], ['native', 'native'], ['arabic', 'arabic'], ['simplified', 'simplified'], ['traditional', 'traditional']], state.scriptPref);
  const regionOpts = mkOpts([['de-DE', 'Germany'], ['nl-BE', 'Belgium'], ['el-GR', 'Greece'], ['tr-TR', 'Turkey'], ['en-GB', 'United Kingdom'], ['zh-CN', 'China']], state.residenceLocale);
  const formalityOpts = mkOpts([['informal', 'informal'], ['formal', 'formal']], state.formality);
  const modeOpts = mkOpts([['opening', 'opening'], ['closing', 'closing']], state.mode);
  const scenarioOpts = mkOpts([['', '—'], ['de_secular', 'German secular'], ['de_doctor', 'German academic'], ['en_judge', 'British judge'], ['tr_muslim_de', 'Turkish Muslim'], ['el_orthodox', 'Greek Orthodox'], ['el_teacher', 'Greek Teacher'], ['zh_diaspora', 'Chinese diaspora'], ['dev_mixed', 'Mixed Eid/English']], state.scenario);
  const outOpts = mkOpts([['salutation', 'full salutation'], ['greeting', 'greeting only'], ['address', 'address only']], state.outputMode);
  const relOpts = mkOpts([['stranger', 'stranger'], ['acquaintance', 'acquaintance'], ['friend', 'friend'], ['family', 'family'], ['superior', 'superior'], ['subordinate', 'subordinate']], state.relationship);
  const setOpts = mkOpts([['ui', 'app UI'], ['chat', 'chat bubble'], ['email', 'email template']], state.setting);
  const genderOpts = mkOpts([['unknown', 'unknown'], ['male', 'male'], ['female', 'female'], ['nonbinary', 'non-binary']], state.gender);
  const titleOpts = mkOpts([['none', 'no title'], ['mr', 'Mr'], ['mrs', 'Mrs'], ['ms', 'Ms'], ['mx', 'Mx'], ['dr', 'Doctor'], ['prof', 'Professor'], ['prof_dr', 'Prof. Dr.'], ['teacher', 'Teacher'], ['judge', 'Judge'], ['police', 'Officer'], ['clergy', 'Reverend']], state.titleRole);

  const activeAffs = AFFILIATIONS.filter((a) => selectedAff.has(a.id));
  const activeChipsHtml = activeAffs.map((a) => `<span class="aff-chip on" data-aff="${a.id}">${a.label}</span>`).join(' ');
  const allChipsHtml = AFFILIATIONS.map((a) => `<span class="aff-chip${selectedAff.has(a.id) ? ' on' : ''}" data-aff="${a.id}">${a.label}</span>`).join(' ');
  const affHtml = `<span id="affActive">${activeChipsHtml} <span class="aff-chip" id="affToggle">+</span></span><span id="affAll" style="display:none">${allChipsHtml} <span class="aff-chip" id="affCollapse">\u2212</span></span>`;

  const namedaysLbl = state.namedaysEnabled ? 'celebrate namedays' : 'ignore namedays';
  const civilLbl = state.civilParticipation ? 'observe civil holidays' : 'ignore civil holidays';

  const p =
    `It is ${iVar(esc(localTime), iInpCtrl('inlineTime', 'time', timeIso))} on a ` +
    `${iVar(esc(localDate), iInpCtrl('inlineDate', 'date', dateIso))} in ` +
    `${iVar(esc(state.timezone), iSelCtrl('inlineTZ', tzOpts))}. ` +
    `Your user, a ${iVar(esc(scenarioLabels[state.scenario] || 'person'), iSelCtrl('inlineScenario', scenarioOpts))}, ` +
    `speaks ${iVar(esc(langEndonym), iSelCtrl('inlineLang', langOpts))} and prefers the ` +
    `${iVar(esc(state.scriptPref), iSelCtrl('inlineScript', scriptOpts))} script. ` +
    `They live in ${iVar(esc(localRegion), iSelCtrl('inlineRegion', regionOpts))} and identify with ` +
    `${affHtml} cultures. They ${iVar(namedaysLbl, `<input type="checkbox" id="inlineNamedays"${state.namedaysEnabled ? ' checked' : ''}>`)} ` +
    `and ${iVar(civilLbl, `<input type="checkbox" id="inlineCivil"${state.civilParticipation ? ' checked' : ''}>`)}. ` +
    `This person is ${iVar(esc(state.titleRole === 'none' ? 'not titled' : state.titleRole), iSelCtrl('inlineTitleRole', titleOpts))}, ` +
    `has the surname ${iVar(esc(state.surname || '—'), iInpCtrl('inlineSurname', 'text', state.surname, ' placeholder="surname" style="width:140px"'))}, ` +
    `identifies as ${iVar(esc(state.gender), iSelCtrl('inlineGender', genderOpts))}, and goes by ` +
    `${iVar(esc(state.names.join('; ') || '—'), iInpCtrl('inlineName', 'text', state.names.join('; '), ' placeholder="name(s)" style="width:140px"'))}. ` +
    `You are greeting them ${iVar(esc(state.mode), iSelCtrl('inlineMode', modeOpts))} ` +
    `as a ${iVar(esc(state.relationship), iSelCtrl('inlineRelationship', relOpts))} ` +
    `inside a ${iVar(esc(state.setting), iSelCtrl('inlineSetting', setOpts))}. ` +
    `The interaction should be ${iVar(state.formality, iSelCtrl('inlineFormality', formalityOpts))}, ` +
    `delivering a ${iVar(esc(state.outputMode), iSelCtrl('inlineOutputMode', outOpts))}.`;

  const pe = $('plainExplain');
  pe.innerHTML = p;
  wireInlineControls(pe);
  renderAlsoStrip();
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

  const bind = (id: string, key: keyof typeof state) => {
    const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
    if (!el) return;
    el.onchange = () => {
      (state as any)[key] = el.value;
      if (key === 'now') { /* handled by date/time separately */ }
      pauseAuto();
      rebuildTimelineAndUpdate();
    };
  };

  const bindDate = () => {
    const d = document.getElementById('inlineDate') as HTMLInputElement | null;
    const t = document.getElementById('inlineTime') as HTMLInputElement | null;
    if (!d || !t) return;
    const update = () => {
      state.now = new Date(d.value + 'T' + t.value + ':00');
      pauseAuto();
      rebuildTimelineAndUpdate();
    };
    d.onchange = update;
    t.onchange = update;
  };
  bindDate();
  bind('inlineTZ', 'timezone');
  bind('inlineLang', 'greetingLanguage');
  bind('inlineScript', 'scriptPref');
  bind('inlineRegion', 'residenceLocale');
  bind('inlineFormality', 'formality');
  bind('inlineMode', 'mode');

  const inlineName = document.getElementById('inlineName') as HTMLInputElement | null;
  if (inlineName) {
    inlineName.onchange = () => {
      state.names = inlineName.value.split(';').map(s => s.trim()).filter(Boolean);
      pauseAuto();
      rebuildTimelineAndUpdate();
    };
  }

  bind('inlineSurname', 'surname');
  bind('inlineOutputMode', 'outputMode');
  bind('inlineRelationship', 'relationship');
  bind('inlineSetting', 'setting');
  bind('inlineGender', 'gender');
  bind('inlineTitleRole', 'titleRole');

  const inlineScenario = document.getElementById('inlineScenario') as HTMLSelectElement | null;
  if (inlineScenario) {
    inlineScenario.onchange = () => {
      state.scenario = inlineScenario.value;
      pauseAuto();
      if (state.scenario) applyScenario(state.scenario);
      rebuildTimelineAndUpdate();
    };
  }

  const bindChk = (id: string, key: keyof typeof state) => {
    const el = document.getElementById(id) as HTMLInputElement | null;
    if (!el) return;
    el.onchange = () => {
      (state as any)[key] = el.checked;
      pauseAuto();
      rebuildTimelineAndUpdate();
    };
  };
  bindChk('inlineNamedays', 'namedaysEnabled');
  bindChk('inlineCivil', 'civilParticipation');

  const affToggle = document.getElementById('affToggle');
  const affCollapse = document.getElementById('affCollapse');
  const affActiveEl = document.getElementById('affActive');
  const affAllEl = document.getElementById('affAll');
  if (affToggle && affActiveEl && affAllEl) affToggle.onclick = (e) => { e.stopPropagation(); affActiveEl.style.display = 'none'; affAllEl!.style.display = 'inline'; };
  if (affCollapse && affActiveEl && affAllEl) affCollapse.onclick = (e) => { e.stopPropagation(); affAllEl.style.display = 'none'; affActiveEl!.style.display = 'inline'; };

  pe.querySelectorAll('.aff-chip[data-aff]').forEach((chip) => {
    (chip as HTMLElement).onclick = (e) => {
      e.stopPropagation();
      pauseAuto();
      const aid = (chip as HTMLElement).dataset.aff!;
      if (selectedAff.has(aid)) selectedAff.delete(aid); else selectedAff.add(aid);
      if (selectedAff.size === 0) selectedAff.add('civil');
      rebuildTimelineAndUpdate();
    };
  });
}

function renderAlsoStrip() {
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
    engine.resolve({ ...buildContext(), locale: s.lang } as any).then((r) => {
      div.innerHTML = `${s.flag} <span class="mono">${esc(r.salutation || r.greeting || '—')}</span>`;
    }).catch(() => { });
  }
}

async function computeTimeline(): Promise<TimelineItem[]> {
  const items: TimelineItem[] = [];
  const base = new Date(state.now.getFullYear(), state.now.getMonth(), state.now.getDate(), state.now.getHours(), state.now.getMinutes());

  items.push({ date: new Date(base), key: fmtISO(base), label: 'Today', type: 'civil' });

  const seen = new Set<string>();
  for (let i = 1; i <= 365; i++) {
    const dt = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i, 12, 0);
    try {
      const ctx = { ...buildContext(), now: dt };
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
  const loc = state.residenceLocale || 'en-GB';
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
      state.now = new Date(it.date);
      updateFromUI();
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

function startAuto() {
  if (autoTimer) clearInterval(autoTimer);
  autoTimer = setInterval(() => {
    if (timelineItems.length <= 1) return;
    autoIndex = (autoIndex + 1) % timelineItems.length;
    const it = timelineItems[autoIndex];
    state.now = new Date(it.date);
    updateFromUI();
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

async function rebuildTimelineAndUpdate() {
  timelineItems = await computeTimeline();
  const match = timelineItems[0];
  renderTimeline(match?.key || '');
  autoIndex = 0;
  await updateFromUI();
}

function applyScenario(id: string) {
  const s: Record<string, () => void> = {
    de_secular: () => {
      state.surname = 'Müller'; state.gender = 'male';
      state.titleRole = 'none'; state.relationship = 'stranger';
      state.setting = 'ui'; state.outputMode = 'salutation';
      state.residenceLocale = 'de-DE'; state.greetingLanguage = 'de-DE';
      state.scriptPref = 'latin'; selectedAff = new Set(['civil']);
      state.names = ['Johannes']; state.namedaysEnabled = false;
      state.civilParticipation = true;
    },
    de_doctor: () => {
      state.residenceLocale = 'de-DE'; state.greetingLanguage = 'de-DE';
      state.scriptPref = 'latin'; selectedAff = new Set(['civil']);
      state.names = ['Hans']; state.surname = 'Müller';
      state.gender = 'male'; state.titleRole = 'dr';
      state.relationship = 'stranger'; state.formality = 'formal';
      state.setting = 'ui'; state.outputMode = 'salutation';
    },
    en_judge: () => {
      state.residenceLocale = 'en-GB'; state.greetingLanguage = 'en-GB';
      state.scriptPref = 'latin'; selectedAff = new Set(['civil']);
      state.names = ['Alex']; state.surname = '';
      state.gender = 'unknown'; state.titleRole = 'judge';
      state.relationship = 'subordinate'; state.formality = 'formal';
    },
    tr_muslim_de: () => {
      state.residenceLocale = 'de-DE'; state.greetingLanguage = 'tr-TR';
      state.scriptPref = 'latin'; selectedAff = new Set(['civil', 'islamic']);
      state.names = ['Mehmet'];
    },
    el_orthodox: () => {
      state.residenceLocale = 'el-GR'; state.greetingLanguage = 'el-GR';
      state.scriptPref = 'native'; selectedAff = new Set(['civil', 'orthodox']);
      state.names = ['Γιάννης']; state.namedaysEnabled = true;
    },
    zh_diaspora: () => {
      state.residenceLocale = 'de-DE'; state.greetingLanguage = 'zh-CN';
      state.scriptPref = 'simplified'; selectedAff = new Set(['civil', 'chinese_traditional']);
      state.names = ['Wei'];
    },
    el_teacher: () => {
      state.residenceLocale = 'el-GR'; state.greetingLanguage = 'el-GR';
      state.scriptPref = 'native'; selectedAff = new Set(['civil']);
      state.names = ['Eleni']; state.surname = 'Papadopoulou';
      state.gender = 'female'; state.titleRole = 'teacher';
      state.now = new Date('2026-01-24T10:00:00'); // International Day of Education
    }
  };
  if (s[id]) s[id]();
}

// ═══════════════════════════════════════════════════════════════════
// Protocol Workbench
// ═══════════════════════════════════════════════════════════════════

const addressEngine = new AddressEngine();
const compositionEngine = new CompositionEngine();

for (const pack of globalAddressPacks) {
  addressEngine.registerAddressPack(pack);
}
for (const pack of globalProtocolPacks) {
  addressEngine.registerProtocolPack(pack);
}

function getWbValue(id: string): string {
  return (document.getElementById(id) as HTMLInputElement | HTMLSelectElement)?.value ?? '';
}

function getWbMultiSelect(id: string): string[] {
  const el = document.getElementById(id) as HTMLSelectElement | null;
  if (!el) return [];
  return Array.from(el.selectedOptions).map(o => o.value);
}

function updateWorkbench() {
  const locale = getWbValue('wbLocale');
  const gender = getWbValue('wbGender') as any;
  const formality = getWbValue('wbFormality') as any;
  const firstName = getWbValue('wbFirstName');
  const surname = getWbValue('wbSurname');
  const role = getWbValue('wbRole');
  const titleCodes = getWbMultiSelect('wbTitles');
  const protocol = getWbValue('wbProtocol');
  const audienceKind = getWbValue('wbAudience') as any;
  const separator = getWbValue('wbSeparator') as any;
  const punctuation = getWbValue('wbPunctuation') as any;
  const capitalization = getWbValue('wbCapitalization') as any;

  const titles: AddressTitleToken[] = titleCodes.map(code => ({
    system: 'academic' as const,
    code,
    display: code,
    gender: gender === 'unknown' ? undefined : gender,
  }));

  const recipient: AddressRecipient = {
    givenNames: firstName ? [firstName] : undefined,
    surname: surname || undefined,
    gender,
    titles: titles.length > 0 ? titles : undefined,
    officeRole: role || undefined,
  };

  const audience: AddressAudience = {
    kind: audienceKind,
    recipients: audienceKind === 'single' || audienceKind === 'pair' ? [recipient] : [],
  };

  const allowProto = protocol !== 'none';
  const subcultures = allowProto ? [protocol] : [];

  const baseCtx = {
    locale,
    formality,
    addressMode: 'direct' as const,
    outputForm: 'postal' as const,
    allowSubcultureAddressing: allowProto,
    subcultures,
  };

  const postal = addressEngine.resolve(audience, { ...baseCtx, outputForm: 'postal' });
  const letterhead = addressEngine.resolve(audience, { ...baseCtx, outputForm: 'letterhead' });
  const salAddr = addressEngine.resolve(audience, { ...baseCtx, outputForm: 'salutation' });

  const renderPolicy: SalveRenderPolicy = {
    separator,
    terminalPunctuation: punctuation,
    capitalization,
  };

  const greeting = locale === 'nl' ? 'Goedemorgen' :
    locale === 'de' ? 'Guten Tag' :
      locale === 'fr' ? 'Bonjour' :
        locale === 'el' ? 'Καλημέρα' : 'Good morning';

  const composed = compositionEngine.compose(
    { greeting, address: salAddr.text, renderPolicy },
    locale,
  );

  const postalEl = document.getElementById('wbPostalText');
  const letterEl = document.getElementById('wbLetterheadText');
  const salutEl = document.getElementById('wbSalutationText');
  const traceEl = document.getElementById('wbTrace');

  if (postalEl) postalEl.textContent = postal.text || '—';
  if (letterEl) letterEl.textContent = letterhead.text || '—';
  if (salutEl) salutEl.textContent = composed.text || '—';

  if (traceEl) {
    const traceLines = [
      `locale: ${locale}`,
      `formality: ${formality}`,
      `protocol: ${protocol}`,
      `audience: ${audienceKind}`,
      '',
      '── Postal ──',
      ...postal.trace,
      '',
      '── Letterhead ──',
      ...letterhead.trace,
      '',
      '── Salutation ──',
      ...salAddr.trace,
      '',
      `── Composition ──`,
      `separator: ${renderPolicy.separator}`,
      `punctuation: ${renderPolicy.terminalPunctuation}`,
      `capitalization: ${renderPolicy.capitalization}`,
      `greeting: "${greeting}"`,
      `address: "${salAddr.text}"`,
      `result: "${composed.text}"`,
    ];
    traceEl.textContent = traceLines.join('\n');
  }
}

function wireWorkbench() {
  const ids = [
    'wbLocale', 'wbGender', 'wbFormality', 'wbFirstName', 'wbSurname',
    'wbRole', 'wbTitles', 'wbProtocol', 'wbAudience',
    'wbSeparator', 'wbPunctuation', 'wbCapitalization',
  ];
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', updateWorkbench);
      el.addEventListener('input', updateWorkbench);
    }
  }
}

async function init() {
  const now = new Date();
  state.now = now;

  const nav = (navigator.language || 'en-GB').toLowerCase();
  const residence = nav.startsWith('el') ? 'el-GR' : nav.startsWith('tr') ? 'tr-TR' : nav.startsWith('zh') ? 'zh-CN' : nav.startsWith('nl') ? 'nl-BE' : nav.startsWith('de') ? 'de-DE' : 'de-DE';
  state.residenceLocale = residence;
  state.greetingLanguage = residence === 'nl-BE' ? 'de-DE' : residence;

  $('timelineTrack')?.addEventListener('wheel', () => restartAuto(), { passive: true });
  $('timelineTrack')?.addEventListener('touchstart', () => restartAuto(), { passive: true });

  await rebuildTimelineAndUpdate();
  startAuto();

  wireWorkbench();
  updateWorkbench();
}

init();
