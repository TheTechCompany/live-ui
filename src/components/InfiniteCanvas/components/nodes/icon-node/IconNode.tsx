import { Box } from 'grommet';
import React from 'react';
import styled from 'styled-components'
import * as Icons from 'grommet-icons'
import { PortWidget } from '../../ports';

export interface IconNodeProps{
    className?: string;
    extras?: {
        color?: string;
        icon?:string;
    }
    children?: (element: JSX.Element) => JSX.Element
}

const _Icons : any = Icons;

export const BaseIconNode : React.FC<IconNodeProps> = (props) => {
    const Icon = props.extras?.icon ? _Icons[props.extras?.icon] : Icons.Previous;

    return (
        <Box 
            width={'72px'}
            height={'72px'}
            elevation={'small'}
            background={"light-2"}
            round="small"
            align="center"
            justify="center"
            border={{style: 'dotted', size: 'small', color: props.extras?.color || 'brand'}}
            className={props.className}>
            {props.children?.(<Icon size="large" />)}
        </Box>
    )
}


export const UnstyledIconNode = (props : IconNodeProps) => {

    return (
        <BaseIconNode {...props}>
            {(icon) => (
                <>
                <PortWidget id="in" />
                {icon}
                <PortWidget id="out"    />
                </>
            )}
    
        </BaseIconNode>
    )
}


export const IconNode = styled(UnstyledIconNode)`
    .port{
        border-radius: 7px;
        height: 15px;
        width: 15px;
    }

    .port-base:first-child{
        top: -7px;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        margin: 0 auto;
        position: absolute;
    }

    .port-base:last-child{
        bottom: -7px;
        left: 0;
        right: 0;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        position: absolute;
    }
`