import type {Meta, StoryObj} from '@storybook/react-vite';
import breakpoints from 'sandbox-fds-tokens/breakpoints.json';
import './TokenFoundation.stories.css';
import {renderTokenNamingGuide} from './TokenNames';

type TokenGroupData = {
  category: string;
  title: string;
  description: string;
  preview?: 'color';
  tokens: readonly (readonly [name: string, value: string])[];
};

const primitiveGroups: readonly TokenGroupData[] = [
  {
    category: 'Color',
    title: 'Base',
    description: 'Foundation values for default surfaces and intentionally absent color.',
    preview: 'color',
    tokens: [
      ['--fds-primitive-color-white', '#ffffff'],
      ['--fds-primitive-color-transparent', 'transparent'],
    ],
  },
  {
    category: 'Color',
    title: 'Blue',
    description: 'The FDS brand and action scale, ordered from lighter to darker.',
    preview: 'color',
    tokens: [
      ['--fds-primitive-color-blue-500', '#008de4'],
      ['--fds-primitive-color-blue-600', '#0067e7'],
      ['--fds-primitive-color-blue-700', '#023c9b'],
      ['--fds-primitive-color-primary-border', 'rgb(0 34 69 / 16%)'],
    ],
  },
  {
    category: 'Color',
    title: 'Neutral',
    description: 'The surface, border, muted-content, and default-content scale.',
    preview: 'color',
    tokens: [
      ['--fds-primitive-color-neutral-50', '#f6f8fb'],
      ['--fds-primitive-color-neutral-300', '#e3eaf1'],
      ['--fds-primitive-color-neutral-400', '#c8d2dc'],
      ['--fds-primitive-color-neutral-500', '#8496a8'],
      ['--fds-primitive-color-neutral-600', '#5e758d'],
      ['--fds-primitive-color-neutral-700', '#3f556b'],
      ['--fds-primitive-color-neutral-900', '#002245'],
    ],
  },
  {
    category: 'Color',
    title: 'Info',
    description: 'Light surface and dark text values for informational feedback.',
    preview: 'color',
    tokens: [
      ['--fds-primitive-color-info-50', '#eaf3ff'],
      ['--fds-primitive-color-info-600', '#2f3f4f'],
      ['--fds-primitive-color-info-700', '#00458c'],
    ],
  },
  {
    category: 'Color',
    title: 'Success',
    description: 'Light surface and dark text values for successful outcomes.',
    preview: 'color',
    tokens: [
      ['--fds-primitive-color-success-100', '#e6f6eb'],
      ['--fds-primitive-color-success-600', '#31433a'],
      ['--fds-primitive-color-success-700', '#193b2d'],
    ],
  },
  {
    category: 'Color',
    title: 'Warning',
    description: 'Light surface and dark text values for cautionary feedback.',
    preview: 'color',
    tokens: [
      ['--fds-primitive-color-warning-100', '#fff4d5'],
      ['--fds-primitive-color-warning-700', '#4a4236'],
      ['--fds-primitive-color-warning-800', '#4f3422'],
    ],
  },
  {
    category: 'Color',
    title: 'Error',
    description: 'Surface, action, and strong text values for errors and danger.',
    preview: 'color',
    tokens: [
      ['--fds-primitive-color-error-100', '#ffebec'],
      ['--fds-primitive-color-error-400', '#c8393a'],
      ['--fds-primitive-color-error-600', '#4a3538'],
      ['--fds-primitive-color-error-700', '#641723'],
    ],
  },
  {
    category: 'Color',
    title: 'Status borders',
    description: 'Distinct outlines for success, warning, and danger status badges.',
    preview: 'color',
    tokens: [
      ['--fds-primitive-color-status-success-border', '#62a179'],
      ['--fds-primitive-color-status-warning-border', '#a68d5b'],
      ['--fds-primitive-color-status-danger-border', '#d36f69'],
    ],
  },
  {
    category: 'Color',
    title: 'Interaction and overlay',
    description: 'Alpha values for icons, hover feedback, and modal backdrops.',
    preview: 'color',
    tokens: [
      ['--fds-primitive-color-icon-default', 'rgb(0 34 69 / 74%)'],
      ['--fds-primitive-color-icon-disabled', 'rgb(0 34 69 / 38%)'],
      ['--fds-primitive-color-icon-hover', 'rgb(0 34 69 / 4%)'],
      ['--fds-primitive-color-action-hover', 'rgb(0 103 231 / 8%)'],
      ['--fds-primitive-color-overlay', 'rgb(0 34 69 / 45%)'],
    ],
  },
  {
    category: 'Typography',
    title: 'Font family and weights',
    description: 'The raw font family and weight values behind the functional type roles.',
    tokens: [
      ['--fds-primitive-font-sans', 'IBM Plex Sans Condensed, Arial Narrow, Arial, sans-serif'],
      ['--fds-primitive-font-weight-regular', '400'],
      ['--fds-primitive-font-weight-medium', '500'],
      ['--fds-primitive-font-weight-semibold', '600'],
      ['--fds-primitive-font-weight-bold', '700'],
    ],
  },
  {
    category: 'Spacing',
    title: 'Scale',
    description: 'The shared 4px-based rhythm for layout and component spacing.',
    tokens: [
      ['--fds-primitive-space-1', '4px'],
      ['--fds-primitive-space-2', '8px'],
      ['--fds-primitive-space-3', '12px'],
      ['--fds-primitive-space-4', '16px'],
      ['--fds-primitive-space-5', '24px'],
    ],
  },
  {
    category: 'Size',
    title: 'Scale',
    description: 'Raw dimensions used by type, controls, icons, data rows, and overlays.',
    tokens: [
      ['--fds-primitive-size-11', '11px'],
      ['--fds-primitive-size-12', '12px'],
      ['--fds-primitive-size-13', '13px'],
      ['--fds-primitive-size-14', '14px'],
      ['--fds-primitive-size-16', '16px'],
      ['--fds-primitive-size-18', '18px'],
      ['--fds-primitive-size-20', '20px'],
      ['--fds-primitive-size-22', '22px'],
      ['--fds-primitive-size-24', '24px'],
      ['--fds-primitive-size-28', '28px'],
      ['--fds-primitive-size-30', '30px'],
      ['--fds-primitive-size-32', '32px'],
      ['--fds-primitive-size-36', '36px'],
      ['--fds-primitive-size-40', '40px'],
      ['--fds-primitive-size-48', '48px'],
      ['--fds-primitive-size-520', '520px'],
      ['--fds-primitive-size-540', '540px'],
    ],
  },
  {
    category: 'Responsive',
    title: 'Breakpoints',
    description: 'Primitive min-width references exported from breakpoints.json for build-time use.',
    tokens: [
      ['breakpoints.base', `${breakpoints.base.value} (${breakpoints.base.pixels}px)`],
      ['breakpoints.small', `${breakpoints.small.value} (${breakpoints.small.pixels}px)`],
      ['breakpoints.medium', `${breakpoints.medium.value} (${breakpoints.medium.pixels}px)`],
      ['breakpoints.large', `${breakpoints.large.value} (${breakpoints.large.pixels}px)`],
      ['breakpoints.wide', `${breakpoints.wide.value} (${breakpoints.wide.pixels}px)`],
    ],
  },
  {
    category: 'Layout',
    title: 'Content measures',
    description: 'Raw maximum widths for readable and structured content containers.',
    tokens: [
      ['--fds-primitive-size-768', '48rem'],
      ['--fds-primitive-size-1280', '80rem'],
      ['--fds-primitive-measure-72', '72ch'],
    ],
  },
  {
    category: 'Shape',
    title: 'Radius and border',
    description: 'Raw corner and stroke measurements.',
    tokens: [
      ['--fds-primitive-radius-default', '4px'],
      ['--fds-primitive-radius-full', '999px'],
      ['--fds-primitive-border-width', '1px'],
      ['--fds-primitive-border-width-strong', '2px'],
    ],
  },
  {
    category: 'Interaction',
    title: 'State, focus, motion, and elevation',
    description: 'Raw focus, disabled-state, interaction timing, and control elevation values.',
    tokens: [
      ['--fds-primitive-opacity-disabled', '0.55'],
      ['--fds-primitive-focus-width', '3px'],
      ['--fds-primitive-focus-offset', '2px'],
      ['--fds-primitive-motion-duration-fast', '150ms'],
      ['--fds-primitive-motion-duration-spinner', '700ms'],
      ['--fds-primitive-motion-easing-standard', 'ease'],
      ['--fds-primitive-shadow-control', '0 1px 1px rgb(91 125 160 / 4%), 0 1px 2px rgb(91 125 160 / 3%)'],
      ['--fds-primitive-shadow-overlay', '0 0 0 1px rgb(0 0 0 / 6%), 0 4px 10px -2px rgb(0 0 0 / 10%), 0 12px 28px -8px rgb(0 0 0 / 14%)'],
    ],
  },
];

