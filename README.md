# React Live Loader

A flexible library for loading React components in to a running ship

**React Live Loader** brings you the ability to render React components with editable source code and live preview.
It supports remote loading and comes in a tiny bundle.

The library is structured modularly and lets you style and compose its components freely.

## Install

```
npm i react-live-loader
```

or 

```
yarn add react-live-loader
```

## Usage

LiveComponent

```typescript
import {
    LiveComponent
} from 'react-live-loader'

<LiveComponent 
code={`
    import React from 'react';

    export interface IProps{
        value?: string;
    }

    export default (props: IProps) => {
        return ( 
            <div>{props.value}</div>
        )
    }
`} 
props={{
    value: 'string'
}}/>
```

RemoteComponent

```
npm i react-remote-loader
```

```typescript

import {
    RemoteComponent
} from 'react-remote-loader'

<RemoteComponent url="" />

```

