import React from "react";
import { AbstractWidgetFactory } from "../../../InfiniteCanvas";
import { IconNode } from "./IconNode";

export class IconNodeFactory extends AbstractWidgetFactory {

    constructor(){
        super('icon-node')
    }

    generateWidget(event: any): JSX.Element {
        return (<IconNode  {...event} />)
    }
    parseModel(model: any) {
        return {
            ...model
        }
    }

}