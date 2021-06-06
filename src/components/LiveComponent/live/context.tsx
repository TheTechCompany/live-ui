import React from 'react';

export interface LiveContextShape {
    code?: string;
}

export const LiveContext = React.createContext<LiveContextShape>({code: ''})

export interface LiveProviderProps {
    code?: string
}

export const LiveProvider: React.FC<LiveProviderProps> = (props) => {
    return <LiveContext.Provider value={{code: props.code}} >{props.children}</LiveContext.Provider>
}