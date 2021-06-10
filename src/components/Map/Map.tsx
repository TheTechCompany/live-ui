import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { LatLng, LatLngLiteral, LatLngTuple, Icon } from 'leaflet'
import { Box } from 'grommet'
import styled from 'styled-components'
//import MarkerIcon from './marker-icon.png'

//import 'leaflet/dist/leaflet.css'

//const MarkerSvg = new Icon({iconUrl: MarkerIcon})

export interface BaseMarker {
    text?: string;
    position: LatLng | LatLngLiteral | LatLngTuple
}

export interface BaseMapProps {
    className?: string;
    center: LatLng | LatLngLiteral | LatLngTuple;
    zoom?: number;
    markers?: BaseMarker | Array<BaseMarker> 

    markerIcon?: Icon
}

export const BaseMap : React.FC<BaseMapProps> = (props) => {
    return (
        <Box
            background="light-2"
            round="xsmall"
            className={props.className}>
                    <MapContainer center={props.center} zoom={props.zoom || 17} scrollWheelZoom={true}>
                        <TileLayer
                            attribution="Open streetmap"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {Array.isArray(props.markers) ? props.markers.map((marker) => (
                            <Marker 
                                icon={props.markerIcon}
                                position={marker.position}>
                                {marker.text && <Popup>{marker.text}</Popup>}
                            </Marker>
                        )) : props.markers && 
                        <Marker 
                            icon={props.markerIcon} 
                            position={props.markers?.position}>
                            {props.markers?.text && <Popup>
                                {props.markers?.text}
                            </Popup>}
                        </Marker>}
                    </MapContainer>
                </Box>
    )
}

export const Map = styled(BaseMap)`

`