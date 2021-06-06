import React, { Component } from "react";
import { ListInput } from "./ListInput";
import { SearchField } from "./SearchField";
import { ListComponent } from "./List.component";
import { MainState } from "./MainState";

export class MainComponent extends Component<any, MainState> {
  /**
   *
   */

  private state1: MainState;
  constructor(props: ListInput) {
    super(props);
    this.state1 = this.state;

    console.log(props);
    var outstanding: string[] = JSON.parse(localStorage.getItem("Outstanding")?? "[]");
    var done: string[] = JSON.parse(localStorage.getItem("Done") ?? "[]");
    this.state = {
      done: done,
      outstanding: outstanding
    };
    this.ItemSelected = this.ItemSelected.bind(this);
    this.AddItem = this.AddItem.bind(this);
    this.RemoveItem = this.RemoveItem.bind(this);
    //this.setState(props);
  }

  ItemSelected(value: string) {
    console.log(value);
    // if (!this.state.outstanding.includes(value)) {
    //   this.state.outstanding.push(value);
    //   this.setState(this.state);
    // }
    this.AddItem(value);
  }

  AddItem(value: string) {
    if (!this.state.outstanding.includes(value)) {
      this.state.outstanding.push(value);
    }

    if (this.state.done.includes(value)) {
      this.state.done.splice(this.state.done.indexOf(value), 1);
    }

    this.PersistState(this.state);

    this.setState(this.state);
  }

  PersistState(appState: MainState): void {
    localStorage.setItem("Outstanding", JSON.stringify(appState.outstanding));
    localStorage.setItem("Done", JSON.stringify(appState.done));
  }

  RemoveItem(value: string) {
    const tempState: MainState = { outstanding: this.state.outstanding, done: this.state.done };
    if (!tempState.done.includes(value)) {
      tempState.done.push(value);
      tempState.outstanding.splice(tempState.outstanding.indexOf(value), 1);
      this.setState(tempState);
    }
    this.PersistState(tempState);
  }

  ItemClick = (e: any, value: string) => {
    console.log(value);
  }
  render() {
    //const mystyle = { textDecoration: "line-through" };
    return <span>

      <SearchField listItems={this.state.done} onSelect={this.ItemSelected} />

      {/* <ListComponent listItems={items}></ListComponent> */}
      {/* <ListComponent listItems={items}></ListComponent> */}

      {/* <ListItem input="hhbvggg"/> */}
      <ListComponent onSelect={this.RemoveItem} listItems={this.state.outstanding}></ListComponent>
      <p>

      </p>
      <span className="main__done" >
        <ListComponent onSelect={this.AddItem} listItems={this.state.done}></ListComponent>
      </span>
    </span>
  }
}