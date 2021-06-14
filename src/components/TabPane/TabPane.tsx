import React, { useEffect, useState } from 'react';
import { Box, Button, Tabs, Tab } from 'grommet'
import { Paper } from '../Paper';

export interface TabItem {
    label?: string;
    pane?: any;

}

export interface TabPaneProps {
    tabs?: TabItem[]

    selected?: number;
    onChange?:( ix: number ) => void;
    rightAction?: any;
    onRightAction?: any;
}

export const TabPane : React.FC<TabPaneProps> = (props) => {
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
        <Paper >
            <Box
                direction="row"
                justify="between">
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