import type {Meta, StoryObj} from '@storybook/react-vite';
import {useState} from 'react';
import {Icon} from 'sandbox-fds-icons';
import {TextInput} from '../components/TextInput';
import './Icons.stories.css';

const iconNames = [
  'account_tree',
  'add',
  'add_link',
  'add_notes',
  'airline_stops',
  'airlines',
  'anchor',
  'approval',
  'arrow_downward',
  'arrow_downward_alt',
  'arrow_forward',
  'arrow_upward',
  'arrow_upward_alt',
  'article_person',
  'assignment',
  'attach_file',
  'attach_file_add',
  'automation',
  'box_add',
  'calendar_add_on',
  'calendar_check',
  'calendar_clock',
  'calendar_month',
  'calendar_today',
  'captive_portal',
  'cards_star',
  'check_circle',
  'chevron_left',
  'chevron_right',
  'close',
  'contact_support',
  'contacts',
  'content_copy',
  'conversion_path',
  'create_new_folder',
  'delete',
  'density_large',
  'density_medium',
  'density_small',
  'description',
  'directions_boat',
  'docs',
  'document_search',
  'download',
  'draft',
  'drag_indicator',
  'edit',
  'event',
  'event_list',
  'expand_content',
  'expand_more',
  'explore',
  'feedback',
  'file_copy',
  'file_export',
  'file_save',
  'filter_alt',
  'filter_list',
  'folder',
  'folder_eye',
  'folder_info',
  'globe_location_pin',
  'group',
  'group_add',
  'help',
  'history_2',
  'info',
  'instant_mix',
  'keyboard_double_arrow_left',
  'keyboard_double_arrow_right',
  'library_add_check',
  'link',
  'link_off',
  'local_shipping',
  'lock',
  'lock_open',
  'lock_person',
  'mail',
  'menu',
  'more_vert',
  'note_alt',
  'note_stack',
  'notifications',
  'notifications_off',
  'notifications_unread',
  'open_in_full',
  'open_with',
  'orders',
  'package',
  'package_2',
  'pallet',
  'partner_exchange',
  'person',
  'print',
  'priority_high',
  'public',
  'public_off',
  'refresh',
  'remove',
  'save',
  'search',
  'search_off',
  'settings',
  'signal_cellular_0_bar',
  'signal_cellular_3_bar',
  'signal_cellular_connected_no_internet_4_bar',
  'sort',
  'sort_by_alpha',
  'sticky_note_2',
  'sync_alt',
  'task',
  'tour',
  'trip',
  'tune',
  'upload',
  'user_attributes',
  'visibility',
  'visibility_lock',
  'visibility_off',
  'wand_stars',
  'warehouse',
  'web_traffic',
] as const;

const meta: Meta<{size: 16 | 20}> = {
  title: 'Foundations/Icons',
  args: {size: 20},
  argTypes: {size: {control: 'inline-radio', options: [16, 20]}},
  parameters: {
    docs: {
      description: {
        component: 'Icons currently used by FDS components and stories. The icon package renders Material Symbols Sharp by name; adding a name here makes current FDS usage visible without expanding the package API.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<{size: 16 | 20}>;

function IconsDocumentation({size}: {size: 16 | 20}) {
  const [query, setQuery] = useState('');
  const [copiedName, setCopiedName] = useState('');
  const [copyError, setCopyError] = useState('');
  const visibleIcons = iconNames.filter((name) => name.includes(query.trim().toLowerCase().replace(/\s+/g, '_')));

  const copyUsage = async (name: string) => {
    const usage = `<Icon name="${name}" />`;

    try {
      await navigator.clipboard.writeText(usage);
    } catch {
      const field = document.createElement('textarea');
      field.value = usage;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.append(field);
      field.select();
      const copied = document.execCommand('copy');
      field.remove();

      if (!copied) {
        setCopiedName('');
        setCopyError('Could not copy. Copy the markup from “Use an icon” instead.');
        return;
      }
    }

    setCopyError('');
    setCopiedName(name);
  };

  return (
    <section className="fds-icons-page" aria-labelledby="fds-icons-heading">
      <header className="fds-icons-page__header">
        <h2 id="fds-icons-heading">Icons</h2>
        <p>Find the right FDS icon, then copy its ready-to-use component markup.</p>
      </header>
      <section className="fds-icons-engineering" aria-labelledby="fds-icons-engineering-heading">
        <div>
          <h3 id="fds-icons-engineering-heading">Use an icon</h3>
          <p>Import the shared Icon component, then pass the exact snake_case name shown in the catalog.</p>
        </div>
        <pre><code>{`import {Icon} from 'sandbox-fds-icons';\n\n<Icon name="person" />`}</code></pre>
      </section>
      <section className="fds-icons-guide" aria-labelledby="fds-icons-guidance-heading">
        <h3 id="fds-icons-guidance-heading">Usage and accessibility guidance</h3>
        <div className="fds-icons-guide__grid">
          <div className="fds-icons-guide__item">
            <h4>Use icons consistently</h4>
            <ul>
              <li>Reinforce a visible action label, status, object, or direction.</li>
              <li>Use an icon without visible text only when its meaning is familiar and unambiguous.</li>
              <li>Keep one meaning for each icon across products and workflows.</li>
            </ul>
          </div>
          <div className="fds-icons-guide__item">
            <h4>Keep the interface clear</h4>
            <ul>
              <li>Do not replace an unfamiliar or consequential label. Use visible text.</li>
              <li>Do not add icons only for decoration or combine competing icons in one action.</li>
              <li>Do not invent one-off fill, weight, color, or size treatments.</li>
            </ul>
          </div>
          <div className="fds-icons-guide__item">
            <h4>Size and accessibility</h4>
            <ul>
              <li>Use 20px by default and 16px in compact controls, toolbars, tables, or pagination.</li>
              <li>Put the accessible name on the Button, IconButton, or link—not the glyph.</li>
              <li>Pair status icons with text. Never rely on an icon or color alone.</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="fds-icons-catalog" aria-labelledby="fds-icons-list-heading">
        <div className="fds-icons-catalog__heading">
          <div>
            <h3 id="fds-icons-list-heading">Available icons</h3>
            <p>Search by name. Select any icon to copy its component markup.</p>
          </div>
          <p className={`fds-icons-catalog__status${copiedName || copyError ? ' fds-icons-catalog__status--feedback' : ''}${copyError ? ' fds-icons-catalog__status--error' : ''}`} role="status" aria-atomic="true">
            {copyError || (copiedName ? <span>Copied <code>{`<Icon name="${copiedName}" />`}</code></span> : `${visibleIcons.length} icons`)}
          </p>
        </div>
        <div className="fds-icons-catalog__search">
          <TextInput label="Search icons" value={query} onChange={(value) => {setQuery(value); setCopiedName(''); setCopyError('');}} placeholder="Try document search" />
        </div>
        {visibleIcons.length ? (
          <ul className="fds-icons-catalog__grid">
            {visibleIcons.map((name) => (
              <li key={name}>
                <button className={`fds-icons-card${copiedName === name ? ' fds-icons-card--copied' : ''}`} type="button" onClick={() => void copyUsage(name)} aria-label={`Copy ${name} icon usage`}>
                  <span className="fds-icons-card__copied-indicator" aria-hidden="true"><Icon name="check" size={16} /></span>
                  <Icon name={name} size={size} />
                  <code>{name}</code>
                </button>
              </li>
            ))}
          </ul>
        ) : <p>No icons match “{query}”.</p>}
      </section>
    </section>
  );
}

export const CurrentUsage: Story = {
  render: ({size}) => <IconsDocumentation size={size} />,
};
