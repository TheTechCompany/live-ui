import React from 'react';

import { Sidebar as GrommerSidebar, Nav, Button } from 'grommet'

export interface SidebarProps {
    menu: {icon?: any, label?: string}[]
    expanded?: boolean;
}

export const Sidebar : React.FC<SidebarProps> = (props) => {
    return (
        <GrommerSidebar
            margin="none"
            background="brand"
            pad="none"
            style={{transition: 'width 250ms ease-in'}}
            width={{width: `${props.expanded ? '200px' : '50px'}`}}
            round={{
                "corner": "right",
                size: 'small'
            }}>
            <Nav gap="small">
                {props.menu.map((item) => (
                    <Button 
                        icon={item.icon}
                        hoverIndicator>
                        {props.expanded && item.label}

                    </Button>
                ))}
            </Nav>
        </GrommerSidebar>
    )
}