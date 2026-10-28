import { Accordion } from '@indigo-shared-lib/ui';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
};

export default meta;

export const Default = {
  args: {
    items: [
      {
        id: '1',
        title: 'What is Indigo?',
        content: 'Indigo is our enterprise design system and shared library.',
      },
      { id: '2', title: 'How do I install it?', content: 'Run: npm install @indigo-shared-lib/ui' },
      {
        id: '3',
        title: 'Is it accessible?',
        content: 'Yes, all components follow WAI-ARIA best practices.',
      },
    ],
    allowMultiple: false,
  },
};

export const MultipleOpen = {
  args: {
    items: [
      { id: '1', title: 'Section A', content: 'Content for section A.' },
      { id: '2', title: 'Section B', content: 'Content for section B.' },
      { id: '3', title: 'Section C (disabled)', content: 'Disabled content.', disabled: true },
    ],
    allowMultiple: true,
  },
};
