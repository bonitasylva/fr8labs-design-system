import type {Meta, StoryObj} from '@storybook/react-vite';
import catalog from '../catalog/fds-catalog.json';

const meta = {
  title: 'Internal/Catalog/MCP pilot',
  parameters: {docs: {description: {component: 'The authenticated read-only MCP pilot and this check consume the same versioned catalog source. Experimental records remain visible here for review but are excluded from MCP results.'}}},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const VersionedRecords: Story = {
  render: () => <main style={{padding: 'var(--fds-space-5)'}}>
    <h2>FDS catalog {catalog.currentApprovedVersion}</h2>
    <table>
      <thead><tr><th scope="col">ID</th><th scope="col">Kind</th><th scope="col">Status</th><th scope="col">Storybook source</th></tr></thead>
      <tbody>{catalog.items.map((item) => <tr key={item.id}><th scope="row"><code>{item.id}</code></th><td>{item.kind}</td><td>{item.status}</td><td>{item.source.storybookTitle ?? 'Not visual'}</td></tr>)}</tbody>
    </table>
  </main>,
};
