import React, { Component } from "react";
import ListItem from "./ListItem";
import { ListInput } from "./ListInput";
import { SearchField } from "./SearchField";
import { ListComponent } from "./List.component";

export class MainComponent extends Component<ListInput,ListInput> {
/**
 *
 */
 
private state1:ListInput;
constructor(props:ListInput) {
    super(props);
    this.state1=this.state;

    console.log(props);
    this.state=props;
    this.ItemSelected = this.ItemSelected.bind(this);
    //this.setState(props);
}

ItemSelected(value:string) {
    console.log(value);
    if (!this.state.listItems.includes(value)){
      this.state.listItems.push(value);
      this.setState(this.state);
    }
  }

ItemClick=(e:any,value:string)=> {
    console.log(value);
}
    render(){
        return <span>

      <SearchField listItems={this.state.listItems} onSelect={this.ItemSelected} />

      {/* <ListComponent listItems={items}></ListComponent> */}
      {/* <ListComponent listItems={items}></ListComponent> */}

      {/* <ListItem input="hhbvggg"/> */}
      <ListComponent listItems={this.state.listItems}></ListComponent> 
      </span>
    }
}