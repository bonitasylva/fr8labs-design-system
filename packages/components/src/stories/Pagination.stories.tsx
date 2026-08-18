import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {Pagination} from '../components/Pagination';

const meta = {
  title: 'Components/Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: {page: 1, pageCount: 6, onPageChange: () => {}, label: 'Shipment result pages'},
  parameters: {
    fds: {approved: true, status: 'approved'},
    docs: {
      description: {
        component: 'Pagination moves through a known number of result pages. Give each instance a specific label; the current page is announced after Previous or Next changes it.',
      },
    },
  },
} satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ControlledNavigation: Story = {
  render: () => {
    const [page, setPage] = useState(2);
    return <Pagination page={page} pageCount={6} onPageChange={setPage} label="Shipment result pages" />;
  },
};

export const BoundaryPages: Story = {
  render: () => <div style={{display: 'grid', gap: 24}}><Pagination page={1} pageCount={6} onPageChange={() => {}} label="First-page boundary" /><Pagination page={6} pageCount={6} onPageChange={() => {}} label="Last-page boundary" /></div>,
};

export const InvalidBoundsNormalize: Story = {
  args: {page: -4, pageCount: 0, label: 'Normalized pagination boundary'},
};
