import React, { Component } from "react";
import ListItem from "./ListItem";
import { ListInput } from "./ListInput";

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
        this.state = tempState;
        //this.setState(props);
    }

    ItemClick = (e: any, value: string) => {
        console.log(value);
        this.state.onSelect(value);
    }
    render() {
        var itemsList = this.state.listItems.map((i) => <ListItem key={i} input={i} onClick={this.ItemClick.bind(this, i)} />);
        return itemsList;
    }
}