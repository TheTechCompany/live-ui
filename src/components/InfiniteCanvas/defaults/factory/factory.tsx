import { AbstractWidgetFactory } from "../..";
import { ActionNodeWidget } from "./widget";

export class ActionNodeFactory extends AbstractWidgetFactory{
   

    constructor(){
        super('action-node')
    }


    generateWidget(event : any): JSX.Element {
        return <ActionNodeWidget  />
    }

}