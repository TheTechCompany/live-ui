import React from 'react';
import { Story, Meta } from '@storybook/react';
import * as Icons from 'grommet-icons'
import {LoginForm, LoginFormProps } from './LoginForm';

export default {
  title: 'Example/LoginForm',
  component: LoginForm,
} as Meta;

const Template: Story<LoginFormProps> = (args) => <LoginForm {...args} />;

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
