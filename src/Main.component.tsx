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
import { PersistenceService } from "./services/PersistenceService";
import { LocalStorageRepo } from "./dal/LocalStorageRepo";

export class MainComponent extends Component<any, MainState> {
  /**
   *
   */

  // private state1: MainState;
  // private listsRepo: ListsApi;
  // private itemsRepo: ItemsApi;
  private eventHandler: any;
  private persistenceService: PersistenceService;


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
    this.DeleteCurrentList = this.DeleteCurrentList.bind(this);
    this.HandleMessage = this.HandleMessage.bind(this);
    this.HandleError = this.HandleError.bind(this);
    this.UpdateItemState = this.UpdateItemState.bind(this);
    console.log(process.env.NODE_ENV);
    console.log(process.env.PUBLIC_URL);
    console.log(process.env.API_HOST);
    console.log(process.env.REACT_APP_API_HOST);

    var config = new Configuration();
    config.basePath = process.env.REACT_APP_API_HOST;
    // this.listsRepo = new ListsApi(config, config.basePath);
    // this.itemsRepo = new ItemsApi(config, config.basePath);
    this.persistenceService = new PersistenceService(
      new ListsApi(config, config.basePath),
      new ItemsApi(config, config.basePath),
      new LocalStorageRepo());
    // indexedDB.open()
    console.log(config);
    console.log(props);
    // var outstanding: string[] = JSON.parse(localStorage.getItem("Outstanding") ?? "[]");
    // var done: string[] = JSON.parse(localStorage.getItem("Done") ?? "[]");
    // var listId: string = localStorage.getItem("listId") ?? "";
    // var listRepo = new ListsApi();
    this.eventHandler = null;

    this.state = {isDoneVisible:true,currentValue:"",listId:"",showOpenList:false,outstanding:[],done:[]};

