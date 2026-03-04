# Cultural Implementation Guide

This guide is for contributors looking to extend Salve's cultural intelligence by adding new packs, traditions, or calendar rules.

## The Salve Philosophy: Maximal Cultural Specificity
Salve is designed to avoid "cultural flattening." When multiple greetings are applicable, the engine always picks the most specific one. For example:
- A national holiday (Civil) beats a time-of-day greeting (Temporal).
- A personal birthday (Personal) beats a national holiday.
- A religious feast (Religious) beats a generic cultural baseline.

## 1. Creating a Greeting Pack
A `GreetingPack` is a collection of phrases for a specific `locale`.

### Structure
```json
{
  "locale": "el-GR",
  "greetings": [
    {
      "id": "morning_informal",
      "text": "Καλημέρα",
      "eventRef": "temporal.morning",
      "formality": "informal"
    }
  ]
}
```

### Best Practices
- **Use Template Parameters**: Use `{{name}}` or `{{address}}` if your template requires them. Note that `salutation` in the result is automatically built by the engine if an address is resolved.
- **Formality Axis**: Provide both `formal` and `informal` variants of the same greeting where possible.
- **Script Variants**: If a language uses multiple scripts (e.g., Serbian Latin vs. Cyrillic), differentiate them using the `script` property.

## 2. Event Domains & Scoring
The engine uses a weighted scoring system based on the `domain` of an event:

| Domain | Weight | Example |
| :--- | :--- | :--- |
| `personal` | 100 | Birthday, Name-day |
| `religious` | 80 | Eid, Easter, Hanukkah |
| `civil` | 60 | National Day, Thanksgiving |
| `cultural_baseline` | 40 | "Have a nice day" |
| `temporal` | 20 | Morning, Evening |

## 3. Implementing Calendar Plugins
If a tradition follows a complex calendar (Lunar, Solar, etc.) not yet supported, you must implement a `CalendarPlugin`.

### Example (Fixed Holiday)
```typescript
class MyTraditionPlugin implements CalendarPlugin {
  id = "my-tradition";
  resolveEvents(now: Date) {
    if (now.getMonth() === 5 && now.getDate() === 15) {
      return [{ id: "my_special_day", domain: "civil" }];
    }
    return [];
  }
}
```

## 4. Name-Days & Saint Identities
For traditions that celebrate name-days (e.g., Greece, Bulgaria, Spain), use the Saint-Identity pivot:
1. **Saint Definition**: Map a WikiData QID to a list of common aliases.
2. **Name-Day Entry**: Map a date to one or more Saint QIDs.

This ensures that a user named "George" gets the correct greeting regardless of whether they are in Greece, Bulgaria, or England, as long as the tradition matches.

## 5. Linguistic Transforms
Some languages require morphological shifts in salutations (e.g., the Vocative case). Register a `TransformHook` to handle these automatically:

```javascript
engine.registerTransform("el", (name) => {
  // Logic to convert "Γιάννης" to "Γιάννη"
  return vocative(name);
});
```
