import React from 'react';
import { Box, Grid } from 'grommet';
import { Add } from 'grommet-icons'
import { add } from 'lodash';

export interface GridListProps {
    items?: any[];
    onClick?: (item: any) => void;
    addItem?: () => void;
    renderItem?: (item: any) => JSX.Element;
}

export const GridList : React.FC<GridListProps> = ({
    addItem = null,
    items = [],
    onClick,
    renderItem
}) => {
console.log(addItem)
return (<Box>
<Grid
    gap="small"
    rows={"small"}
    columns={{
        count: 6,
        size: 'auto'
    }}>
        {addItem != null && (
        <Box
            onClick={addItem}
            background="light-2"
            style={{cursor: 'pointer'}}
            round="xsmall"
            border={{
                color: 'border',

                style: 'dashed'
            }}
            justify="center"
            align="center">
            <Add />
        </Box>)}
        {items.map((item) => (
            <Box
                onClick={() => onClick?.(item)}
                round="xsmall"
                background="brand">
                {renderItem?.(item)}
            </Box>
        ))}
</Grid>

</Box>
)}
