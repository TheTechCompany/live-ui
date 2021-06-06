import React, { useContext, useMemo } from 'react';
import styled from 'styled-components'
import { bfs_search, createLine, getHostForElement } from '../utils';
import { HMILink } from '../assets/hmi-spec';
import { InfiniteCanvasContext } from '../context/context';
import { InfiniteCanvasPosition } from '../InfiniteCanvas';
import { FlowPath } from '../defaults/path';

export interface PathLayerProps {
}


export const PathLayer : React.FC<PathLayerProps> = (props) => {
    const context = useContext(InfiniteCanvasContext)

    const zoom = context.zoom;
    const offset = context.offset
    
    const paths = useMemo(() => {
        return (context.paths || []).map((x) => {
            return {
                ...x,
                id: x.id
            }
        })
    }, [context.paths])


    const runs = [
        {
            source: "TK101",
            target: "TK201",
            producer: "SC101"
        },
        {
            source: "TK201",
            target: "TK301",
            producer: "SC201"
        },
        {
            source: "TK301",
            target: "Clean Water",
            producer: "SC301"
        },
        {
            source: "BLO701",
            target: "TK201",
            producer: "BLO701"
        },
        {
            source: "TK301",
            target: "TK301",
            producer: "SC301"
        },
        {
            source: "TK301",
            target: "Drain",
            producer: "SC301"
        },
        {
            source: "TK601",
            target: "SC301",
            producer: "PMD601"
        },
        {
            source: "TK501",
            target: "TK201",
            producer: "PMD501"
        }
    ]

    const pipe_runs = useMemo(() => {
        let runner : {producer: string, source: string, target: string, points: {id: string, node: string}[]}[] = [];
        runs.forEach((run) => {
            let r = bfs_search(paths, run.source, run.target)
            if(r.length > 0){
                runner.push({
                    producer: run.producer,
                    source: r[0].node,
                    target: r[r.length - 1].node,
                    points: r, //r.map((x) => x.id),
                })
            }
            
        })
        return runner.filter((a) => a)
    }, [])

    const getStatus = (id: string) => {
        //Check pipe run's producer is active
        //Check flow up to id

        let run_paths = pipe_runs.map((run) => {
           return {
                ids: run.points.map((x) => x.id).filter((a) => a), //r.map((x) => x.id),
                points: run.points,
                active: context.io_status?.[run.producer] === "start"
            }
        })

        const run = run_paths.find((a) => a.ids.indexOf(id) > -1);

        if(run){
            let node_ix = run.ids.indexOf(id);
            if(run.ids.length > node_ix){
                node_ix += 1;
            }
            const producer_active = run.active

            const run_nodes = run.points.slice(0, node_ix);

            const run_active = run_nodes.map((x) => context.io_status?.[x.node] !== 'close').indexOf(false) < 0;

            return producer_active && run_active;
        }
    }

    const addPoint = (path_id: string, ix: number, e: React.MouseEvent, pos: InfiniteCanvasPosition) => {
        context.addPathPoint?.(path_id, ix, pos)
        e.stopPropagation()

        let doc = getHostForElement(e.target as HTMLElement)

        const mouseMove = (e: MouseEvent) => {
            updatePoint(path_id, ix + 1, {
                x: e.clientX,
                y: e.clientY
            })
        }

        const mouseUp = (e: MouseEvent) => {    
            doc.removeEventListener('mousemove', mouseMove as EventListenerOrEventListenerObject)
            doc.removeEventListener('mouseup', mouseUp as EventListenerOrEventListenerObject)
        }

        doc.addEventListener('mousemove', mouseMove as EventListenerOrEventListenerObject)
        doc.addEventListener('mouseup', mouseUp as EventListenerOrEventListenerObject)
    }

    const updatePoint = (path_id: string, ix: number, pos: InfiniteCanvasPosition) => {
        context.updatePathPoint?.(path_id, ix, pos)
    }

    const linkPath = (path_id: string, nodeId: string, handleId: string) => {
        context.linkPath?.(path_id, nodeId, handleId)
    }

    return (
        <svg
            style={{
                width: '100%',
                height: '100%',
                overflow: 'visible',
                pointerEvents: 'all',
                transformOrigin: '0 0',
                transform: `matrix(${zoom}, 0, 0, ${zoom}, ${offset.x}, ${offset.y})`,
                position: 'absolute'
            }}>
                {paths.map((path) => 
                          <FlowPath
                            path={path}
                            editable={context.editable}
                            onLinked={(nodeId, handleId) => linkPath(path.id, nodeId, handleId)}
                            onPointsChanged={(ix, point) => updatePoint(path.id, ix, point)}
                            onMouseDown={(ix, e, position) => addPoint(path.id, ix, e, position)}
                            points={(path.points || [])} />
                )}
        </svg>
    )
}

//                            className={getStatus(path.id) ? "active" : 'inactive'} 
