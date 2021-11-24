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
        
        this.ItemEdit= this.ItemEdit.bind(this);
        this.ItemClick = this.ItemClick.bind(this);

        var tempState: ListInput = {listItems: props.listItems,onEdit:props.onEdit,onSelect:props.onSelect,reverse:props.reverse };
        if (this.props.onSelect === undefined) {
            tempState.onSelect = () => { };
        }
        
        if (this.props.onEdit === undefined) {
            tempState.onEdit = () => { };
        }
        
        if (props.reverse) {
            tempState.listItems = tempState.listItems.reverse();
        }

        this.state = tempState;

        //this.setState(props);
    }

    componentDidMount() {
        console.log("List loaded");
    }
    componentDidCatch(){
        console.log("List failed");

    }

    ItemClick = (value: string) => {
        // console.log(value);
        this.state.onSelect(value);
    }

    ItemEdit = (e:any, value:string) =>{
        this.state.onEdit(value);
    }

    render() {
        var itemsList = (this.props.reverse?this.props.listItems.reverse(): this.props.listItems).map((i) => <span className="list_component__item" ><ListItem key={i} input={i} onClick={()=>{this.ItemClick(i)}} /><div onClick={(e)=>{console.log(e); this.ItemEdit(e,i)}} className="list_component__button"><EditRounded /></div></span> );
        return itemsList;
    }
}