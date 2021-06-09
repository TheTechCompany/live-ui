import { Header as GrommetHeader, Button, BoxProps, Heading } from 'grommet'
import React from 'react'

export interface HeaderProps {
    title?: any;
    action?: any;
    onActionClick?: () => void;

    justify?: BoxProps["justify"];
}

export const Header : React.FC<HeaderProps> = (props) => {
    return (
        <GrommetHeader
            justify={props?.justify}
            pad={{horizontal: 'medium'}}
            elevation="1"
            background="brand">
            {props.action && (
                <Button icon={props.action} onClick={props.onActionClick}/>)}
            {props.title}
            {props.children}
        </GrommetHeader>
    )
}