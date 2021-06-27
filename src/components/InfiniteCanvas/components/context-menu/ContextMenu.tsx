import React from 'react';
import { Box, Button, Text, List } from 'grommet';
import * as Icons from 'grommet-icons'
import styled from 'styled-components'

export interface ContextMenuProps {
    x?: number;
    y?: number;

    open?: boolean;

    className?: string;
}

export const BaseContextMenu : React.FC<ContextMenuProps> = (props) => {
    return !props.open ? null : (
        <Box
            className={props.className}
            background="light-2"
            round="xsmall"
            width="xsmall"
            elevation="small"
            pad="small"
            style={{
                zIndex: 20,
                position: 'absolute',
                top: props.y,
                left: props.x
            }}>
            <List
                className="context-menu__list"
                pad="none"
                data={[
                    {
                        icon: <Icons.Edit size="small" />,
                        label: "Edit"
                }]}>
                {(datum: any) => (
                    <Box 
                        align="center"
                        className="context-menu__item" 
                        direction="row">
                        {datum.icon}
                        <Text margin="none">{datum.label}</Text>
                    </Box>
                )}
            </List>
        </Box>
    )
}

export const ContextMenu = styled(BaseContextMenu)`

.context-menu__list .context-menu__item{
    padding: 3px;
    cursor: pointer;
    text-align: start;
}

.context-menu__list .context-menu__item span{
    line-height: 16px;
}

.context-menu__list .context-menu__item svg{
    width: 16px;
    height: 16px;
    margin-right: 8px;
}

.context-menu__list .context-menu__item:hover{
    background: #dfdfdf;
}
`