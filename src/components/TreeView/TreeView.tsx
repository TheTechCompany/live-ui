import { Box, Button, Text, Collapsible } from "grommet"
import * as Icons from 'grommet-icons'
import { useEffect, useState } from "react"
export interface TreeViewItem {
    id: string;
    label?: string;
    items?: TreeViewItem[]
}

export interface TreeViewProps {
    items?: TreeViewItem[]
    
    selected?: string;
    expanded?: string[]

    onExpansion?: (expanded: string[]) => void;
}

export const TreeView : React.FC<TreeViewProps> = (props) => {

    const [ expanded, setExpanded ] = useState<string[]>([])

    const [ selected, setSelected ] = useState<string>()

    useEffect(() => {
        if(props.expanded){
            setExpanded(props.expanded)
        }
    }, [props.expanded])

    useEffect(() => {
        if(props.selected){
            setSelected(props.selected)
        }
    }, [props.selected])

    const toggleSelection = (id?: string) => {
        if(id){
            let s = expanded.slice();
            let ix = s.indexOf(id)
            if(ix > -1){
                s.splice(ix, 1)
            }else{
                s.push(id)
            }

            setExpanded(s)

            props.onExpansion?.(s)
        } 
    }

    const isSelected = (id: string) => {
        return expanded.indexOf(id) > -1;
    }

    const renderSubTree = (tree: TreeViewItem) => {
        return (
            <Box 
                direction="column">
                <Box direction="row" align="center">
                    {tree.items && tree.items.length > 0 ? (
                       <Button
                            style={{padding: 4}}
                            size="small"
                            onClick={() => toggleSelection(tree.id)}
                            icon={isSelected(tree.id) ? <Icons.Down size='small' /> : <Icons.Next size='small' />} />
                    ) : <Box width="20px" />} 
                    <Box style={{cursor: 'pointer'}}>
                        <Text>
                            {tree.label}
                        </Text>
                    </Box>
                </Box>
                <Collapsible
                    direction="vertical"
                    open={isSelected(tree.id)}>
                    <Box
                        pad={{left: '20px'}}
                        direction="column">
                        {tree.items && tree.items.length > 0 && tree.items.map((item) => renderSubTree(item))}
                    </Box>
                </Collapsible>
            </Box>
        )
    }

    return (
        <Box>
            {props.items?.map((item) => renderSubTree(item))}
        </Box>
    )
}