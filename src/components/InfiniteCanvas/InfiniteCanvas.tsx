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
import { moveNode } from './utils/canvas';

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


export interface InfiniteCanvasPosition {
    x: number;
    y: number;
}

export interface InfiniteCanvasNode {
    id: string;
    type: string;
    direction?: string;
    asset?: string;
    x: number;
    y: number;
    ports?: InfinitePort[];
    label?: string;
    width?: number;
    height?: number;
    value?: string;
    sub_components?: {
        [key: string]: InfiniteCanvasNode
    }
}

export interface InfinitePort {
    name?: string;
    type?: string;

    position?: {
        x?: number;
        y?: number;
    }

    bounds?: {
        x?: number;
        y?: number;
    }
}

export interface InfiniteCanvasPath {
    id: string;
    source: string;
    sourceHandle?: string;
    target: string;
    targetHandle?: string;
    points: InfiniteCanvasPosition[]
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
    grid?: {width: number, height: number}

    offset?: {
        x: number
        y: number
    }

    zoom?: number;

    onViewportChanged?: (viewport: {zoom: number, offset: {x: number, y: number}}) => void;
}

const initialState : any = {nodes: [], paths: []};

export const BaseInfiniteCanvas: React.FC<InfiniteCanvasProps> = (props) => {

    const [ isPortDragging, setPortDragging ] = useState<boolean>(false)

    const [ factories, setFactories ] = useState<any>({})
    
    const [ nodeRefs, setNodeRefs ] = useState<any>({})

    const [ _nodes, setNodes ] = useState<InfiniteCanvasNode[]>([])

    const _paths = useRef<InfiniteCanvasPath[]>([])

    const [zoom, setZoom] = useState<number>(100)

    const [offset, setOffset] = useState<{ x: number, y: number }>({
        x: 0,
        y: 70 // REMOVE add as prop
    })


    useEffect(() => {
        if(Object.keys(factories).length > 0){
            setNodes(props.nodes?.map((node) => {
                let type = node.type;
                let f : AbstractWidgetFactory = factories[type]
                return f.parseModel(node)
            }) as any)
        }
    }, [props.nodes, factories])

    useEffect(() => {
        if(props.paths){
            console.log(props.paths)
            _paths.current = props.paths;
            //setPaths(props.paths)
        }
    }, [props.paths])
  

    useEffect(() => {
        if(props.zoom != undefined){
            setZoom(props.zoom)
        }
    }, [props.zoom])

    useEffect(() => {
        if(props.offset != undefined){
            setOffset(props.offset)
        }
    }, [props.offset])


    useEffect(() => {
        if(props.factories){
            let f : any = {};
            props.factories.forEach((factory) => {
                f[factory.getType()] = factory
            })

            setFactories(f)
        }
    }, [props.factories])

    const canvasRef = useRef<HTMLDivElement>(null)

    const onLeftClick = (evt: React.MouseEvent) => {
        let lastPos = {
            x: evt.clientX,
            y: evt.clientY
        }
    

        let doc = getHostForElement(evt.target as HTMLElement)

        const updateOffset = throttle((x: number, y: number) => {
            let _offset = {
                x: offset.x - (lastPos.x - x),
                y: offset.y - (lastPos.y - y)
            }
            setOffset(_offset)
            props.onViewportChanged?.({offset: _offset, zoom})
    
        }, 100)

        const onMouseMove = (evt: MouseEvent) => {
            updateOffset(evt.clientX, evt.clientY)

        }

        const onMouseUp = (evt: MouseEvent) => {
            doc.removeEventListener('mousemove', onMouseMove as EventListenerOrEventListenerObject)
            doc.removeEventListener('mouseup', onMouseUp as EventListenerOrEventListenerObject)

        }
        doc.addEventListener('mousemove', onMouseMove as EventListenerOrEventListenerObject)
        doc.addEventListener('mouseup', onMouseUp as EventListenerOrEventListenerObject)
    }

    const onMouseDown = (evt: React.MouseEvent) => {
        if (evt.button == 0) {
            //Left
            onLeftClick(evt)
        } else if (evt.button == 2) {
            //Right
        }
    }

    const onWheel = (evt: React.WheelEvent) => {
        let oldZoomFactor = zoom / 100;

        let zoomY = evt.deltaY / 60;

        let zoomFactor = (zoom + zoomY) / 100;
        
        let _zoom = zoom + zoomY;
        let _offset = offset;

        setZoom(_zoom)

        if(canvasRef.current){
            const bounds = canvasRef.current?.getBoundingClientRect()

            const clientWidth = bounds.width
            const clientHeight = bounds.height

            const widthDiff = clientWidth * zoomFactor - clientWidth * oldZoomFactor
            const heightDiff = clientHeight * zoomFactor - clientHeight * oldZoomFactor

            const clientX = evt.clientX - bounds?.left
            const clientY = evt.clientY - bounds?.top

            const xFactor = (clientX - offset.x) / oldZoomFactor / clientWidth
            const yFactor = (clientY - offset.y) / oldZoomFactor / clientHeight

            _offset = {
                x: offset.x + widthDiff * xFactor,
                y: offset.y + heightDiff * yFactor
            }
            setOffset(_offset)
        }

        props.onViewportChanged?.({offset: _offset, zoom: _zoom})
    }

    const _moveNode = (node: string, position: InfiniteCanvasPosition) => {
   
        let pos = getRelativeCanvasPos(position.x, position.y)

        pos = makeSnappy(pos)


        if(props.editable && pos){
          
            let nodes = moveNode(_nodes || [], node, pos)
            props.onNodesChanged?.(nodes)

        }
    }


    const getRelativePos = (x: number, y: number) => {
        let box = canvasRef.current?.getBoundingClientRect()
        return {
            x: x - (box ? box.x : 0),
            y: y - (box ? box.y : 0) 
        }
    }

    const getRelativeCanvasPos = (x: number, y: number) => {
        if(canvasRef.current){
            let position = getRelativePos(x, y)

            let scale = 100 / zoom

            return {
                x: (position.x - offset.x) / scale,
                y: (position.y - offset.y) / scale 
            }
        }else{
            return {
                x: 0,
                y: 0
            }
        }
    }

    const dragPort = (e: React.MouseEvent, handleId?: string, nodeId?: string) => {
        e.stopPropagation()
        console.log(handleId, nodeId)
        let id = v4();
        let p = Object.assign({}, _paths)


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
       
     //   p[id] = path;

        let p : any[] = _paths?.current?.slice() || [];
        p.push(path)

        props.onPathsChanged?.(p)

       // dispatch({type: actions.ADD_PATH, data: {path}})
        let doc = getHostForElement(e.target as HTMLElement)

        const updatePathPosition = throttle((point: InfiniteCanvasPosition) => {
      
                let p = _paths?.current?.slice() || [];
                let ix = p.map((x: any) => x.id).indexOf(id)

                point = makeSnappy(point)
      

                let _points = [
                    point
                ]
                if(ix > -1){

                    p[ix] = {
                        ...p[ix],
                        points: _points
                    }                    

                }else{
                    p.push({
                        id,
                        source: nodeId,
                        sourceHandle: handleId,
                        target: null,
                        points: _points
                    } as any)
                }
                props.onPathsChanged?.(p)


        }, 100)

        const mouseMove = (e: MouseEvent) => {
            let point = getRelativeCanvasPos(e.clientX, e.clientY)
            updatePathPosition(point)
        }

        const mouseUp = (e: MouseEvent) => {
            setPortDragging(false)

            let target = (e.target as HTMLElement)
            if(target.hasAttribute('data-nodeid')){
                let nodeId = target.getAttribute('data-nodeid') || ''
                let handleId = target.getAttribute('data-handleid') || ''

                let node = _nodes.find((a : any) => a.id == nodeId)
                console.log(_paths.current)


                linkPath(path.id, nodeId, handleId)

            }
            doc.removeEventListener('mousemove', mouseMove as EventListenerOrEventListenerObject)
            doc.removeEventListener('mouseup', mouseUp as EventListenerOrEventListenerObject)
        }

        doc.addEventListener('mousemove', mouseMove as EventListenerOrEventListenerObject)
        doc.addEventListener('mouseup', mouseUp as EventListenerOrEventListenerObject)

        }
    }

    const reportPortPosition = (opts: {
        nodeId: string, 
        handleId: string, 
        position: {x: number, y: number, width: number, height: number}
    }) => {

        let point = getRelativeCanvasPos(opts.position.x, opts.position.y)

        let nodes : any[] = _nodes?.slice() || [];

        let node = _nodes?.find((a) => a.id == opts.nodeId) || {x: 0, y: 0, ports: []}
        let node_ix = (_nodes?.map((x) => x.id) || []).indexOf(opts.nodeId)
        let ports = node?.ports;

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
        props.onNodesChanged?.(nodes)
    }

    const onDragOver = (e: React.DragEvent) => {
        if(props.onDrop){
            e.preventDefault()
        }
    }

    const addPathPoint = (path_id: string, segment_ix: number, point: InfiniteCanvasPosition) => {
        let relative_point = getRelativeCanvasPos(point.x, point.y)

        let p = _paths.current?.slice()
        let path_ix = p.map((x) => x.id).indexOf(path_id)

        console.log(segment_ix)
     

            if(!p[path_ix].target || segment_ix == 0){
                p[path_ix].points = [relative_point, ...p[path_ix].points]
            }else{
                p[path_ix].points.splice(segment_ix, 0, relative_point)
            }
        

        props.onPathsChanged?.(p)

    //    dispatch({type: actions.ADD_PATH_POINT, data: {id: path_id, segment_ix: ix, point: relative_point}})
    }

    const makeSnappy = (point: InfiniteCanvasPosition) => {
        if(props.snapToGrid){
            let widthMultiplier = (props.grid?.width || 0) / 10
            let heightMultiplier = (props.grid?.height || 0) / 10

            point.x = Math.floor(point.x / widthMultiplier) * widthMultiplier
            point.y = Math.floor(point.y / heightMultiplier) * heightMultiplier
        }

        return point;
    }

    const updatePathPoint = (path_id: string, ix: number, point: InfiniteCanvasPosition) => {
        let relative = getRelativeCanvasPos(point.x, point.y)

        relative = makeSnappy(relative)

        let p = _paths.current?.slice();
        let path_ix = p.map((x) => x.id).indexOf(path_id)
        p[path_ix].points[ix] = relative;
        
        props.onPathsChanged?.(p)
     //   dispatch({type: actions.UPDATE_PATH_POINT, data: {id: path_id, ix: ix, point: relative}})
    }

    const linkPath = (path_id: string, nodeId: string, handleId: string) => {
    //    dispatch({type: actions.LINK_PATH, data: {path: path_id, node: nodeId, handle: handleId}})
        
        let p = _paths.current?.slice();
        let path_ix = p.map((x) => x.id).indexOf(path_id)

        console.log("LINK PATH", _paths, path_ix, nodeId, handleId)

        if(path_ix > -1){
            p[path_ix].points.splice(p[path_ix].points.length -1, 1) //TODO make safe for relinking
            p[path_ix].target = nodeId;
            p[path_ix].targetHandle = handleId;
        }


        props.onPathsChanged?.(p)

    }

    const onDrop = (e: React.DragEvent) => {
        if(props.onDrop){
            let data = JSON.parse(e.dataTransfer.getData('infinite-canvas'))
            let pos = getRelativeCanvasPos(e.clientX, e.clientY)
            props.onDrop(pos, data)
        }
    }

    return (
        <InfiniteCanvasContext.Provider
            value={{
                snapToGrid: props.snapToGrid,
                grid: props.grid,
                editable: props.editable,
                
                factories: factories,
                nodes: _nodes,
                paths: _paths.current,
                assets: props.assets,
                nodeRefs,

                darkMode: true,
                zoom: 100 / zoom,
                offset: offset,
                isPortDragging,
                addPathPoint: addPathPoint,
                updatePathPoint,
                linkPath,
                setNodeRefs,
                dragPort: dragPort,
                moveNode: throttle((node, pos) => _moveNode(node, pos), 100),
                reportPosition: reportPortPosition,
                selectNode: () => console.log("SELECT"),
                changeZoom: (z) => setZoom(zoom + (z))
            }}>
            <div
                ref={canvasRef}
                onMouseDown={onMouseDown}
                onWheel={onWheel}
                onDragOver={onDragOver}
                onDrop={onDrop}
                className={props.className}
            >
                <GridLayer />
                <PathLayer />
                <NodeLayer />
                {props.children}
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