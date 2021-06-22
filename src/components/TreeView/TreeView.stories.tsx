import React from 'react';
import { Story, Meta } from '@storybook/react';
import * as Icons from 'grommet-icons';
import { TreeView, TreeViewProps } from './TreeView';

export default {
  title: 'Example/TreeView',
  component: TreeView,
} as Meta;

const Template: Story<TreeViewProps> = (args) => <TreeView {...args} />;

export const FewTabs = Template.bind({});
FewTabs.args = {
    items: [{
    id: 'root',
    label: "Project",

    items: [{
        id: 'uf-plant',
        label: "UF Plant",
        items: [
            {
                id: 'sub-proc',
                label: "Sub proc",
                items: [
                    {label: "Proc"}
                ]
            },
            {label: "Sub proc 2"}
        ]
    }, {
        id: 'nf-plant',
        label: 'NF Plant',
        items: [
            {
                id: 'sub-procc',
                label: "Sub proc"
            }
        ]
    }]
}],
    onSelect: (node) => {console.log(node)},
    onCreate: (node) => {console.log(node)}
};

