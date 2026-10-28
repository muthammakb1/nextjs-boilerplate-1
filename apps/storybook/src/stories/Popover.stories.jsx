import { Popover, Button } from '@indigo-shared-lib/ui';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    triggerAction: {
      control: 'select',
      options: ['click', 'hover'],
    },
  },
};

export default meta;

export const Default = {
  args: {
    title: 'User Info',
    trigger: <Button>Open Popover</Button>,
    children: <p>This is the popover content.</p>,
    position: 'bottom',
    triggerAction: 'click',
  },
};

export const HoverTrigger = {
  args: {
    title: 'Hover Info',
    trigger: <Button variant="outline">Hover Me</Button>,
    children: <p>Appears on hover.</p>,
    position: 'bottom',
    triggerAction: 'hover',
  },
};
