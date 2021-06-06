import React from 'react';
import { Story, Meta } from '@storybook/react';
import * as Icons from 'grommet-icons'
import {Sidebar, SidebarProps } from './Sidebar';

export default {
  title: 'Example/Sidebar',
  component: Sidebar,
} as Meta;

const Template: Story<SidebarProps> = (args) => <Sidebar {...args} />;

export const UncontrolledDrawer = Template.bind({});
UncontrolledDrawer.args = {
  menu: [
    {
      icon: <Icons.Projects />,
       pane: (<div>menu</div>),
      label: "Projects"}
  ],
  children: (<div style={{flex: 1, background: 'green'}}></div>)
};

export const NoDrawer = Template.bind({})
NoDrawer.args = {
  menu: [
    {icon: <Icons.Projects />, pane: (<div style={{flex: 1, background: 'green'}}></div>)}
  ],
  noDrawer: true
}
