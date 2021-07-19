import { Box, Spinner } from 'grommet';
import { isEqual } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { v4 } from 'uuid';
import { rawToComponent } from './live';
import { LiveComponentErrorBoundary } from './LiveComponentErrorBoundary';

export interface LiveComponentProps {
    code?: string;
    extras?: any;
}

export const LiveComponent : React.FC<LiveComponentProps> = (props) => {
    
    const ComponentRef = useRef<{component: {default: any}}>({component: {default: null}})

    const LastComponentRef = useRef<{component: { default: any}}>({component: {default: null}})

    const [ code, setCode ] = useState<string>('')
    const [ error, setError ] = useState<boolean>(false)

    useEffect(() => {
        if(props.code && !isEqual(props.code, code)){
            const component = rawToComponent(props.code)

            if(!error) LastComponentRef.current.component = ComponentRef.current.component

            if(component != undefined && component.default){
                setCode(props.code)
                ComponentRef.current.component = Object.assign({}, {
                    default: component.default
                })
            }
        }
    }, [props.code, code])
   

    return (ComponentRef.current.component.default != null) ? 
        <LiveComponentErrorBoundary
            onError={(error: boolean) => setError(error)}
            fallback={LastComponentRef.current.component.default}>
                {(error) => error ? (
                    <LastComponentRef.current.component.default {...props.extras} />
                ): (
            <ComponentRef.current.component.default {...props.extras} />)}
        </LiveComponentErrorBoundary> :
        <Box align="center" justify="center" direction="column"><Spinner /> Loading ...</Box>
   
}