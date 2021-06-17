import { Box, Button, Text, Collapsible } from "grommet"
import * as Icons from 'grommet-icons'
import { useEffect, useState } from "react"
import styled from 'styled-components'

export interface TreeViewItem {
    id: string;
    label?: string;
    items?: TreeViewItem[]
}

export interface TreeViewProps {
    items?: TreeViewItem[]
    
    selected?: string;
    expanded?: string[]

    onCreate?: (tree_selector?: string) => void;
    onSelect?: (tree_selector: string) => void;
    onExpansion?: (expanded: string[]) => void;

    className?: string;
}

export const BaseTreeView : React.FC<TreeViewProps> = (props) => {

    console.log(props.onCreate)

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

    const toggleExpansion = (id?: string) => {
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

    const toggleSelect = (id: string) => {
        props.onSelect?.(id)
        setSelected(id)
    }

    const isSelected = (id: string) => {
        return expanded.indexOf(id) > -1;
    }

    const renderSubTree = (tree: TreeViewItem, base: string[] = []) => {
        return (
            <Box 
                direction="column">
                <Box   
                    flex
                    pad={{vertical: 'small'}}
                    className="tree-item__row"
                    direction="row"
                    justify="between" 
                    align="center">
                    {tree.items && tree.items.length > 0 ? (
                       <Button
                            style={{padding: 4}}
                            size="small"
                            onClick={() => toggleExpansion(tree.id)}
                            icon={isSelected(tree.id) ? <Icons.Down size='small' /> : <Icons.Next size='small' />} />
                    ) : <Box width="20px" />} 
                    <Box 
                        background={base.join('.') == selected ? 'light-4' : 'none'}
                        onClick={() => toggleSelect(base.join('.'))}
                        flex
                        style={{cursor: 'pointer'}}>
                        <Text>
                            {tree.label}
                        </Text>
                    </Box>
                    {props.onCreate != undefined && 
                        <Button 
                            onClick={() => props.onCreate?.(base.join('.'))}
                            hoverIndicator
                            style={{marginLeft: 8, padding: 6}}
                            className="add-item" 
                            icon={<Icons.Add size="small"/>} />}
                </Box>
                <Collapsible
                    direction="vertical"
                    open={isSelected(tree.id)}>
                    <Box
                        pad={{left: '20px'}}
                        direction="column">
                        {tree.items && tree.items.length > 0 && tree.items.map((item) => renderSubTree(item, [...base, item.id]))}
                    </Box>
                </Collapsible>
            </Box>
        )
    }

    return (
        <Box 
            flex
            className={props.className}>
            {props.items?.map((item) => renderSubTree(item, [item.id]))}
            {props.onCreate && 
                <Button 
                    onClick={() => props.onCreate?.()}
                    label="Add" />}
        </Box>
    )
}

export const TreeView = styled(BaseTreeView)`
    .tree-item__row button.add-item{
        opacity: 0;
    }
    .tree-item__row:hover button.add-item{
        opacity: 1;
    }
`