import { off } from 'process';
import React, { createRef,  useEffect, useMemo, useReducer, useRef, useState } from 'react';
import styled from 'styled-components'
import { isEqual, throttle, update, xor } from 'lodash'
import { PortWidget } from './components/ports'
import { getHostForElement } from './utils';
import { InfiniteCanvasContext } from './context/context';
import { GridLayer } from './layers/grid';
import { NodeLayer } from './layers/nodes';
import { PathLayer } from './layers/paths';
import { ZoomControls } from './components/zoom-controls'

import { RetractingPort } from './components/ports/retracting'
import { BlockTray } from './components/block-tray'

import { v4 } from 'uuid';
import { AbstractWidgetFactory } from './models/abstract-widget-factory';

import { reducer } from './store';
import * as actions from './store/actions'
import { addPathSegment, getRelativeCanvasPos, linkPath, lockToGrid, moveNode, onDrag, updatePathSegment } from './utils/canvas';
import { InfiniteCanvasNode, InfiniteCanvasPath, InfiniteCanvasPosition, InfinitePort } from './types/canvas';
import { HMIPosition } from './assets/hmi-spec';
import { ContextMenu } from './components/context-menu/ContextMenu';

import * as Icons from 'grommet-icons'

export * from './types'

export * from './components/nodes'

export {
    AbstractWidgetFactory,
    ZoomControls,
    RetractingPort,
    BlockTray,
    PortWidget
}
export interface Block {
    label?: string;
    blockType?: string;
    content?: any;
    extras?: any;
}


export interface InfiniteCanvasProps {
    className?: string;

    editable?: boolean;

    onDrop?: (position: InfiniteCanvasPosition, data: any) => void;

    nodes?: InfiniteCanvasNode[],
    paths?: InfiniteCanvasPath[],

    onNodesChanged?: (nodes: InfiniteCanvasNode[]) => void;
    onPathsChanged?: (paths: InfiniteCanvasPath[]) => void;

    assets?: {
        [key: string]: JSX.Element
    }
    
    factories?: Array<AbstractWidgetFactory>;

    snapToGrid?: boolean;
    grid?: {width: number, height: number, divisions: number}

    offset?: {
        x: number
        y: number
    }

    contextMenu?: {
        label?: any;
        icon?: any;
        onClick?: () => void;
    }[]

    zoom?: number;

    onViewportChanged?: (viewport: {zoom: number, offset: {x: number, y: number}}) => void;
}

const initialState : any = {nodes: [], paths: []};

