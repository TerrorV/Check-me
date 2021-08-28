import React, { Component } from "react";
import { ListInput } from "./ListInput";
import { SearchField } from "./SearchField";
import { ListComponent } from "./List.component";
import { MainState } from "./MainState";
import { EditItemComponent } from "./EditItem.component";
import { CheckList, Configuration, ItemsApi, ListsApi } from "./dal";
import { couldStartTrivia } from "typescript";
import MainControls from "./MainControls.component";
import { AddListComponent } from "./AddList.component";

export class MainComponent extends Component<any, MainState> {
  /**
   *
   */

  private state1: MainState;
  private listsRepo: ListsApi;
  private itemsRepo: ItemsApi;
  constructor(props: ListInput) {
    super(props);

    this.ItemSelected = this.ItemSelected.bind(this);
    this.AddItem = this.AddItem.bind(this);
    this.RemoveItem = this.RemoveItem.bind(this);
    this.SearchOpened = this.SearchOpened.bind(this);
    this.SearchClosed = this.SearchClosed.bind(this);
    this.EditItem = this.EditItem.bind(this);
    this.DeleteItem = this.DeleteItem.bind(this);
    this.CancelEdit = this.CancelEdit.bind(this);
    this.UpdateItem = this.UpdateItem.bind(this);
    this.CreateNewList = this.CreateNewList.bind(this);
    this.LoadList = this.LoadList.bind(this);
    this.RefreshList = this.RefreshList.bind(this);
    this.ShowAddListDialogue = this.ShowAddListDialogue.bind(this);
    this.HideAddListDialogue = this.HideAddListDialogue.bind(this);
    this.LoadRemoteList = this.LoadRemoteList.bind(this);
    this.DeleteCurrentList=this.DeleteCurrentList.bind(this);
    this.state1 = this.state;
    console.log(process.env.NODE_ENV);
    console.log(process.env.PUBLIC_URL);
    console.log(process.env.API_HOST);
    console.log(process.env.REACT_APP_API_HOST);

    var config = new Configuration();
    config.basePath = process.env.REACT_APP_API_HOST;
    this.listsRepo = new ListsApi(config, config.basePath);
    this.itemsRepo = new ItemsApi(config, config.basePath);
    // indexedDB.open()
    console.log(props);
    var outstanding: string[] = JSON.parse(localStorage.getItem("Outstanding") ?? "[]");
    var done: string[] = JSON.parse(localStorage.getItem("Done") ?? "[]");
    var listId: string = localStorage.getItem("listId") ?? "";
    // var listRepo = new ListsApi();

    this.state = {
      done: done,
      outstanding: outstanding,
      isDoneVisible: true,
      currentValue: "",
      listId: listId,
      showOpenList: false
    };


    //this.setState(props);
  }

  componentDidMount() {
    console.log("Did mount");
    if (this.state.listId === "") {
      this.CreateNewList("00000000-0000-0000-0000-000000000000", this.state.outstanding, this.state.done);
    } else {
      this.listsRepo.listsGetList(this.state.listId).then(x => this.LoadList(x)).catch(e => this.CreateNewList(this.state.listId, this.state.outstanding, this.state.done));
      //this.listsRepo.listsGetList(this.state.listId).then(x => this.LoadList(x)).catch(e => this.CreateNewList(this.state.listId, this.state.outstanding, this.state.done));
    }

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
    console.log(this.setState);
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

    this.setState(this.state);
    this.PersistState(this.state);
    this.itemsRepo.itemsUpdateItem(1, this.state.listId, value).
    then(x => this.RefreshList(this.state.listId)).
    catch(x=>this.itemsRepo.itemsAddItem(value,this.state.listId).
    then(x => this.RefreshList(this.state.listId)));
    // var itemRepo = new ItemsApi();


    // this.setState(this.state);
  }

  RefreshList(listId: string): Promise<CheckList> {
    //  var listRepo = new ListsApi()
    return this.listsRepo.listsGetList(listId).then(x => this.LoadList(x));
    // throw new Error("Method not implemented.");
  }

