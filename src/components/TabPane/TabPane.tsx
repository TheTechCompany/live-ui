import React, { useEffect, useState } from 'react';
import { Box, Button, Tabs, Tab } from 'grommet'
import { Paper } from '../Paper';
import styled from 'styled-components';

export interface TabItem {
    label?: string;
    pane?: any;

}

export interface TabPaneProps {
    tabs?: TabItem[]

    background?: string;

    selected?: number;
    onChange?:( ix: number ) => void;
    rightAction?: any;
    onRightAction?: any;

    className?: string;
}

export const BaseTabPane : React.FC<TabPaneProps> = (props) => {
    const [ selected, setSelected ] = useState<number>(0);
    
    useEffect(() => {
        if(props.selected != null){
            setSelected(props.selected)
        }
    }, [props.selected])

    const onChange = (ix: number) => {
        if(props.onChange){
            props.onChange(ix)
        }

        setSelected(ix)
    }

    return (
        <Paper
            background={props.background || "brand"}
            className={props.className} >
            <Box
                direction="row"
                justify="between">
            <Tabs 
                activeIndex={selected}
                onActive={(ix) => onChange(ix)}
                alignControls="start">
                {props.tabs?.map((tab, ix) => (
                    <Tab
                        className={`tab-pane__tab ${selected == ix ? 'active': ''}`}
                        title={(
                        <Box
                            pad="small"
                            background={selected == ix ? 'light-1' : "light-1"}
                            round={{corner: 'top', size: 'small'}}
                            >
                            {tab.label}
                        </Box>)}>
                    </Tab>
                ))}
            </Tabs>
           {props.rightAction && <Button onClick={props.onRightAction} icon={props.rightAction} />}
            </Box>
            <Box 
                background="light-1"
                flex>
                {props.tabs?.[selected]?.pane}
            </Box>
        </Paper>
    )
}

export const TabPane = styled(BaseTabPane)`

    .tab-pane__tab{
        margin-right: 6px;
    }

    .tab-pane__tab > div {
        margin-bottom: 0px;
        clip-path: polygon(10% 0, 90% 0, 100% 100%, 0 100%);
        border: none;
    }

    .tab-pane__tab > div > div {
        padding-left: 12px;
        padding-right: 12px;
    }
    .tab-pane__tab:not(.active){
        opacity: 0.55;
    }
`