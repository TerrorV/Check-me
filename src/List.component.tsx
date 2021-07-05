import React, { Component } from "react";
import ListItem from "./ListItem";
import { ListInput } from "./ListInput";
import { EditRounded } from "@material-ui/icons";

export class ListComponent extends Component<ListInput, ListInput> {
    /**
     *
     */
    constructor(props: ListInput) {
        super(props);
        console.log(props);
        var tempState: ListInput = props;
        if (this.props.onSelect === undefined) {
            tempState.onSelect = () => { };
        }
        
        if (this.props.onEdit === undefined) {
            tempState.onEdit = () => { };
        }
        
        this.ItemEdit= this.ItemEdit.bind(this);
        this.ItemClick = this.ItemClick.bind(this);
        this.state = tempState;
        //this.setState(props);
    }

    ItemClick = (value: string) => {
        console.log(value);
        this.state.onSelect(value);
    }

    ItemEdit = (e:any, value:string) =>{
        this.state.onEdit(value);
    }

    render() {
        var itemsList = this.state.listItems.map((i) => <span className="list_component__item" ><ListItem key={i} input={i} onClick={()=>{this.ItemClick(i)}} /><div onClick={(e)=>{console.log(e); this.ItemEdit(e,i)}} className="list_component__button"><EditRounded /></div></span> );
        return itemsList;
    }
}