  UpdateItem(oldValue: string, newValue: string) {
    console.log(oldValue + "|" + newValue)
    if (this.state.outstanding.includes(oldValue)) {
      this.state.outstanding[this.state.outstanding.indexOf(oldValue)] = newValue;
    }

    if (this.state.done.includes(oldValue)) {
      this.state.done[this.state.done.indexOf(oldValue)] = newValue;
    }

    this.setState(this.state);
    //this.RefreshList(this.state.listId);
    // var itemRepo = new ItemsApi();
    this.itemsRepo.itemsEditItem(newValue, this.state.listId, oldValue).then(x => this.RefreshList(this.state.listId));

    this.PersistState(this.state);

    //this.setState(this.state);

    this.CancelEdit();
  }

  CancelEdit(): void {
    this.state = {
      currentValue: "",
      done: this.state.done,
      outstanding: this.state.outstanding,
      isDoneVisible: this.state.isDoneVisible,
      listId: this.state.listId,
      showOpenList: this.state.showOpenList
    }

    this.setState(this.state);
  }

  PersistState(appState: MainState): void {
    console.log(appState);
    localStorage.setItem("Outstanding", JSON.stringify(appState.outstanding));
    localStorage.setItem("Done", JSON.stringify(appState.done));
    localStorage.setItem("listId", appState.listId);
  }

  RemoveItem(value: string) {
    console.log("remove");
    const tempState: MainState = { outstanding: this.state.outstanding, done: this.state.done, isDoneVisible: this.state.isDoneVisible, currentValue: this.state.currentValue, listId: this.state.listId, showOpenList: this.state.showOpenList };
    if (!tempState.done.includes(value)) {
      tempState.done.push(value);
      tempState.outstanding.splice(tempState.outstanding.indexOf(value), 1);
      this.setState(tempState);
    }

    this.setState(tempState);
    this.PersistState(tempState);
    this.itemsRepo.itemsUpdateItem(2, this.state.listId, value).then(x => this.RefreshList(this.state.listId));
    // this.RefreshList(this.state.listId).then(() => {

    // }).then(() => this.itemsRepo.itemsUpdateItem(2, this.state.listId, value).catch(e => console.log(e)));
  }

  DeleteItem(value: string) {
    const tempState: MainState = { outstanding: this.state.outstanding, done: this.state.done, isDoneVisible: this.state.isDoneVisible, currentValue: this.state.currentValue, listId: this.state.listId, showOpenList: this.state.showOpenList };

    if (tempState.outstanding.includes(value)) {
      tempState.outstanding.splice(tempState.outstanding.indexOf(value), 1);
    } else {
      tempState.done.splice(tempState.done.indexOf(value), 1);
    }
    this.setState(tempState);
    this.PersistState(tempState);
    this.itemsRepo.itemsRemoveItem(this.state.listId, value).then(x => this.RefreshList(this.state.listId));

    this.CancelEdit();
  }

  EditItem(value: string) {
    console.log(value);
    const tempState: MainState = { outstanding: this.state.outstanding, done: this.state.done, isDoneVisible: this.state.isDoneVisible, currentValue: value, listId: this.state.listId, showOpenList: this.state.showOpenList };
    this.setState(tempState);
  }

  ItemClick = (e: any, value: string) => {
    console.log(value);
  }

  LoadList(list: CheckList): any {
    var tempState: MainState = this.state;
    // {
    //   done: list.done ?? [],
    //   outstanding: list.outstanding ?? [],
    //   isDoneVisible: true,
    //   currentValue: "",
    //   listId: list.id,
    // }
    while (tempState.done.length > 0) {
      tempState.done.pop();
    }

    while (tempState.outstanding.length > 0) {
      tempState.outstanding.pop();
    }

    // tempState.done.slice(0,0);
    for (const iterator of (list.done ?? [])) {
      tempState.done.push(iterator);
    }

    for (const iterator of (list.outstanding ?? [])) {
      tempState.outstanding.push(iterator);
    }
    // tempState.outstanding.concat(list.outstanding ?? []);
    tempState.isDoneVisible = true;
    tempState.listId = list.id;

    this.setState(tempState);
    console.log("LoadList");
    console.log(list);
    console.log(this.state);
    console.log(tempState);
    // console.log(this.setState);

    // this.PersistState(tempState);
    return;
  }

