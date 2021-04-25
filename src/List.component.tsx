import React, { Component } from "react";
import ListItem from "./ListItem";
import { ListInput } from "./ListInput";

export class ListComponent extends Component<ListInput,ListInput> {
/**
 *
 */
constructor(props: ListInput) {
    super(props);
    console.log(props);
    this.state=props;
    //this.setState(props);
}

ItemClick=(e:any,value:string)=> {
    console.log(value);
}
    render(){
        var itemsList = this.state.listItems.map((i)=><ListItem key={i.toString()} input={i} onClick={this.ItemClick.bind(this,i)} />);
        return itemsList;
    }
}