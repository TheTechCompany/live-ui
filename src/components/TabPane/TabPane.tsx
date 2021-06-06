import React from 'react';
import { Box, Tabs, Tab } from 'grommet'

export interface TabItem {
    label?: string;
    pane?: any;
}

export interface TabPaneProps {
    tabs?: TabItem[]
}

export const TabPane : React.FC<TabPaneProps> = (props) => {
    return (
        <Box 
            round="small"
            flex
            elevation="small">
            <Tabs 
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
        </Box>
    )
}