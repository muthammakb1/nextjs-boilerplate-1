import { Tooltip, Button } from '@indigo-shared-lib/ui';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
  },
};

export default meta;

export const Default = {
  args: {
    content: 'This is a tooltip',
    children: <Button>Hover me</Button>,
    position: 'top',
  },
};
