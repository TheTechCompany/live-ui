import React from 'react';
import { Story, Meta } from '@storybook/react';
import * as Icons from 'grommet-icons'
import { Header, HeaderProps } from './Header';

export default {
  title: 'Example/Header',
  component: Header,
} as Meta;

const Template: Story<HeaderProps> = (args) => <Header {...args} />;

export const PlainHeader = Template.bind({});
PlainHeader.args = {
  title: "Title"
};

export const HeaderAction = Template.bind({})
HeaderAction.args = {
  title: "Title",
  action: <Icons.Menu />,
  onActionClick: () => console.log("Action")
}
