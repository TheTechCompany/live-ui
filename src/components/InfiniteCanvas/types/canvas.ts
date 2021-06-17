

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