import React from 'react';
import { Story, Meta } from '@storybook/react';
import * as Icons from 'grommet-icons';
import { TabPane, TabPaneProps } from './TabPane';

export default {
  title: 'Example/TabPane',
  component: TabPane,
} as Meta;

const Template: Story<TabPaneProps> = (args) => <TabPane {...args} />;

export const FewTabs = Template.bind({});
FewTabs.args = {
  tabs: [
    {label: "Main menu", pane: (<div> Main</div>)},
    {label: "Backups"}
  ]
};

export const RightAction = Template.bind({});
RightAction.args = {
  tabs: [
    {label: "Main menu", pane: (<div> Main</div>)},
    {label: "Backups"}
  ],
  rightAction: <Icons.Save />
};

