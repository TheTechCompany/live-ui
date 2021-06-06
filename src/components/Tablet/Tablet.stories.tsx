import React from 'react';
import { Story, Meta } from '@storybook/react';
import * as Icons from 'grommet-icons'
import { Tablet, TabletProps } from './Tablet';

export default {
  title: 'Example/Tablet',
  component: Tablet,
} as Meta;

const Template: Story<TabletProps> = (args) => <Tablet {...args} />;

export const UncontrolledDrawer = Template.bind({});
UncontrolledDrawer.args = {
  menu: [
    {icon: <Icons.Projects />, pane: (<div>menu</div>)}
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
