import React from 'react';
import { Story, Meta } from '@storybook/react';
import * as Icons from 'grommet-icons'
import { GridList, GridListProps } from './GridList';

export default {
  title: 'Example/GridList',
  component: GridList,
} as Meta;

const Template: Story<GridListProps> = (args) => <GridList {...args} />;

export const PlainHeader = Template.bind({});
PlainHeader.args = {
    items: [
      {name: "Grid Item 1"},
      {name: "Grid Item 2"}
    ]
};

export const CreateItem = Template.bind({})
CreateItem.args = {
    items: [
      {name: "Grid Item 1"},
      {name: "Grid Item 2"}
    ],
    addItem: () => console.log("?Add")
}