const semanticGroups: readonly TokenGroupData[] = [
  {
    category: 'Color',
    title: 'Brand',
    description: 'Non-action brand accent.',
    preview: 'color',
    tokens: [
      ['--fds-color-brand-accent', '--fds-primitive-color-blue-500'],
    ],
  },
  {
    category: 'Color',
    title: 'Surface',
    description: 'Default and subtle application backgrounds.',
    preview: 'color',
    tokens: [
      ['--fds-color-surface-default', '--fds-primitive-color-white'],
      ['--fds-color-surface-subtle', '--fds-primitive-color-neutral-50'],
    ],
  },
  {
    category: 'Color',
    title: 'Text',
    description: 'Default, muted, and inverse content.',
    preview: 'color',
    tokens: [
      ['--fds-color-text-default', '--fds-primitive-color-neutral-900'],
      ['--fds-color-text-muted', '--fds-primitive-color-neutral-700'],
      ['--fds-color-text-inverse', '--fds-primitive-color-white'],
    ],
  },
  {
    category: 'Color',
    title: 'Icon',
    description: 'Default and disabled icon states.',
    preview: 'color',
    tokens: [
      ['--fds-color-icon-default', '--fds-primitive-color-icon-default'],
      ['--fds-color-icon-disabled', '--fds-primitive-color-icon-disabled'],
    ],
  },
  {
    category: 'Color',
    title: 'Border',
    description: 'Default, subtle, and accessible interactive boundaries.',
    preview: 'color',
    tokens: [
      ['--fds-color-border-default', '--fds-primitive-color-neutral-400'],
      ['--fds-color-border-subtle', '--fds-primitive-color-neutral-300'],
      ['--fds-color-border-interactive', '--fds-primitive-color-neutral-500'],
    ],
  },
  {
    category: 'Color',
    title: 'Field',
    description: 'Form backgrounds, boundaries, and validation.',
    preview: 'color',
    tokens: [
      ['--fds-color-field-background', '--fds-color-surface-default'],
      ['--fds-color-field-background-disabled', '--fds-color-surface-subtle'],
      ['--fds-color-field-border', '--fds-primitive-color-neutral-600'],
      ['--fds-color-field-border-error', '--fds-primitive-color-error-700'],
    ],
  },
  {
    category: 'Color',
    title: 'Overlay',
    description: 'Backdrop behind modal surfaces.',
    preview: 'color',
    tokens: [
      ['--fds-color-overlay-backdrop', '--fds-primitive-color-overlay'],
    ],
  },
  {
    category: 'Color',
    title: 'Action',
    description: 'Primary and danger interaction states.',
    preview: 'color',
    tokens: [
      ['--fds-color-action-primary', '--fds-primitive-color-blue-600'],
      ['--fds-color-action-primary-active', '--fds-primitive-color-blue-700'],
      ['--fds-color-action-primary-hover', '--fds-primitive-color-action-hover'],
      ['--fds-color-action-danger', '--fds-primitive-color-error-400'],
      ['--fds-color-action-danger-active', '--fds-primitive-color-error-700'],
    ],
  },
  {
    category: 'Color',
    title: 'Focus',
    description: 'Visible keyboard focus indicator.',
    preview: 'color',
    tokens: [
      ['--fds-color-focus-ring', '--fds-color-action-primary'],
    ],
  },
  {
    category: 'Color',
    title: 'Feedback · Info',
    description: 'Informational surface and readable foreground.',
    preview: 'color',
    tokens: [
      ['--fds-color-feedback-info-surface', '--fds-primitive-color-info-50'],
      ['--fds-color-feedback-info-content-text', '--fds-primitive-color-info-600'],
      ['--fds-color-feedback-info-text', '--fds-primitive-color-info-700'],
    ],
  },
  {
    category: 'Color',
    title: 'Feedback · Success',
    description: 'Successful outcome surface and foreground.',
    preview: 'color',
    tokens: [
      ['--fds-color-feedback-success-surface', '--fds-primitive-color-success-100'],
      ['--fds-color-feedback-success-content-text', '--fds-primitive-color-success-600'],
      ['--fds-color-feedback-success-text', '--fds-primitive-color-success-700'],
    ],
  },
  {
    category: 'Color',
    title: 'Feedback · Warning',
    description: 'Cautionary surface and foreground.',
    preview: 'color',
    tokens: [
      ['--fds-color-feedback-warning-surface', '--fds-primitive-color-warning-100'],
      ['--fds-color-feedback-warning-content-text', '--fds-primitive-color-warning-700'],
      ['--fds-color-feedback-warning-text', '--fds-primitive-color-warning-800'],
    ],
  },
  {
    category: 'Color',
    title: 'Feedback · Error',
    description: 'Error surface and foreground.',
    preview: 'color',
    tokens: [
      ['--fds-color-feedback-error-surface', '--fds-primitive-color-error-100'],
      ['--fds-color-feedback-error-content-text', '--fds-primitive-color-error-600'],
      ['--fds-color-feedback-error-text', '--fds-primitive-color-error-700'],
    ],
  },
  {
    category: 'Color',
    title: 'Status · Neutral',
    description: 'Surface, border, and text for neutral workflow status.',
    preview: 'color',
    tokens: [
      ['--fds-color-status-neutral-surface', '--fds-color-surface-default'],
      ['--fds-color-status-neutral-border', '--fds-primitive-color-neutral-300'],
      ['--fds-color-status-neutral-text', '--fds-primitive-color-neutral-600'],
    ],
  },
  {
    category: 'Color',
    title: 'Status · Warning',
    description: 'Surface, border, and text for warning workflow status.',
    preview: 'color',
    tokens: [
      ['--fds-color-status-warning-surface', '--fds-color-surface-default'],
      ['--fds-color-status-warning-border', '--fds-primitive-color-status-warning-border'],
      ['--fds-color-status-warning-text', '--fds-color-feedback-warning-text'],
    ],
  },
  {
    category: 'Color',
    title: 'Status · Success',
    description: 'Surface, border, and text for successful workflow status.',
    preview: 'color',
    tokens: [
      ['--fds-color-status-success-surface', '--fds-color-surface-default'],
      ['--fds-color-status-success-border', '--fds-primitive-color-status-success-border'],
      ['--fds-color-status-success-text', '--fds-color-feedback-success-text'],
    ],
  },
  {
    category: 'Color',
    title: 'Status · Danger',
    description: 'Surface, border, and text for danger workflow status.',
    preview: 'color',
    tokens: [
      ['--fds-color-status-danger-surface', '--fds-color-surface-default'],
      ['--fds-color-status-danger-border', '--fds-primitive-color-status-danger-border'],
      ['--fds-color-status-danger-text', '--fds-color-action-danger'],
    ],
  },
  {
    category: 'Color',
    title: 'Business · Risk',
    description: 'Blocked-risk surface and foreground.',
    preview: 'color',
    tokens: [
      ['--fds-color-risk-blocked-surface', '--fds-color-status-warning-surface'],
      ['--fds-color-risk-blocked-text', '--fds-color-status-warning-text'],
    ],
  },
  {
    category: 'Color',
    title: 'Business · Finance',
    description: 'Positive and negative financial values.',
    preview: 'color',
    tokens: [
      ['--fds-color-finance-positive', '--fds-color-feedback-success-text'],
      ['--fds-color-finance-negative', '--fds-color-feedback-error-text'],
    ],
  },
  {
    category: 'Typography',
    title: 'Font family',
    description: 'Shared body and interface font stack.',
    tokens: [
      ['--fds-font-family-body', '--fds-primitive-font-sans'],
    ],
  },
  {
    category: 'Typography',
    title: 'Headings',
    description: 'Page, section, and subsection hierarchy.',
    tokens: [
      ['--fds-font-size-page-title', '--fds-primitive-size-20'],
      ['--fds-line-height-page-title', '--fds-primitive-size-28'],
      ['--fds-font-size-section-heading', '--fds-primitive-size-18'],
      ['--fds-line-height-section-heading', '--fds-primitive-size-24'],
      ['--fds-font-size-subheading', '--fds-primitive-size-16'],
      ['--fds-line-height-subheading', '--fds-primitive-size-22'],
    ],
  },
  {
    category: 'Typography',
    title: 'Body',
    description: 'Primary application text and form values at 14/20.',
    tokens: [
      ['--fds-font-size-body', '--fds-primitive-size-14'],
      ['--fds-line-height-body', '--fds-primitive-size-20'],
    ],
  },
  {
    category: 'Typography',
    title: 'Data',
    description: 'Dense table cells and operational data at 13/18.',
    tokens: [
      ['--fds-font-size-data', '--fds-primitive-size-13'],
      ['--fds-line-height-data', '--fds-primitive-size-18'],
    ],
  },
  {
    category: 'Typography',
    title: 'Label',
    description: 'Field and column labels at 12/16, usually semibold.',
    tokens: [
      ['--fds-font-size-label', '--fds-primitive-size-12'],
      ['--fds-line-height-label', '--fds-primitive-size-16'],
    ],
  },
  {
    category: 'Typography',
    title: 'Supporting',
    description: 'Captions, help text, and supporting copy at 12/16.',
    tokens: [
      ['--fds-font-size-caption', '--fds-primitive-size-12'],
      ['--fds-line-height-caption', '--fds-primitive-size-16'],
    ],
  },
  {
    category: 'Typography',
    title: 'Metadata',
    description: 'Timestamps and compact metadata at 11/16.',
    tokens: [
      ['--fds-font-size-metadata', '--fds-primitive-size-11'],
      ['--fds-line-height-metadata', '--fds-primitive-size-16'],
    ],
  },
  {
    category: 'Typography',
    title: 'Weight',
    description: 'Body, emphasis, heading, and strong text roles.',
    tokens: [
      ['--fds-font-weight-body', '--fds-primitive-font-weight-regular'],
      ['--fds-font-weight-emphasis', '--fds-primitive-font-weight-medium'],
      ['--fds-font-weight-heading', '--fds-primitive-font-weight-semibold'],
      ['--fds-font-weight-strong', '--fds-primitive-font-weight-bold'],
    ],
  },
  {
    category: 'Spacing',
    title: 'Scale',
    description: 'Stable layout roles used by components instead of raw measurements.',
    tokens: [
      ['--fds-space-1', '--fds-primitive-space-1'],
      ['--fds-space-2', '--fds-primitive-space-2'],
      ['--fds-space-3', '--fds-primitive-space-3'],
      ['--fds-space-4', '--fds-primitive-space-4'],
      ['--fds-space-5', '--fds-primitive-space-5'],
    ],
  },
  {
    category: 'Size',
    title: 'Control',
    description: 'Compact, default, and action control dimensions.',
    tokens: [
      ['--fds-size-control-default', '--fds-primitive-size-32'],
      ['--fds-size-control-compact', '--fds-primitive-size-28'],
      ['--fds-size-control-action', '--fds-primitive-size-40'],
      ['--fds-size-control-action-small', '--fds-primitive-size-24'],
    ],
  },
  {
    category: 'Size',
    title: 'Icon',
    description: 'Icon glyph dimensions and interactive hit targets.',
    tokens: [
      ['--fds-size-icon-16', '--fds-primitive-size-16'],
      ['--fds-size-icon-20', '--fds-primitive-size-20'],
      ['--fds-size-icon-24', '--fds-primitive-size-24'],
    ],
  },
  {
    category: 'Size',
    title: 'Overlay',
    description: 'Default dialog and drawer widths.',
    tokens: [
      ['--fds-size-overlay-dialog', '--fds-primitive-size-520'],
      ['--fds-size-overlay-drawer', '--fds-primitive-size-540'],
    ],
  },
  {
    category: 'Layout',
    title: 'Content containers',
    description: 'Maximum widths that prevent forms and readable content from stretching across wide viewports.',
    tokens: [
      ['--fds-size-container-form', '--fds-primitive-size-768'],
      ['--fds-size-container-reading', '--fds-primitive-measure-72'],
      ['--fds-size-container-page', '--fds-primitive-size-1280'],
    ],
  },
  {
    category: 'Size',
    title: 'Data',
    description: 'Dense data-table header and row heights.',
    tokens: [
      ['--fds-size-data-header', '--fds-primitive-size-36'],
      ['--fds-size-data-row', '--fds-primitive-size-32'],
    ],
  },
  {
    category: 'Size',
    title: 'Toggle',
    description: 'Toggle track and thumb dimensions.',
    tokens: [
      ['--fds-size-toggle-track', '--fds-primitive-size-36'],
      ['--fds-size-toggle-thumb', '--fds-primitive-size-16'],
    ],
  },
  {
    category: 'Shape',
    title: 'Radius and border',
    description: 'Stable corner and border roles used by components instead of raw measurements.',
    tokens: [
      ['--fds-radius-control', '--fds-primitive-radius-default'],
      ['--fds-radius-container', '--fds-primitive-radius-default'],
      ['--fds-radius-pill', '--fds-primitive-radius-full'],
      ['--fds-border-default', '--fds-primitive-border-width'],
      ['--fds-border-strong', '--fds-primitive-border-width-strong'],
    ],
  },
  {
    category: 'Interaction',
    title: 'State',
    description: 'Shared disabled-state opacity.',
    tokens: [
      ['--fds-opacity-disabled', '--fds-primitive-opacity-disabled'],
    ],
  },
  {
    category: 'Interaction',
    title: 'Focus',
    description: 'Visible keyboard focus width and offset.',
    tokens: [
      ['--fds-focus-ring-width', '--fds-primitive-focus-width'],
      ['--fds-focus-ring-offset', '--fds-primitive-focus-offset'],
    ],
  },
  {
    category: 'Interaction',
    title: 'Motion',
    description: 'Shared durations and easing for UI feedback.',
    tokens: [
      ['--fds-motion-duration-fast', '--fds-primitive-motion-duration-fast'],
      ['--fds-motion-duration-spinner', '--fds-primitive-motion-duration-spinner'],
      ['--fds-motion-easing-standard', '--fds-primitive-motion-easing-standard'],
    ],
  },
  {
    category: 'Interaction',
    title: 'Elevation',
    description: 'Elevation for interactive controls and floating surfaces.',
    tokens: [
      ['--fds-shadow-control', '--fds-primitive-shadow-control'],
      ['--fds-shadow-overlay', '--fds-primitive-shadow-overlay'],
    ],
  },
];

