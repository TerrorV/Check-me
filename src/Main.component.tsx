import React, { Component } from "react";
import { ListInput } from "./ListInput";
import { SearchField } from "./SearchField";
import { ListComponent } from "./List.component";
import { MainState } from "./MainState";
import { EditItemComponent } from "./EditItem.component";

export class MainComponent extends Component<any, MainState> {
  /**
   *
   */

  private state1: MainState;
  constructor(props: ListInput) {
    super(props);
    this.state1 = this.state;
    // indexedDB.open()
    console.log(props);
    var outstanding: string[] = JSON.parse(localStorage.getItem("Outstanding") ?? "[]");
    var done: string[] = JSON.parse(localStorage.getItem("Done") ?? "[]");
    this.state = {
      done: done,
      outstanding: outstanding,
      isDoneVisible: true,
      currentValue: ""
    };
    this.ItemSelected = this.ItemSelected.bind(this);
    this.AddItem = this.AddItem.bind(this);
    this.RemoveItem = this.RemoveItem.bind(this);
    this.SearchOpened = this.SearchOpened.bind(this);
    this.SearchClosed = this.SearchClosed.bind(this);
    this.EditItem = this.EditItem.bind(this);
    this.DeleteItem = this.DeleteItem.bind(this);
    this.CancelEdit = this.CancelEdit.bind(this);
    this.UpdateItem = this.UpdateItem.bind(this);
    //this.setState(props);
  }

  ItemSelected(value: string) {
    console.log(value);
    // if (!this.state.outstanding.includes(value)) {
    //   this.state.outstanding.push(value);
    //   this.setState(this.state);
    // }

    this.AddItem(value);
    // var tempState: MainState = this.state;
    // tempState.isVisibleDone = true;
    // this.setState(tempState);
  }

  SearchClosed(): void {
    var tempState: MainState = this.state;
    tempState.isDoneVisible = true;
    this.setState(tempState);
  }

  SearchOpened(): void {
    var tempState: MainState = this.state;
    tempState.isDoneVisible = false;
    this.setState(tempState);
  }

  AddItem(value: string) {
    console.log("addd item")
    if (!this.state.outstanding.includes(value)) {
      this.state.outstanding.push(value);
    }

    if (this.state.done.includes(value)) {
      this.state.done.splice(this.state.done.indexOf(value), 1);
    }

    this.PersistState(this.state);

    this.setState(this.state);
  }

  UpdateItem(oldValue: string,newValue: string) {
    console.log(oldValue +"|"+ newValue)
    if (this.state.outstanding.includes(oldValue)) {
      this.state.outstanding[this.state.outstanding.indexOf(oldValue)] = newValue;
    }

    if (this.state.done.includes(oldValue)) {
      this.state.done[this.state.done.indexOf(oldValue)] = newValue;
    }

    this.PersistState(this.state);

    this.setState(this.state);

    this.CancelEdit();
  }

  CancelEdit():void{
    this.state ={
      currentValue:"",
      done:this.state.done,
      outstanding:this.state.outstanding,
      isDoneVisible:this.state.isDoneVisible
    }

    this.setState(this.state);
  }

  PersistState(appState: MainState): void {
    localStorage.setItem("Outstanding", JSON.stringify(appState.outstanding));
    localStorage.setItem("Done", JSON.stringify(appState.done));
  }

  RemoveItem(value: string) {
    console.log("remove");
    const tempState: MainState = { outstanding: this.state.outstanding, done: this.state.done, isDoneVisible: this.state.isDoneVisible, currentValue: this.state.currentValue };
    if (!tempState.done.includes(value)) {
      tempState.done.push(value);
      tempState.outstanding.splice(tempState.outstanding.indexOf(value), 1);
      this.setState(tempState);
    }

    this.PersistState(tempState);
  }

  DeleteItem(value:string){
    const tempState: MainState = { outstanding: this.state.outstanding, done: this.state.done, isDoneVisible: this.state.isDoneVisible, currentValue: this.state.currentValue };
    if (tempState.outstanding.includes(value)) {
      tempState.outstanding.splice(tempState.outstanding.indexOf(value), 1);
    }else{
      tempState.done.splice(tempState.done.indexOf(value), 1);
    }

    this.setState(tempState);

    this.PersistState(tempState);
    this.CancelEdit();
  }

  EditItem(value: string) {
  console.log(value);
    const tempState: MainState = { outstanding: this.state.outstanding, done: this.state.done, isDoneVisible: this.state.isDoneVisible, currentValue: value };
    this.setState(tempState);
  }

  ItemClick = (e: any, value: string) => {
    console.log(value);
  }
  render() {
    //const mystyle = { textDecoration: "line-through" };
    return <div className="main">

      <p></p>
      {/* <ListComponent listItems={items}></ListComponent> */}
      {/* <ListComponent listItems={items}></ListComponent> */}
      <span>
        {
          this.state.currentValue !== "" &&
          <EditItemComponent value={this.state.currentValue} onCancel={() => this.CancelEdit()} onDelete={() => this.DeleteItem(this.state.currentValue)} onUpdate={(newValue) => this.UpdateItem(this.state.currentValue,newValue)} ></EditItemComponent>

        }
      </span>

      {/* <ListItem input="hhbvggg"/> */}
      {
        this.state.currentValue === "" &&
        <span className="main__display_section">
          <span className="main__outstanding">
            <ListComponent onSelect={this.RemoveItem} onEdit={this.EditItem} listItems={this.state.outstanding}></ListComponent>
          </span>
          <div>
            <SearchField listItems={this.state.done} onSelect={this.ItemSelected} onClose={this.SearchClosed} onOpen={this.SearchOpened} />
          </div>
          <span className="main__done" >
            {
              this.state.isDoneVisible ? <ListComponent onSelect={this.AddItem} onEdit={this.EditItem} listItems={this.state.done}></ListComponent> : null
            }
          </span>
        </span>
      }
    </div>
  }
}