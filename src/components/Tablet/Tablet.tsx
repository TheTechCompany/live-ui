import React, { useEffect, useState } from 'react';
import { Box, Nav, Sidebar, Button } from 'grommet'
import * as Icons from 'grommet-icons'

export interface TabletMenuItem {
    icon?: any;
    pane?: any;
}

export interface TabletProps {
    menu?: TabletMenuItem[]
    direction?: string;
    noDrawer?: boolean;

    onSelect?: (ix: number) => void;
    selected?: number;
}

export const Tablet : React.FC<TabletProps> = (props) => {
    const [ selected, setSelected ] = useState<number>(props.selected || -1)

    useEffect(() => {
        if(props.selected){
            setSelected(props.selected)
        }
    }, [props.selected])

    const onClick = (ix: number) => {
        if(props.onSelect){
            props.onSelect(ix)
        }

        if(props.noDrawer){
            setSelected(ix)
        }else{
            setSelected((selected == ix) ? -1 : ix)
        }
    }

    const renderNav = () => {
        const slideIn = props.direction == 'left' ? 'slideRight': 'slideLeft';
        const slideOut = props.direction == 'left' ? 'slideLeft': 'slideRight';

        const transition = `
            width 250ms ${props.selected || -1 > -1 ? 'ease-in' : 'ease-out'},
            opacity 250ms ${props.selected || -1 > -1 ? 'ease-in': 'ease-out'}
        `

        let nav = [
            
            !props.noDrawer && 
                <Box 
                    elevation="small"
                    style={{
                        transition: transition,
                        opacity: selected > -1 ? 1 : 0
                    }}
                    width={selected > -1 ? `200px` : `0px`}>
                    {!props.noDrawer ? (selected > -1 && props.menu?.[selected].pane) : null}
                </Box>,
            <Sidebar
            round="small"
            background="brand">
                <Nav gap="small">
                    {props.menu?.map((menu_item, menu_ix) => (
                        <Button 
                            onClick={() => onClick(menu_ix)}
                            icon={menu_item.icon} />
                    ))}
                </Nav>
            </Sidebar>
            ]

        return props.direction == 'left' ? nav.reverse() : nav;

    }

    return (
        <Box
            elevation="small"
            flex
            direction="row">
            {props.direction == 'left' && renderNav()}
            <Box flex>
                {props.noDrawer ? (selected > -1 && props.menu?.[selected].pane) : props.children }
            </Box>
            {props.direction != 'left' && renderNav()}
          
        </Box>
    )
}