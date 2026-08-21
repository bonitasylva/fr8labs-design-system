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
    description: 'A raw value in an FDS source scale. Only token maintainers add primitives.',
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
    description: 'A reusable UI role. Product and component code should start here.',
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
    description: 'A repeated decision owned by one component. Add it only when semantic tokens are not enough.',
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
  ['Prefix', 'Shows that FDS owns the token.', '--fds'],
  ['Layer', 'Marks a raw source value. Only primitive names include it.', 'primitive'],
  ['Category', 'Names the type of decision.', 'color, font, space, size, motion'],
  ['Object', 'Names the component or pattern that owns the decision.', 'button, table, status'],
  ['Concept', 'Names a shared UI purpose.', 'action, field, feedback'],
  ['Property', 'Names what the token controls.', 'background, border, width'],
  ['Variant', 'Names a supported option or emphasis.', 'primary, danger, compact'],
  ['State', 'Names an interaction or validation state.', 'hover, active, disabled, error'],
  ['Scale', 'Places a raw value in an ordered family.', '50, 600, 1, 3'],
];

const examples: readonly (readonly [good: string, avoid: string, reason: string])[] = [
  ['--fds-color-action-primary', '--fds-blue-button', 'Use the shared action role; do not name the current color or one consumer.'],
  ['--fds-color-field-border-error', '--fds-error-red-border', 'Follow category → concept → property → state.'],
  ['--fds-button-danger-border-hover', '--fds-button-hover-red-border', 'Follow component → variant → property → state.'],
];

export const renderTokenNamingGuide = () => <section className="fds-token-docs fds-token-names" aria-labelledby="token-naming-guide">
    <header>
      <p className="fds-token-docs__eyebrow">Design tokens</p>
      <h2 id="token-naming-guide">Token naming convention</h2>
      <p className="fds-token-docs__intro">Use this guide when you add or review an FDS CSS custom property. Read each name from owner and layer to purpose, then any variant, property, state, or scale. A good name explains why the token exists without exposing its current value.</p>
      <aside className="fds-token-docs__callout">
        <strong>Reuse an existing semantic token first.</strong>
        <span>Product teams should start with a shared role such as <code>--fds-color-text-muted</code>. Propose a new name only when the catalog cannot express a confirmed, reusable decision.</span>
      </aside>
    </header>

    <section aria-labelledby="name-anatomy">
      <h3 id="name-anatomy">Anatomy</h3>
      <p className="fds-token-docs__note">Every runtime token starts with <code>--fds</code>. Use lowercase kebab-case and one hyphen between blocks. Include only the blocks needed to identify the decision.</p>
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
        <p>Use the same word for the same meaning across token families. Skip blocks that do not apply instead of inventing filler terms.</p>
      </div>
      <div className="fds-token-docs__table-wrap">
        <table>
          <thead><tr><th scope="col">Block</th><th scope="col">Purpose</th><th scope="col">Examples</th></tr></thead>
          <tbody>{vocabulary.map(([block, purpose, blockExamples]) => <tr key={block}>
            <th scope="row" data-label="Block">{block}</th><td data-label="Purpose">{purpose}</td><td data-label="Examples"><code>{blockExamples}</code></td>
          </tr>)}</tbody>
        </table>
      </div>
    </section>

    <section aria-labelledby="name-rules">
      <div className="fds-token-docs__section-heading">
        <div><p className="fds-token-docs__kicker">Rules</p><h3 id="name-rules">How to build a name</h3></div>
        <p>Use the shortest name that identifies the decision and follows the order already established by its token family.</p>
      </div>
      <ol className="fds-token-docs__layers">
        <li><strong>Search first</strong><span>Check semantic and component tokens before proposing a name</span><code>--fds-color-border-default</code></li>
        <li><strong>Name the role</strong><span>Describe purpose, not the current color or size</span><code>--fds-color-action-primary</code></li>
        <li><strong>Match ownership</strong><span>Use a component name only when that component owns the decision</span><code>--fds-table-row-height</code></li>
        <li><strong>Follow family order</strong><span>Place variants, properties, states, and scales in the established sequence</span><code>--fds-button-danger-border-hover</code></li>
        <li><strong>Keep terms stable</strong><span>Reuse existing vocabulary instead of creating synonyms</span><code>surface, not canvas</code></li>
      </ol>
    </section>

    <section aria-labelledby="choose-layer">
      <div className="fds-token-docs__section-heading">
        <div><p className="fds-token-docs__kicker">Ownership</p><h3 id="choose-layer">Choose the layer that owns the decision</h3></div>
        <p>Choose by ownership, not convenience: primitives maintain source scales, semantics carry shared UI meaning, and component tokens hold repeated component-specific decisions.</p>
      </div>
      <ol className="fds-token-docs__layers">
        <li><strong>Primitive</strong><span>Maintained source scale; never used directly by product UI</span><code>--fds-primitive-size-12</code></li>
        <li><strong>Semantic</strong><span>Shared role used across components and products</span><code>--fds-space-12</code></li>
        <li><strong>Component</strong><span>Stable rule repeated within one component</span><code>--fds-button-gap</code></li>
      </ol>
      <p className="fds-token-docs__note">Product code and FDS components use semantic or component tokens. Only token definitions reference primitives.</p>
    </section>

    <section aria-labelledby="name-examples">
      <div className="fds-token-docs__section-heading">
        <div><p className="fds-token-docs__kicker">Examples</p><h3 id="name-examples">Name purpose, not appearance</h3></div>
        <p>The avoided names illustrate common mistakes. Do not add them as tokens or compatibility aliases.</p>
      </div>
      <div className="fds-token-docs__table-wrap">
        <table>
          <thead><tr><th scope="col">Use</th><th scope="col">Avoid</th><th scope="col">Why</th></tr></thead>
          <tbody>{examples.map(([good, avoid, reason]) => <tr key={good}>
            <th scope="row" data-label="Use"><code>{good}</code></th><td data-label="Avoid"><code>{avoid}</code></td><td data-label="Why">{reason}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </section>

    <section aria-labelledby="author-checklist">
      <div className="fds-token-docs__section-heading">
        <div><p className="fds-token-docs__kicker">Contribution</p><h3 id="author-checklist">Before adding a token</h3></div>
        <p>A token is part of the public FDS API. Add one only when the current catalog cannot express a confirmed, reusable decision.</p>
      </div>
      <ol className="fds-token-docs__checklist">
        <li><strong>Search</strong><span>Record why existing semantic or component tokens do not fit.</span></li>
        <li><strong>Assign ownership</strong><span>Choose the layer from the decision’s actual consumers.</span></li>
        <li><strong>Build the name</strong><span>Reuse established vocabulary and omit blocks that do not apply.</span></li>
        <li><strong>Document</strong><span>Record the source mapping, intended use, and affected consumers.</span></li>
        <li><strong>Validate</strong><span>Run <code>npm run check:tokens</code> and review generated documentation.</span></li>
        <li><strong>Approve</strong><span>Identify the FDS principles it supports and obtain approval before release.</span></li>
      </ol>
      <p className="fds-token-docs__note">Compatibility aliases support migrations. Do not use them as naming examples for new work.</p>
    </section>
  </section>;