function TokenGroup({group, valueHeading}: {group: TokenGroupData; valueHeading: string}) {
  return <article className="fds-token-docs__group">
    <div className="fds-token-docs__group-heading">
      <p className="fds-token-docs__kicker">{group.category}</p>
      <h3>{group.title}</h3>
      <p>{group.description}</p>
    </div>
    <div className="fds-token-docs__table-wrap">
      <table>
        <thead><tr>
          {group.preview && <th scope="col">Preview</th>}
          <th scope="col">Token</th>
          <th scope="col">{valueHeading}</th>
        </tr></thead>
        <tbody>{group.tokens.map(([name, value]) => <tr key={name}>
          {group.preview && <td><span className="fds-token-docs__color" style={{background: `var(${name})`}} /></td>}
          <th scope="row"><code>{name}</code></th>
          <td><code>{value}</code></td>
        </tr>)}</tbody>
      </table>
    </div>
  </article>;
}

const meta = {
  title: 'Foundations/Tokens',
  parameters: {
    layout: 'fullscreen',
    docs: {description: {component: 'Approved default FDS v1 token foundation. Components consume semantic roles; raw values remain in primitives, and component tokens exist only for stable repeated decisions.'}},
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const breakpointGuidance = [
  {name: 'Base', reference: 'breakpoints.base', ...breakpoints.base, use: 'Single-column and constrained layouts. Keep the core task and primary action visible.'},
  {name: 'Small', reference: 'breakpoints.small', ...breakpoints.small, use: 'Narrow application windows. Add paired fields only when their content still fits.'},
  {name: 'Medium', reference: 'breakpoints.medium', ...breakpoints.medium, use: 'Restore standard page regions and supporting controls when space allows.'},
  {name: 'Large', reference: 'breakpoints.large', ...breakpoints.large, use: 'Required compact desktop baseline. Complete workflows must work without page-level horizontal scrolling.'},
  {name: 'Wide', reference: 'breakpoints.wide', ...breakpoints.wide, use: 'Optional enhancement space. Never make required content or actions available only here.'},
] as const;

export const Primitives: Story = {
  parameters: {docs: {description: {story: 'All approved raw FDS values, grouped by visual property.'}}},
  render: () => <main className="fds-token-docs">
    <header>
      <p className="fds-token-docs__eyebrow">Layer 1 · Default FDS theme</p>
      <h2>Primitive tokens</h2>
      <p className="fds-token-docs__intro">Literal values with no product meaning. They form the source scales for color, spacing, size, shape, typography, motion, and elevation.</p>
    </header>

    <section aria-label="Primitive token reference">
      {primitiveGroups.map((group) => <TokenGroup group={group} valueHeading="Raw value" key={`${group.category}-${group.title}`} />)}
    </section>
  </main>,
};

export const Semantics: Story = {
  parameters: {docs: {description: {story: 'All approved purpose-based FDS roles and their source mappings.'}}},
  render: () => <main className="fds-token-docs">
    <header>
      <p className="fds-token-docs__eyebrow">Layer 2 · Default FDS theme</p>
      <h2>Semantic tokens</h2>
      <p className="fds-token-docs__intro">Purpose-based roles consumed by FDS components. Their names describe why a value is used; each mapping shows where that value comes from.</p>
    </header>

    <section aria-label="Semantic token reference">
      {semanticGroups.map((group) => <TokenGroup group={group} valueHeading="Resolves to" key={`${group.category}-${group.title}`} />)}
      <p className="fds-token-docs__note">White on primary is 5.13:1; white on active is 9.90:1. Legacy accent remains a non-action role because white on it is 3.54:1.</p>
    </section>
  </main>,
};

export const Breakpoints: Story = {
  parameters: {docs: {description: {story: 'Shared viewport thresholds for compact, responsive FDS application layouts.'}}},
  render: () => <main className="fds-token-docs fds-breakpoint-docs">
    <header>
      <p className="fds-token-docs__eyebrow">Responsive foundation</p>
      <h2>Breakpoints</h2>
      <p className="fds-token-docs__intro">FDS starts compact and treats 1024 × 768 as the required desktop baseline. These min-width references coordinate page composition; wider screens add breathing room, not essential functionality.</p>
    </header>

    <section aria-label="Breakpoint reference">
      <div className="fds-token-docs__table-wrap">
        <table>
          <thead><tr><th scope="col">Breakpoint</th><th scope="col">Starts at</th><th scope="col">Layout intent</th></tr></thead>
          <tbody>{breakpointGuidance.map(({name, value, pixels, reference, use}) => <tr key={name}>
            <th className="fds-breakpoint-docs__name" scope="row"><span>{name}</span><code>{reference}</code></th>
            <td className="fds-breakpoint-docs__value"><code>{value}</code> <span className="fds-breakpoint-docs__pixels">({pixels}px)</span></td>
            <td>{use}</td>
          </tr>)}</tbody>
        </table>
      </div>
      <p className="fds-token-docs__note">Use a component or container-specific breakpoint when its own content breaks before or after one of these viewport thresholds.</p>
    </section>

    <section aria-labelledby="container-widths">
      <h3 id="container-widths">Width behavior on large screens</h3>
      <div className="fds-token-docs__table-wrap">
        <table className="fds-breakpoint-docs__containers">
          <thead><tr><th scope="col">Content</th><th scope="col">Maximum</th><th scope="col">Behavior</th></tr></thead>
          <tbody>
            <tr><th scope="row">Forms<br /><code>--fds-size-container-form</code></th><td><code>48rem</code></td><td>Remain aligned to the page grid; inputs do not stretch across the viewport.</td></tr>
            <tr><th scope="row">Reading<br /><code>--fds-size-container-reading</code></th><td><code>72ch</code></td><td>Keep paragraphs and guidance at a readable line length.</td></tr>
            <tr><th scope="row">Standard pages<br /><code>--fds-size-container-page</code></th><td><code>80rem</code></td><td>Keep page regions related while the shell and background continue to fill the viewport.</td></tr>
            <tr><th scope="row">Data workspaces</th><td>Fluid</td><td>Use available width for tables and operational canvases; constrain their internal columns instead.</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section aria-labelledby="breakpoint-usage">
      <h3 id="breakpoint-usage">How to apply the scale</h3>
      <ul className="fds-breakpoint-docs__rules">
        <li><strong>Build the base layout first.</strong><span>Preserve the task, reading order, and primary action before adding columns.</span></li>
        <li><strong>Change layout when content needs it.</strong><span>Do not target a device name or add a breakpoint only to match the scale.</span></li>
        <li><strong>Keep 1024 × 768 complete.</strong><span>Dense freight workflows must remain usable without page-level horizontal scrolling.</span></li>
        <li><strong>Treat 1280px and above as enhancement.</strong><span>Add context or space; do not hide required controls below it.</span></li>
      </ul>
      <pre className="fds-breakpoint-docs__code"><code>{`.page-content {\n  inline-size: min(100%, var(--fds-size-container-page));\n  margin-inline: auto;\n}\n\n.form-content {\n  inline-size: min(100%, var(--fds-size-container-form));\n}\n\n@media (min-width: 64rem) { /* breakpoints.large */\n  .shipment-workspace { grid-template-columns: 16rem minmax(0, 1fr); }\n}`}</code></pre>
    </section>
  </main>,
};

export const TokenNames: Story = {
  name: 'Token names',
  parameters: {docs: {description: {story: 'Choose the owning layer, build an FDS token name, and complete the checks required before release.'}}},
  render: () => renderTokenNamingGuide(),
};
