import React from 'react';
import { Box, Grid } from 'grommet';
import { Add } from 'grommet-icons'

export interface GridListProps {
    items?: any[];
    onClick?: (item: any) => void;
    renderItem?: (item: any) => JSX.Element;
}

export const GridList : React.FC<GridListProps> = (props) => {

return (<Box>
<Grid
    gap="small"
    rows={"small"}
    columns={{
        count: 6,
        size: 'auto'
    }}>
        <Box
            style={{cursor: 'pointer'}}
            round="xsmall"
            border={{
                color: 'border',

                style: 'dashed'
            }}
            justify="center"
            align="center">
            <Add />
        </Box>
        {props.items?.map((item) => (
            <Box
                onClick={() => props.onClick?.(item)}
                round="xsmall"
                background="brand">
                {props.renderItem?.(item)}
            </Box>
        ))}
</Grid>

</Box>
)}
