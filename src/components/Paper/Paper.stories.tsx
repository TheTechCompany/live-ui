import React from 'react';
import { Story, Meta } from '@storybook/react';
import * as Icons from 'grommet-icons'
import { Paper } from './Paper';

export default {
  title: 'Example/Paper',
  component: Paper,
} as Meta;

const Template: Story<any> = (args) => <Paper {...args} />;

export const Plain = Template.bind({});
Plain.args = {
};

