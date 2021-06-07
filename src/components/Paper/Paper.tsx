import React from 'react';
import { Box } from 'grommet'

export const Paper = (props : any) => {
    return (
        <Box
            flex
            background="light-2"
            round="small"
            {...props}
            >
            {props.children}
        </Box>
    )
}