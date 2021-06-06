import React, { useContext, useEffect, useRef } from 'react';
import { InfiniteCanvasContext } from '../context/context';

export interface GridLayerProps {
}

export const GridLayer: React.FC<GridLayerProps> = (props) => {

    const context = useContext(InfiniteCanvasContext)

    const lineColor =  {
        dark: "#131c20",
        light: "#dfdfdf"
    }

    const bgColor = {
        dark: 'rgb(42, 42, 42)',
        light: 'white'
    }

    const zoom = context.zoom;
    const offset = context.offset
    const darkMode = context.darkMode

    

    const backgroundColor = darkMode ? bgColor.dark : bgColor.light
    const lineColors = darkMode ? lineColor.dark : lineColor.light

    const svgRef = useRef<SVGSVGElement>(null);

    const renderHorizontal = () => {
        let horiz = []
     
        for (var i = 0; i < 10; i++) {
            horiz.push(<line stroke={lineColors} x1='0.5' x2="99.5" y1={`${i * 10}`} y2={`${i * 10}`} />)
        }
        return horiz;
    }

    const renderVertical = () => {
        let vert = [];
     
     
        for (var i = 0; i < 10; i++) {
            vert.push(<line stroke={lineColors} x1={`${i * 10}`} x2={`${i * 10}`} y1="0.5" y2="99.5" />)
        }
        return vert;
    }

    useEffect(() => {

    }, [])

    const scaledTile = 100 * zoom;

    const offsetX = offset.x % scaledTile
    const offsetY = offset.y % scaledTile

    return (
        <svg ref={svgRef} style={{flex: 1, backgroundColor: backgroundColor}}>
            <defs>
                <pattern patternUnits="userSpaceOnUse" width="100" height="100" viewBox="0 0 100 100" id="cells">
                    <rect x="0" y="0" width="100" height="100" fill="none" style={{strokeWidth: 2, stroke: lineColors}}></rect>
                    {renderHorizontal()}
                    {renderVertical()}
                </pattern>
                <pattern patternUnits="userSpaceOnUse" width={scaledTile} height={scaledTile} viewBox={`0 0 ${scaledTile} ${scaledTile}`} id="cell-rect">
                    <rect 
                        x="-100" 
                        y="-100" 
                        width="300" 
                        height="300" 
                        style={{
                            fill: "url(#cells)",
                            transformOrigin: '0 0',
                            transform: `matrix(${zoom}, 0, 0, ${zoom}, ${offsetX}, ${offsetY})`
                        }}>

                    </rect>
                </pattern>
            </defs>

            <rect height="100%" width="100%" fill="url(#cell-rect)" />
        </svg>
    )
}