export const BaseInfiniteCanvas: React.FC<InfiniteCanvasProps> = ({
    zoom,
    onViewportChanged,
    offset,
    assets,
    factories,
    onNodesChanged,
    onPathsChanged,
    nodes,
    paths,
    onDrop,
    editable,
    className,
    snapToGrid = false,
    grid = {width: 100, height: 100, divisions: 3},
    children,
    contextMenu
}) => {

    const [ menuPos, setMenuPos ] = useState<{x?: number, y?: number}>()

    const canvasRef = useRef<HTMLDivElement>(null)

    const [ selected, setSelected ] = useState<{type?: 'node' | 'path', id?: string}>()

    const [ isPortDragging, setPortDragging ] = useState<boolean>(false)

    const [ _factories, setFactories ] = useState<any>({})
    
    const [ nodeRefs, setNodeRefs ] = useState<any>({})

    const [ _nodes, setNodes ] = useState<InfiniteCanvasNode[]>([])

    const _paths = useRef<InfiniteCanvasPath[]>([])

    const [_zoom, setZoom] = useState<number>(100)

    const [_offset, _setOffset] = useState<{ x: number, y: number }>({
        x: 0,
        y: 70 // REMOVE add as prop
    })

    const offsetRef = useRef(_offset)

    const setOffset = (offset: HMIPosition) => {
        offsetRef.current = offset;
        _setOffset(offset)
    }


    useEffect(() => {
        if(Object.keys(_factories).length > 0){
            setNodes(nodes?.map((node) => {
                let type = node.type;
                let f : AbstractWidgetFactory = _factories[type]
                console.log(type, f)
                return f.parseModel(node)
            }) as any)
        }
    }, [nodes, _factories])

    useEffect(() => {
     
        _paths.current = paths || [];
        
    }, [paths])
  

    useEffect(() => {
        if(zoom){
            setZoom(zoom)
        }
    }, [zoom])

    useEffect(() => {
        if(offset){
            console.log("Set")
         //   setOffset(offset)
        }
    }, [offset])

    useEffect(() => {
        if(factories){
            let f : any = {};
            factories.forEach((factory) => {
                f[factory.getType()] = factory
            })
            setFactories(f)
        }
    }, [factories])

    const updateOffset = (position: {x: number, y: number}, lastPos: {x: number, y: number}) => {
        let new_offset = {
            x: offsetRef.current.x - (lastPos.x - position.x),
            y: offsetRef.current.y - (lastPos.y - position.y)
        }
        setOffset(new_offset)
        onViewportChanged?.({offset: new_offset, zoom: _zoom})
    }

 

    const onMouseDown = (evt: React.MouseEvent) => {
        setMenuPos(undefined)
        if (evt.button == 0) {
            //Left
            onDrag(evt, (evt, position, lastPos, finished) => {
                if(!finished && position && lastPos){
                    updateOffset(position, lastPos)
                }
            })
        } else if (evt.button == 2) {
            //Right
        }
    }

    const onWheel = (evt: React.WheelEvent) => {
        let oldZoomFactor = _zoom / 100;

        let zoomY = evt.deltaY / 60;

        let zoomFactor = (_zoom + zoomY) / 100;
        
        let new_zoom = _zoom + zoomY;
        let new_offset = _offset || {x: 0, y: 0};

        setZoom(new_zoom)

        if(canvasRef.current){
            const bounds = canvasRef.current?.getBoundingClientRect()

            const clientWidth = bounds.width
            const clientHeight = bounds.height

            const widthDiff = clientWidth * zoomFactor - clientWidth * oldZoomFactor
            const heightDiff = clientHeight * zoomFactor - clientHeight * oldZoomFactor

            const clientX = evt.clientX - bounds?.left
            const clientY = evt.clientY - bounds?.top

            const xFactor = (clientX - _offset.x) / oldZoomFactor / clientWidth
            const yFactor = (clientY - _offset.y) / oldZoomFactor / clientHeight

            new_offset = {
                x: _offset.x + widthDiff * xFactor,
                y: _offset.y + heightDiff * yFactor
            }
            setOffset(new_offset)
        }

        onViewportChanged?.({offset: new_offset, zoom: _zoom})
    }

    const _moveNode = (node: string, position: InfiniteCanvasPosition) => {
        
        if(node) onSelect("node", node)

        let pos = getRelativeCanvasPos(canvasRef, {offset: _offset, zoom: _zoom}, position)
        pos = lockToGrid(pos, snapToGrid || false, grid)
        if(editable && pos){
            let nodes = moveNode(_nodes || [], node, pos)
            onNodesChanged?.(nodes)
        }
    }


    const dragPort = (e: React.MouseEvent, handleId?: string, nodeId?: string) => {

        let id = v4();
        setPortDragging(true)

        if(nodeId && handleId){
            let node = _nodes.find((a: any) => a.id == nodeId)
            let port = node?.ports?.find((a: InfinitePort) => a.name == handleId);

            let points: any = [];

            let path : any = {
                id,
                source: nodeId,
                sourceHandle: handleId,
                target: null,
                points: points
            }
        
            let p : any[] = _paths?.current?.slice() || [];
            p.push(path)

            onPathsChanged?.(p)


    const updatePathPosition = throttle((point: InfiniteCanvasPosition) => {
      
        let p = _paths?.current?.slice() || [];
        let ix = p.map((x: any) => x.id).indexOf(id)

            point = lockToGrid(point, snapToGrid || false, grid)
  
            let _points = [
                point
            ]
            if(ix > -1){
                console.log("Updating", id)
                p[ix] = {
                    ...p[ix],
                    points: _points
                }                    

            }else{
                console.log("creating", id)
                p.push({
                    id,
                    source: nodeId,
                    sourceHandle: handleId,
                    target: null,
                    points: _points
                } as any)
            }
            onPathsChanged?.(p)

    }, 100)

        onDrag(e, (event, position = {x: 0, y: 0}, lastPos, finished) => {
            if(!finished){
                let point = getRelativeCanvasPos(canvasRef, {offset: _offset, zoom: _zoom}, {x: position?.x, y: position?.y})
                updatePathPosition(point)
            }else{
                setPortDragging(false)
                console.log("LINKING", event?.target)
                let target = (event?.target as HTMLElement)
                if(target.hasAttribute('data-nodeid')){
                    let nodeId = target.getAttribute('data-nodeid') || ''
                    let handleId = target.getAttribute('data-handleid') || ''

                    onPathsChanged?.(linkPath(_paths.current, path.id, nodeId, handleId))
                }
            }
        })

        }
    }

    const reportPortPosition = (opts: {
        nodeId: string, 
        handleId: string, 
        position: {x: number, y: number, width: number, height: number}
    }) => {

        let point = getRelativeCanvasPos(canvasRef, {offset: _offset, zoom: _zoom}, opts.position)

        let nodes : any[] = _nodes?.slice() || [];

        let node = _nodes?.find((a) => a.id == opts.nodeId) || {x: 0, y: 0, ports: []}
        let node_ix = (_nodes?.map((x) => x.id) || []).indexOf(opts.nodeId)
        let ports = node?.ports?.slice();

        let port_ix = ports?.map((x: any) => x.name).indexOf(opts.handleId) 
        

        if(port_ix != undefined && port_ix > -1 && ports){

            ports[port_ix] = {
                ...(ports?.[port_ix] || {}),
                position: {
                    x: point.x - node.x,
                    y: point.y - node.y,
                    width: opts.position.width,
                    height: opts.position.height
                },
                bounds: {
                    ...opts.position
                }
            } as any

        }

        nodes[node_ix].ports = ports;
        onNodesChanged?.(nodes)
    }

    const onDragOver = (e: React.DragEvent) => {
        if(onDrop){
            e.preventDefault()
        }
    }

    const onSelect = (key: "node" | "path", id: string) => {
        setSelected({type: key, id: id})
    }

    const _onDrop = (e: React.DragEvent) => {
        if(onDrop){
            let data = JSON.parse(e.dataTransfer.getData('infinite-canvas'))
            let pos = getRelativeCanvasPos(canvasRef, {offset: _offset, zoom: _zoom}, {x: e.clientX, y: e.clientY})
            onDrop(pos, data)
        }
    }

    const onContextMenu = (e : React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()

        
    }

    const openContextMenu = (pos: {x: number, y: number}, payload: {type: "node" | "path", id: string}) => {
        let bounds = canvasRef.current?.getBoundingClientRect()

        onSelect(payload.type, payload.id)

        setMenuPos({
            x: pos.x - (bounds?.x || 0),
            y: pos.y - (bounds?.y || 0)
        })
    }

    return (
        <InfiniteCanvasContext.Provider
            value={{
                snapToGrid: snapToGrid,
                grid: {
                    ...grid
                },
                editable: editable,
                
                factories: _factories,
                nodes: _nodes,
                paths: _paths.current,
                assets: assets,
                nodeRefs,

                darkMode: true,
                zoom: 100 / _zoom,
                offset: _offset,
                isPortDragging,
                openContextMenu: openContextMenu,
                addPathPoint: (id, ix, point) => {
                    let rp = getRelativeCanvasPos(canvasRef, {offset: _offset, zoom: _zoom}, point)
                    onPathsChanged?.(addPathSegment(_paths.current.slice(), id, ix, rp))
                },
                updatePathPoint: (id, ix, point) => {
                    let rp = getRelativeCanvasPos(canvasRef, {offset: _offset, zoom: _zoom}, point)
                    rp = lockToGrid(rp, snapToGrid, grid)
                    onPathsChanged?.(updatePathSegment(_paths.current.slice(), id, ix, rp))
                },
                linkPath: (id, node, handle) => {
                    onPathsChanged?.(linkPath(_paths.current.slice(), id, node, handle))
                },
                setNodeRefs,
                dragPort: dragPort,
                moveNode: throttle((node, pos) => _moveNode(node, pos), 100),
                reportPosition: reportPortPosition,

                selected,
                selectNode: (node) => onSelect('node', node),
                selectPath: (path) => onSelect('path', path),
                changeZoom: (z) => setZoom(_zoom + (z))
            }}>
            <div
                onContextMenu={onContextMenu}
                ref={canvasRef}
                onMouseDown={onMouseDown}
                onWheel={onWheel}
                onDragOver={onDragOver}
                onDrop={_onDrop}
                className={className}
            >
                {(contextMenu || []).length > 0 && <ContextMenu 
                    menu={contextMenu || []}
                    open={Boolean(menuPos != undefined)} 
                    y={menuPos?.y} 
                    x={menuPos?.x}/>}
                <GridLayer />
                <PathLayer />
                <NodeLayer />
                {children}
            </div>
        </InfiniteCanvasContext.Provider>
    )
}

export const InfiniteCanvas = styled(BaseInfiniteCanvas)`
    display: flex;
    flex: 1;
    position: relative;
    overflow: hidden;
    user-select: none;
`