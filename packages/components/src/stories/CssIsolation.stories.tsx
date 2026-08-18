import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {Icon} from 'sandbox-fds-icons';
import {Button} from '../components/Button';
import {IconButton} from '../components/IconButton';
import {Dialog} from '../components/Dialog';
import {Drawer} from '../components/Drawer';
import {FdsProvider} from '../provider';

const meta = {title: 'Internal/Quality/CSS isolation', parameters: {fdsProvider: false}} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Example() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  return <><section data-testid="outside-fds"><h2>Unrelated consumer content</h2><p>This remains owned by the application.</p></section><FdsProvider><section data-testid="inside-fds"><h2>FDS content</h2><Button onClick={() => setDialogOpen(true)}>Open dialog</Button><Button onClick={() => setDrawerOpen(true)}>Open drawer</Button><IconButton aria-label="Open drawer" onClick={() => setDrawerOpen(true)}><Icon name="menu" /></IconButton><Dialog title="Scoped dialog" isOpen={dialogOpen} onOpenChange={setDialogOpen}><p>Dialog styles remain in the FDS subtree.</p></Dialog><Drawer title="Scoped drawer" isOpen={drawerOpen} onOpenChange={setDrawerOpen}><p>Drawer styles remain in the FDS subtree.</p></Drawer></section></FdsProvider></>;
}

export const OutsideUnaffectedAndOverlaysStyled: Story = {render: () => <Example />};
