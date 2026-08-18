# Codex Prototype Prompt

Use this prompt to request a FDS UI prototype after the component API exists.

```text
Create a Storybook prototype for [workflow name] using only FDS UI components from `sandbox-fds-components`.

Context:
- Product area: [shipment / invoice / approval / document / report]
- User role: [ops / accounting / manager]
- Main task: [task]
- Data: use fake freight data only

Rules:
- Import from `sandbox-fds-components` only.
- Do not add another UI runtime.
- Use dense but legible ERP layout.
- Show relevant status, loading, empty, and error states.
- Do not create production app code.
- Keep the story focused on this workflow only.
```
