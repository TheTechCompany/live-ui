import { off } from 'process';
import React, { createRef, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import styled from 'styled-components'
import { isEqual, throttle, update } from 'lodash'
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
    x?: number;
    y?: number;
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
}

const initialState : any = {nodes: [], paths: []};

export const BaseInfiniteCanvas: React.FC<InfiniteCanvasProps> = (props) => {

    const [ isPortDragging, setPortDragging ] = useState<boolean>(false)

    const [ factories, setFactories ] = useState<any>({})
    
    const [ ports, setPorts ] = useState<any>({})

    const [ nodeRefs, setNodeRefs ] = useState<any>({})

    const [ {nodes, paths}, dispatch ] = useReducer(reducer, initialState)


    useEffect(() => {
        if(!isEqual(paths, props.paths)){
            props.onPathsChanged?.(paths)
        }
    }, [paths])

    useEffect(() => {
        if(props.paths){

            dispatch({type: actions.SET_PATHS, data: {paths: props.paths}})
            
        }
    }, [props.paths])
    
    useEffect(() => {
        if(props.nodes){
            dispatch({type: actions.SET_NODES, data: {nodes: props.nodes}})
        }
    }, [props.nodes])

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

    const canvasBounds = useMemo(() => {
        return canvasRef.current?.getBoundingClientRect()
    }, [canvasRef])

    const [lastPosition, setLastPosition] = useState<{ x: number, y: number }>({
        x: 0,
        y: 0
    })

    const [zoom, setZoom] = useState<number>(100)
    const [offset, setOffset] = useState<{ x: number, y: number }>({
        x: 0,
        y: 70 // REMOVE add as prop
    })





    const onLeftClick = (evt: React.MouseEvent) => {
        let lastPos = {
            x: evt.clientX,
            y: evt.clientY
        }
        setLastPosition({
            x: evt.clientX,
            y: evt.clientY
        })

        let doc = getHostForElement(evt.target as HTMLElement)

        const updateOffset = throttle((x: number, y: number) => {
            setOffset({
                x: offset.x - (lastPos.x - x),
                y: offset.y - (lastPos.y - y)
            })
            setLastPosition({
                x: x,
                y: y
            })
        }, 100)

        const onMouseMove = (evt: MouseEvent) => {
            console.log(evt.clientX, evt.clientY, lastPosition, offset)
            updateOffset(evt.clientX, evt.clientY)

        }

        const onMouseUp = (evt: MouseEvent) => {
            doc.removeEventListener('mousemove', onMouseMove as EventListenerOrEventListenerObject)
            doc.removeEventListener('mouseup', onMouseUp as EventListenerOrEventListenerObject)

            console.log(evt.clientX, evt.clientY, offset)
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
        console.log(evt.clientX, evt.clientY)
        let oldZoomFactor = zoom / 100;

        let zoomY = evt.deltaY / 60;

        let zoomFactor = (zoom + zoomY) / 100;
        
        setZoom(zoom + zoomY)

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
            console.log(offset, widthDiff, heightDiff, xFactor, yFactor)
            setOffset({
                x: offset.x + widthDiff * xFactor,
                y: offset.y + heightDiff * yFactor
            })
        }
    }

    const _moveNode = (node: string, position: InfiniteCanvasPosition) => {
   
        console.log(position, canvasRef, canvasBounds)
        let pos = getRelativeCanvasPos(position.x, position.y)

        if(props.editable && pos){
          
            console.log(pos)
            let nodes = moveNode(props.nodes || [], node, pos)
            props.onNodesChanged?.(nodes)

         /* dispatch({type: actions.MOVE_NODE, data: {
                id: node,
                d: {
                    x: pos.x,
                    y: pos.y
                }
            }})*/

      //      dispatch({type: actions.SET_NODES, data: {nodes: n}})
            
        }
        console.log(node, getRelativeCanvasPos(position.x, position.y))
    }


    const getRelativePos = (x: number, y: number) => {
        let box = canvasRef.current?.getBoundingClientRect()
        return {
            x: x - (box ? box.x : 0),
            y: y - (box ? box.y : 0) 
        }
    }

    const getRelativeCanvasPos = (x: number, y: number) => {
      //  console.log(canvasRef.current)
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
        let p = Object.assign({}, paths)


        setPortDragging(true)

        if(nodeId && handleId){
            let node = nodes.find((a: any) => a.id == nodeId)
            console.log(node)
            let port = node.ports[handleId];
          // let startPoint = node.ports[handleId].bounds;
         
        //    console.log(startPoint)
            //     let startPoint = (ports[nodeId][handleId].ref.current as HTMLDivElement).getBoundingClientRect()


            
        //let point = getRelativeCanvasPos(startPoint.x, startPoint.y)
        let points = [{
            x: node.x + port.position.x,
            y: node.y + port.position.y
        }];

        let path : any = {
            id,
            source: nodeId,
            sourceHandle: handleId,
            target: null,
            points: points
        }
       
     //   p[id] = path;

        dispatch({type: actions.ADD_PATH, data: {path}})
        let doc = getHostForElement(e.target as HTMLElement)

        const updatePathPosition = throttle((point: InfiniteCanvasPosition) => {
      
                dispatch({type: actions.UPDATE_PATH, data: {
                    id: path.id,
                    d: {
                        points: [
                            path.points[0],
                            point
                        ]
                    }
                }})   
             

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

                let node = nodes.find((a : any) => a.id == nodeId)
                let port = node.ports[handleId];

                let point = {
                    x: node.x + port.position.x,
                    y: node.y + port.position.y
                };
                updatePathPosition(point)
                //path.target = nodeId

                dispatch({type: actions.UPDATE_PATH, data:{
                    id: path.id,
                    d: {
                        target: nodeId,
                        targetHandle: handleId
                    }
                }})

            }
            console.log("UP", e)
            doc.removeEventListener('mousemove', mouseMove as EventListenerOrEventListenerObject)
            doc.removeEventListener('mouseup', mouseUp as EventListenerOrEventListenerObject)
        }

        doc.addEventListener('mousemove', mouseMove as EventListenerOrEventListenerObject)
        doc.addEventListener('mouseup', mouseUp as EventListenerOrEventListenerObject)

        console.log(e.clientX, e.clientY)
        }
    }

    const reportPortPosition = (opts: {nodeId: string, handleId: string, position: {x: number, y: number, width: number, height: number}}) => {
        let point = getRelativeCanvasPos(opts.position.x, opts.position.y)
        dispatch({type: actions.REPORT_PORT_POSITION, data: {
            nodeId: opts.nodeId,
            handleId: opts.handleId,
            position: {
                ...point,
                width: opts.position.width,
                height: opts.position.height
            }
        }})
    }

    const onDragOver = (e: React.DragEvent) => {
        if(props.onDrop){
            e.preventDefault()
        }
    }

    const addPathPoint = (path_id: string, ix: number, point: InfiniteCanvasPosition) => {
        let relative_point = getRelativeCanvasPos(point.x, point.y)

        dispatch({type: actions.ADD_PATH_POINT, data: {id: path_id, segment_ix: ix, point: relative_point}})
    }

    const updatePathPoint = (path_id: string, ix: number, point: InfiniteCanvasPosition) => {
        let relative = getRelativeCanvasPos(point.x, point.y)
        dispatch({type: actions.UPDATE_PATH_POINT, data: {id: path_id, ix: ix, point: relative}})
    }

    const linkPath = (path_id: string, nodeId: string, handleId: string) => {
        dispatch({type: actions.LINK_PATH, data: {path: path_id, node: nodeId, handle: handleId}})
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
                editable: props.editable,
                factories: factories,
                nodes: props.nodes,
                paths: paths,
                assets: props.assets,
                nodeRefs,

                darkMode: true,
                zoom: 100 / zoom,
                offset: offset,

                ports,
                setPorts,
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