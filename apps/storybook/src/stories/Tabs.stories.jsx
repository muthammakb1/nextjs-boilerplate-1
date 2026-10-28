import { Tabs, TabList, Tab, TabPanel } from '@indigo-shared-lib/ui';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
};

export default meta;

export const Default = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabList>
        <Tab value="tab1">Account</Tab>
        <Tab value="tab2">Settings</Tab>
        <Tab value="tab3" disabled>
          Billing
        </Tab>
      </TabList>
      <TabPanel value="tab1">
        <p>Account settings content goes here.</p>
      </TabPanel>
      <TabPanel value="tab2">
        <p>Application settings content goes here.</p>
      </TabPanel>
      <TabPanel value="tab3">
        <p>Billing content goes here.</p>
      </TabPanel>
    </Tabs>
  ),
};
