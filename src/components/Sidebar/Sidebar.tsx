import React from 'react';

import { Sidebar as GrommerSidebar, Box, Nav, Button } from 'grommet'

export interface SidebarProps {
    menu: {icon?: any, label?: string}[]
    onClick?: (item?: any) => void;
    expanded?: boolean;
}

export const Sidebar : React.FC<SidebarProps> = (props) => {
    return (
        <Box 
            direction="column"
            style={{
                height: '100%',
                transition: 'width 400ms ease-out', 
                overflow: 'hidden', 
                width: `${props.expanded ? '200px' : '50px'}`
            }}>
        <GrommerSidebar
            flex
            margin="none"
            background="brand"
            pad="none"
            round={{
                "corner": "right",
                size: 'small'
            }}>
            <Nav gap="small">
                {props.menu.map((item) => (
                    <Button 
                        alignSelf={props.expanded ? 'start':  'center'}
                        style={{paddingBottom: 8, paddingTop: 8, border: 'none', borderRadius: 0}}
                        size="medium"
                        onClick={() => props.onClick?.(item)}
                        icon={item.icon}
                        label={props.expanded && item.label}
                        hoverIndicator>
                    </Button>
                ))}
            </Nav>
        </GrommerSidebar>
        </Box>
    )
}