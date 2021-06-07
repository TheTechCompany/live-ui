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
    {icon: <Icons.Projects />, pane: (
      <div style={{flex: 1}}>
        <div style={{height: '200px', width: '100px', background: 'green', marginBottom: 8}}>
        menu
        </div> <div style={{height: '200px', width: '100px', background: 'green', marginBottom: 8}}>
        menu
        </div> <div style={{height: '200px', width: '100px', background: 'green', marginBottom: 8}}>
        menu
        </div> <div style={{height: '200px', width: '100px', background: 'green', marginBottom: 8}}>
        menu
        </div> <div style={{height: '200px', width: '100px', background: 'green', marginBottom: 8}}>
        menu
        </div>
        
      </div>)}
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
