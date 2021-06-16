import React from 'react';
import { InfiniteCanvasNode, InfiniteCanvasPath, InfiniteCanvasPosition } from '../InfiniteCanvas';
import { HMIPosition } from '../assets/hmi-spec';
import { AbstractWidgetFactory } from '../models/abstract-widget-factory';

export interface IInfiniteCanvasContext {
    snapToGrid?: boolean;
    grid?: {width: number, height: number};
    
    editable?: boolean;
    nodes?: InfiniteCanvasNode[]

    paths?: InfiniteCanvasPath[]

    assets?: {
        [key: string]: JSX.Element
    }

    factories?: {
        [type: string]: AbstractWidgetFactory
    }

    isPortDragging?: boolean

    offset: HMIPosition,
    zoom: number
    darkMode?: boolean;

    nodeRefs?: {[key: string]: any}
    ports?: {[key: string]: any}
    setPorts?: (ports: {[key: string]: any}) => void;
    setNodeRefs?: (nodeRefs: {[key: string]: any}) => void;
    dragPort?: (e: React.MouseEvent, handleId?: string, nodeId?: string) => void;
    reportPosition?: (opts: {nodeId: string, handleId: string, position: {x: number, y: number, width: number, height: number}}) => void;

    linkPath?: (path_id: string, nodeId: string, handleId: string) => void;
    addPathPoint?: (path_id: string, ix: number, point: InfiniteCanvasPosition) => void;
    updatePathPoint?: (path_id: string, ix: number, point: InfiniteCanvasPosition) => void;

    selectNode?: (node: string) => void;
    moveNode?: (node: string, position: InfiniteCanvasPosition) => void;
    changeZoom?: (zoom: number) => void;

    io_status?: {
        [key: string]: string
    } 
    plant_status?: {
        [key: string]: string
    }
}

export const InfiniteCanvasContext = React.createContext<IInfiniteCanvasContext>({
    offset: {
        x: 0,
        y: 0
    },
    darkMode: true,
    zoom: 1,
    io_status: {},
    plant_status: {}
})