  ShowAddListDialogue(): void {
    var tempState: MainState = this.state;
    tempState.showOpenList = true;
    this.setState(tempState);
  }
  HideAddListDialogue(): void {
    var tempState: MainState = this.state;
    tempState.showOpenList = false;
    this.setState(tempState);
  }

  LoadRemoteList(listId: string): void {
    console.log(listId);
    if (listId === "") {
      return;
    }

    this.listsRepo.listsGetList(listId).then(x => this.LoadList(x)).catch(e => this.CreateNewList(this.state.listId, this.state.outstanding, this.state.done));
    //this.listsRepo.listsGetList(this.state.listId).then(x => this.LoadList(x)).catch(e => this.CreateNewList(this.state.listId, this.state.outstanding, this.state.done));
  }

  DeleteCurrentList():void{
    var tempState:MainState = {
      currentValue:"",
      done:[],
      outstanding:[],
      isDoneVisible:false,
      listId:"",
      showOpenList:false
    };

    this.setState(tempState);
    this.PersistState(tempState);
  }

  CreateNewList(listId: string, outstanding: string[], done: string[]): any {
    // var listRepo = new ListsApi();
    this.listsRepo.listsCreateList({ outstanding: outstanding, done: done, id: listId }).then(x => {
      var tempState: MainState = {
        done: done,
        outstanding: outstanding,
        isDoneVisible: true,
        currentValue: "",
        listId: x.id,
        showOpenList: false
      };
      this.setState(tempState);
      this.PersistState(tempState);
    });
    // throw new Error("Function not implemented.");
  }

  render() {
    //const mystyle = { textDecoration: "line-through" };
    return <div className="main">

      <p></p>
      {/* <ListComponent listItems={items}></ListComponent> */}
      {/* <ListComponent listItems={items}></ListComponent> */}
      <span>
        {
          this.state.showOpenList &&
          <AddListComponent onAccept={this.LoadRemoteList} onCancel={this.HideAddListDialogue} value={this.state.listId} ></AddListComponent>

        }
      </span>
      <span>
        {
          this.state.currentValue !== "" && !this.state.showOpenList &&
          <EditItemComponent value={this.state.currentValue} onCancel={() => this.CancelEdit()} onDelete={() => this.DeleteItem(this.state.currentValue)} onUpdate={(newValue) => this.UpdateItem(this.state.currentValue, newValue)} ></EditItemComponent>

        }
      </span>

      {/* <ListItem input="hhbvggg"/> */}
      {
        this.state.currentValue === "" && !this.state.showOpenList &&
        <span className="main__display_section">
          <span className="main__outstanding">
            <ListComponent reverse={false} onSelect={this.RemoveItem} onEdit={this.EditItem} listItems={this.state.outstanding}></ListComponent>
          </span>
          <div>
            <SearchField listItems={this.state.done} onSelect={this.ItemSelected} onClose={this.SearchClosed} onOpen={this.SearchOpened} />
          </div>
          <span className="main__done" >
            {
              this.state.isDoneVisible ? <ListComponent reverse={true} onSelect={this.AddItem} onEdit={this.EditItem} listItems={this.state.done}></ListComponent> : null
            }
          </span>
        </span>
      }
      {
        !this.state.showOpenList &&
        <MainControls onAddExisting={this.ShowAddListDialogue} onDelete={this.DeleteCurrentList} onNew={() => console.log("new")} onSync={()=>this.RefreshList(this.state.listId)} />
      }
    </div>
  }
}


