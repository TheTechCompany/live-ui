import React, {useState, useMemo, useEffect } from 'react';
import { remoteToComponent } from '../LiveComponent'

export interface RemoteComponentProps {
    url?: string;
    props?: any;
}

export const RemoteComponent : React.FC<RemoteComponentProps> = (props) => {
    const [ url, setUrl ] = useState<string>();
    
    const [ Component, setComponent ] = useState<any>()

    useEffect(() => {
        if(props.url && props.url != url){
            remoteToComponent(props.url).then((component) => {
                setComponent(component)
                setUrl(props.url)
            })
        }
    }, [props.url])
   
    return Component ? Component(props.props) : <div></div>;
}
