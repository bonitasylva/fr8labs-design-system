import LinkTo from '@storybook/addon-links/react';
import './TokenFoundation.stories.css';

type NamePart = {
  label: string;
  value: string;
};

const conventions: readonly {
  layer: string;
  description: string;
  parts: readonly NamePart[];
  pattern: string;
}[] = [
  {
    layer: 'Primitive',
    description: 'Raw source value. Token authors use it to build semantic roles.',
    pattern: '--fds-primitive-{category}-{family or concept}-{scale or modifier}',
    parts: [
      {label: 'Prefix', value: '--fds'},
      {label: 'Layer', value: 'primitive'},
      {label: 'Category', value: 'color'},
      {label: 'Family', value: 'blue'},
      {label: 'Scale', value: '600'},
    ],
  },
  {
    layer: 'Semantic',
    description: 'Purpose-based role. This is the default layer for product UI.',
    pattern: '--fds-{category}-{concept}-{variant or property}-{state}',
    parts: [
      {label: 'Prefix', value: '--fds'},
      {label: 'Category', value: 'color'},
      {label: 'Concept', value: 'action'},
      {label: 'Variant', value: 'primary'},
      {label: 'State', value: 'active'},
    ],
  },
  {
    layer: 'Component',
    description: 'A stable, repeated decision owned by one FDS component.',
    pattern: '--fds-{component}-{variant}-{property}-{state}',
    parts: [
      {label: 'Prefix', value: '--fds'},
      {label: 'Component', value: 'button'},
      {label: 'Variant', value: 'primary'},
      {label: 'Property', value: 'background'},
      {label: 'State', value: 'active'},
    ],
  },
];

const vocabulary: readonly (readonly [block: string, purpose: string, examples: string])[] = [
  ['Prefix', 'Identifies the owning design system.', '--fds'],
  ['Layer', 'Marks raw source values. Only primitives include this block.', 'primitive'],
  ['Category', 'Names the kind of decision.', 'color, font, space, size, motion'],
  ['Object', 'Scopes a decision to a component or pattern.', 'button, table, status'],
  ['Concept', 'Names the purpose or UI role.', 'action, field, feedback'],
  ['Property', 'Names what the token controls.', 'background, border, width'],
  ['Variant', 'Distinguishes a supported style or emphasis.', 'primary, danger, compact'],
  ['State', 'Names an interaction or validation state.', 'hover, active, disabled, error'],
  ['Scale', 'Places a raw value in an ordered family.', '50, 600, 1, 3'],
];

const examples: readonly (readonly [good: string, avoid: string, reason: string])[] = [
  ['--fds-color-action-primary', '--fds-blue-button', 'Name the shared purpose, not the current value or one consumer.'],
  ['--fds-color-field-border-error', '--fds-error-red-border', 'Keep category and concept first; append property and state.'],
  ['--fds-button-danger-border-hover', '--fds-button-hover-red-border', 'Within a component, keep variant before property and state last.'],
];

