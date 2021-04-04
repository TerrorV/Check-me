import React, { Component } from "react";
import ListItem from "./ListItem";
import { ListInput } from "./ListInput";

export class ListComponent extends Component<ListInput,ListInput> {
/**
 *
 */
constructor(props: ListInput) {
    console.log(props);
    super(props);
    this.state=props;
    //this.setState(props);
}
    render(){
        var itemsList = this.state.listItems.map((i)=><ListItem input={i} />);
        return itemsList;
    }
}