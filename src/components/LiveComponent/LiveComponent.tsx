import React, { useEffect, useState } from 'react';
import { rawToComponent } from './live';

export interface LiveComponentProps {
    code?: string;
    extras?: any;
}

export const LiveComponent : React.FC<LiveComponentProps> = (props) => {
    const [ RComponent, setComponent ] = useState<any>(null)

    useEffect(() => {
        if(props.code){
            const component = rawToComponent(props.code)
            setComponent(component)
        }
    }, [props.code])

    return (RComponent != null && typeof(RComponent) == "object") ? <RComponent.default {...props.extras} />: <div>loading {typeof(RComponent)} {JSON.stringify(RComponent)}</div>
}