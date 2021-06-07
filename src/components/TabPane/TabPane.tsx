import React, { useEffect, useState } from 'react';
import { Box, Tabs, Tab } from 'grommet'

export interface TabItem {
    label?: string;
    pane?: any;
}

export interface TabPaneProps {
    tabs?: TabItem[]

    selected?: number;
    onChange?:( ix: number ) => void;
}

export const TabPane : React.FC<TabPaneProps> = (props) => {
    const [ selected, setSelected ] = useState<number>(-1);
    
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
        <Box 
            round="small"
            flex
            elevation="small">
            <Tabs 
                onActive={(ix) => onChange(ix)}
                alignControls="start">
                {props.tabs?.map((tab) => (
                    <Tab
                        title={(
                        <Box
                            margin={{right: 'small'}}
                            pad="small"
                            background="brand"
                            round={{corner: 'top', size: 'small'}}
                            >
                            {tab.label}
                        </Box>)}>
                    </Tab>
                ))}
            </Tabs>
            {props.tabs?.[selected]?.pane}
        </Box>
    )
}