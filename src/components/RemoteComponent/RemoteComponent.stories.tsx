import React from 'react';
import { Story, Meta } from '@storybook/react';

import { RemoteComponent, RemoteComponentProps } from './RemoteComponent';

export default {
  title: 'Example/RemoteComponent',
  component: RemoteComponent,
} as Meta;

const Template: Story<RemoteComponentProps> = (args) => <RemoteComponent {...args} />;

export const CodeString = Template.bind({});
CodeString.args = {
  code: `
    import React from 'react';

    export default (props: any) => <div>Hello world</div>
  `,
  extras: {}
};

export const ComponentWithProps = Template.bind({});
ComponentWithProps.args = {
    code: `
        import React from 'react';

        export interface ComponentProps {
            name?: string;
        }

        export default (props: ComponentProps) => (
            <div style={{backgroundColor: 'white', border: '1px solid black', borderRadius: 5, padding: 8}}>
                {props.name}
            </div>
        )
    `,
    extras: {
        name: "Name Prop"
    }
};