    //this.setState(props);
  }

  async componentDidMount() {
    console.log("Did mount");

    var list = await this.persistenceService.InitList();
    // var sss = new MainStateImpl();
    // sss.listId="254aff23-20dd-4438-a07c-1569d28eb70e";
    // sss.outstanding = ["asd","Qwe","poi","asd1"];
    
    // this.setState({listId:"254aff23-20dd-4438-a07c-1569d28eb70e"});
    // this.setState({outstanding:["asd","Qwe","poi","asd1"]},()=>console.log(this.state));
    this.SetListAsState(list);
    try {
      // this.eventHandler = this.persistenceService.SubscribeToList(this.state.listId, this.HandleMessage, this.HandleError);
      // this.eventHandler = this.persistenceService.SubscribeToList(list.id, this.HandleMessage, this.HandleError);
      // // this.eventHandler = this.listsRepo.listsSubscribeToList(this.state.listId, this.HandleMessage, this.HandleError);
    } catch (error) {
      console.log("SSE ERROR!!!");
      console.log(error);
    }
  }

  HandleMessage(message: any): void {
    if (message.data === 'ping') {
      return;
    }

    this.LoadList(JSON.parse(message.data));
    console.log(message.data);
  }

  HandleError(message: any): void {
    console.trace(message);
    console.log(message);
    console.log(message.stack);
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
    this.setState(tempState,()=>console.log(this.state));
  }

  SearchOpened(): void {
    var tempState: MainState = this.state;
    tempState.isDoneVisible = false;
    // console.log(this.setState);
    this.setState(tempState,()=>console.log(this.state));
  }

  async AddItem(value: string) {
    console.log("addd item")
    if (!await this.persistenceService.AddItem(value, this.state.listId)) {
      this.persistenceService.MoveToOutstanding(value, this.state.listId);
    }

    await this.SetState();
    // if (!this.state.outstanding.includes(value)) {
    //   this.state.outstanding.push(value);
    // }

    // if (this.state.done.includes(value)) {
    //   this.state.done.splice(this.state.done.indexOf(value), 1);
    // }

    //this.PersistState(this.state);
    // this.itemsRepo.itemsUpdateItem(1, this.state.listId, value).
    // this.itemsRepo.itemsAddItem(value, this.state.listId).
    //   then(x => this.RefreshList(this.state.listId)).
    //   catch(x => {
    //     console.log("add catch");
    //     console.log(this.state.listId);
    //     console.log(value);
    //     this.UpdateItemState(value, 1);
    //   });
    // var itemRepo = new ItemsApi();


    // this.setState(this.state);
  }

  private async SetState() {
    var list: CheckList = await this.persistenceService.GetCurrentList();
    this.SetListAsState(list);
  }

  private async SetListAsState(list: CheckList) {
    var tempState: MainState = { outstanding: list.outstanding ?? [], done: list.done ?? [], currentValue: this.state.currentValue, isDoneVisible: this.state.isDoneVisible, listId: list.id, showOpenList: this.state.showOpenList };
    this.setState(tempState,()=>console.log(this.state));
  }

  UpdateItemState(item: string, stateValue: number) {
    if (stateValue === 1) {
      this.persistenceService.MoveToOutstanding(item, this.state.listId);
    } else {
      this.persistenceService.MoveToDone(item, this.state.listId);
    }

    // this.itemsRepo.itemsUpdateItem(stateValue, this.state.listId, item).
    //   then(x => this.RefreshList(this.state.listId)).catch(this.HandleError);
  }

  async RefreshList(listId: string): Promise<CheckList> {
    //  var listRepo = new ListsApi()
    var list;
    try {
      list = await this.persistenceService.GetList(listId);
      this.LoadList(list);

    } catch (error) {
      this.HandleError(error);
      throw error;
    }
    // return this.listsRepo.listsGetList(listId).then(x => this.LoadList(x)).catch(this.HandleError);
    // throw new Error("Method not implemented.");
    return list;
  }

  async UpdateItem(oldValue: string, newValue: string) {
    console.log(oldValue + "|" + newValue);
    await this.persistenceService.EditItem(oldValue, newValue, this.state.listId);

    await this.SetState();
    // if (this.state.outstanding.includes(oldValue)) {
    //   this.state.outstanding[this.state.outstanding.indexOf(oldValue)] = newValue;
    // }

    // if (this.state.done.includes(oldValue)) {
    //   this.state.done[this.state.done.indexOf(oldValue)] = newValue;
    // }

    //this.RefreshList(this.state.listId);
    // var itemRepo = new ItemsApi();
    // this.itemsRepo.itemsEditItem(newValue, this.state.listId, oldValue).then(x => this.RefreshList(this.state.listId)).catch(this.HandleError);

    // this.PersistState(this.state);

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

    this.setState(this.state,()=>console.log(this.state));
  }

  PersistState(appState: MainState): void {
    console.log(appState);
    throw new Error("DEPRECATED! NOT IN USE!!!");

    // localStorage.setItem("Outstanding", JSON.stringify(appState.outstanding));
    // localStorage.setItem("Done", JSON.stringify(appState.done));
    // localStorage.setItem("listId", appState.listId);
  }

  RemoveItem(value: string) {
    console.log("remove");

    this.persistenceService.MoveToDone(value, this.state.listId);

    this.SetState();
    // const tempState: MainState = { outstanding: this.state.outstanding, done: this.state.done, isDoneVisible: this.state.isDoneVisible, currentValue: this.state.currentValue, listId: this.state.listId, showOpenList: this.state.showOpenList };
    // if (!tempState.done.includes(value)) {
    //   tempState.done.push(value);
    //   tempState.outstanding.splice(tempState.outstanding.indexOf(value), 1);
    //   this.setState(tempState);
    // }

    // this.setState(tempState);
    // this.PersistState(tempState);
    // this.itemsRepo.itemsUpdateItem(2, this.state.listId, value).then(x => this.RefreshList(this.state.listId)).catch(this.HandleError);
    // // this.RefreshList(this.state.listId).then(() => {

    // }).then(() => this.itemsRepo.itemsUpdateItem(2, this.state.listId, value).catch(e => console.log(e)));
  }

  async DeleteItem(value: string) {
    // const tempState: MainState = { outstanding: this.state.outstanding, done: this.state.done, isDoneVisible: this.state.isDoneVisible, currentValue: this.state.currentValue, listId: this.state.listId, showOpenList: this.state.showOpenList };

    // if (tempState.outstanding.includes(value)) {
    //   tempState.outstanding.splice(tempState.outstanding.indexOf(value), 1);
    // } else {
    //   tempState.done.splice(tempState.done.indexOf(value), 1);
    // }
    // this.setState(tempState);
    // this.PersistState(tempState);
    // this.itemsRepo.itemsRemoveItem(this.state.listId, value).then(x => this.RefreshList(this.state.listId)).catch(this.HandleError);

    await this.persistenceService.DeleteItem(value, this.state.listId);
    this.SetState();
    this.CancelEdit();
  }

  EditItem(value: string) {
    console.log(value);
    const tempState: MainState = { outstanding: this.state.outstanding, done: this.state.done, isDoneVisible: this.state.isDoneVisible, currentValue: value, listId: this.state.listId, showOpenList: this.state.showOpenList };
    this.setState(tempState,()=>console.log(this.state));
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

    this.setState(tempState,()=>console.log(this.state));
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
    this.setState(tempState,()=>console.log(this.state));
  }
  HideAddListDialogue(): void {
    var tempState: MainState = this.state;
    tempState.showOpenList = false;
    this.setState(tempState,()=>console.log(this.state));
  }

  async LoadRemoteList(listId: string): Promise<void> {
    console.log(listId);
    if (listId === "") {
      return;
    }

    this.persistenceService.GetList(listId);

    await this.SetState();
    // this.listsRepo.listsGetList(listId).then(x => this.LoadList(x)).catch(e => this.CreateNewList(this.state.listId, this.state.outstanding, this.state.done));
    //this.listsRepo.listsGetList(this.state.listId).then(x => this.LoadList(x)).catch(e => this.CreateNewList(this.state.listId, this.state.outstanding, this.state.done));
  }

  async DeleteCurrentList(): Promise<void> {
    var tempState: MainState = {
      currentValue: "",
      done: [],
      outstanding: [],
      isDoneVisible: false,
      listId: "",
      showOpenList: false
    };

    await this.persistenceService.CreateNewList({ outstanding: [], done: [], id: "", timestamp: new Date() });

    this.SetState();
    // this.setState(tempState);
    // this.PersistState(tempState);
  }

  async CreateNewList(listId: string, outstanding: string[], done: string[]): Promise<any> {
    // var listRepo = new ListsApi();
    var list = await this.persistenceService.CreateNewList({ outstanding: outstanding, done: done, id: listId,timestamp: new Date() });
    this.SetState();
    // this.listsRepo.listsCreateList({ outstanding: outstanding, done: done, id: listId }).then(x => {
    //   var tempState: MainState = {
    //     done: done,
    //     outstanding: outstanding,
    //     isDoneVisible: true,
    //     currentValue: "",
    //     listId: x.id,
    //     showOpenList: false
    //   };
    //   this.setState(tempState);
    //   this.PersistState(tempState);
    // }).catch(this.HandleError);
    // throw new Error("Function not implemented.");
  }

  render() {
    //const mystyle = { textDecoration: "line-through" };
    return <div className="main">
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
        <MainControls onAddExisting={this.ShowAddListDialogue} onDelete={this.DeleteCurrentList} onNew={() => console.log("new")} onSync={() => this.RefreshList(this.state.listId)} />
      }
    </div>
  }
}