export const TokenNamingGuide = () => <main className="fds-token-docs">
    <header>
      <p className="fds-token-docs__eyebrow">Design tokens</p>
      <h2>Token naming convention</h2>
      <p className="fds-token-docs__intro">A token name is a contract between design and code. FDS names read from broad scope to specific decision so people and tools can identify the token’s purpose without inspecting its value.</p>
      <aside className="fds-token-docs__callout">
        <strong>Default to semantic tokens.</strong>
        <span>Product teams should usually choose a purpose-based name such as <code>--fds-color-text-muted</code>. Primitive and component tokens require a narrower reason.</span>
      </aside>
    </header>

    <section aria-labelledby="name-anatomy">
      <h3 id="name-anatomy">Anatomy</h3>
      <p className="fds-token-docs__note">Every runtime token starts with <code>--fds</code>. Name blocks use kebab-case and a single hyphen delimiter. Optional blocks are omitted; they are never filled with placeholders.</p>
      <div className="fds-token-names__examples">
        {conventions.map((convention) => <article className="fds-token-names__example" key={convention.layer}>
          <div className="fds-token-docs__group-heading">
            <p className="fds-token-docs__kicker">{convention.layer}</p>
            <h3>{convention.description}</h3>
            <code>{convention.pattern}</code>
          </div>
          <ol className="fds-token-names__anatomy" aria-label={`${convention.layer} token name anatomy`}>
            {convention.parts.map((part) => <li key={part.label}>
              <code>{part.value}</code>
              <span>{part.label}</span>
            </li>)}
          </ol>
        </article>)}
      </div>
    </section>

    <section aria-labelledby="name-vocabulary">
      <div className="fds-token-docs__section-heading">
        <div><p className="fds-token-docs__kicker">Vocabulary</p><h3 id="name-vocabulary">Use established terms</h3></div>
        <p>Use these blocks consistently. Not every token needs every block, and the same word must not carry two meanings within one token family.</p>
      </div>
      <div className="fds-token-docs__table-wrap">
        <table>
          <thead><tr><th scope="col">Block</th><th scope="col">Purpose</th><th scope="col">Examples</th></tr></thead>
          <tbody>{vocabulary.map(([block, purpose, blockExamples]) => <tr key={block}>
            <th scope="row">{block}</th><td>{purpose}</td><td><code>{blockExamples}</code></td>
          </tr>)}</tbody>
        </table>
      </div>
    </section>

    <section aria-labelledby="name-rules">
      <div className="fds-token-docs__section-heading">
        <div><p className="fds-token-docs__kicker">Rules</p><h3 id="name-rules">How to build a name</h3></div>
        <p>Use only the blocks needed to distinguish the decision. A short precise name is better than a complete-looking name with invented structure.</p>
      </div>
      <ol className="fds-token-docs__layers">
        <li><strong>Reuse before naming</strong><span>Search the semantic and component catalog first</span><code>--fds-color-border-default</code></li>
        <li><strong>Name purpose</strong><span>Do not encode the current raw value</span><code>--fds-color-action-primary</code></li>
        <li><strong>Keep scope honest</strong><span>Use an object only for an object-owned decision</span><code>--fds-table-row-height</code></li>
        <li><strong>Put modifiers last</strong><span>Append variant, state, or scale in the family’s established order</span><code>--fds-button-danger-border-hover</code></li>
        <li><strong>Use one term per meaning</strong><span>Prefer the vocabulary already used by that family</span><code>surface, not background and canvas</code></li>
      </ol>
    </section>

    <section aria-labelledby="choose-layer">
      <div className="fds-token-docs__section-heading">
        <div><p className="fds-token-docs__kicker">Decision</p><h3 id="choose-layer">Choose the narrowest valid layer</h3></div>
        <p>Start with a semantic token. Add a primitive only when the source scale needs a value, or a component token when a stable component decision is repeated.</p>
      </div>
      <ol className="fds-token-docs__layers">
        <li><strong>Primitive</strong><span>Token authors only</span><code>--fds-primitive-space-3</code></li>
        <li><strong>Semantic</strong><span>Shared meaning across UI</span><code>--fds-space-3</code></li>
        <li><strong>Component</strong><span>Repeated component decision</span><code>--fds-button-gap</code></li>
      </ol>
      <p className="fds-token-docs__note">Product and component code consume semantic or component tokens. Primitive names describe the source scale and are not the consumer API.</p>
    </section>

    <section aria-labelledby="name-examples">
      <div className="fds-token-docs__section-heading">
        <div><p className="fds-token-docs__kicker">Examples</p><h3 id="name-examples">Prefer intent over appearance</h3></div>
        <p>These avoided names are examples of naming mistakes, not existing FDS tokens.</p>
      </div>
      <div className="fds-token-docs__table-wrap">
        <table>
          <thead><tr><th scope="col">Use</th><th scope="col">Avoid</th><th scope="col">Why</th></tr></thead>
          <tbody>{examples.map(([good, avoid, reason]) => <tr key={good}>
            <th scope="row"><code>{good}</code></th><td><code>{avoid}</code></td><td>{reason}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </section>

    <section aria-labelledby="author-checklist">
      <div className="fds-token-docs__section-heading">
        <div><p className="fds-token-docs__kicker">Contribution</p><h3 id="author-checklist">Before adding a token</h3></div>
        <p>A new name expands the FDS API. Add one only when an existing token cannot express a confirmed, reusable decision.</p>
      </div>
      <ol className="fds-token-docs__checklist">
        <li><strong>Search</strong><span>Confirm the semantic or component role does not already exist.</span></li>
        <li><strong>Classify</strong><span>Choose primitive, semantic, or component scope from actual consumers.</span></li>
        <li><strong>Compose</strong><span>Reuse the controlled vocabulary and omit blocks that do not apply.</span></li>
        <li><strong>Validate</strong><span>Document the mapping and run <code>npm run check:tokens</code>.</span></li>
      </ol>
      <p className="fds-token-docs__note">Compatibility aliases are migration aids, not naming examples for new work.</p>
      <nav className="fds-token-docs__links" aria-label="Related token documentation">
        <a href="/?path=/docs/foundations-tokens--docs" target="_top">Open the token model</a>
        <LinkTo title="Foundations/Tokens" name="Semantics">Browse semantic tokens</LinkTo>
        <LinkTo title="Foundations/Tokens" name="Primitives">Browse primitive tokens</LinkTo>
      </nav>
    </section>
  </main>;
