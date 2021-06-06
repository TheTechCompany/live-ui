import React from 'react';
import { Story, Meta } from '@storybook/react';

import { InfiniteCanvas, InfiniteCanvasProps, ZoomControls } from './InfiniteCanvas';

export default {
  title: 'Example/InfiniteCanvas',
  component: InfiniteCanvas,
} as Meta;

const Template: Story<InfiniteCanvasProps> = (args) => <InfiniteCanvas {...args}>
  <ZoomControls anchor={{horizontal: 'right', vertical: 'bottom'}} />
</InfiniteCanvas>;

export const FewTabs = Template.bind({});
FewTabs.args = {

};

