import { CheckList } from "./api";

export class LocalStorageRepo {
    // private outstanding: string[];
    // private done: string[];
    // private listId: string;
    private list: CheckList;
    /**
     *
     */
    constructor() {
        //super();
        // this.outstanding = JSON.parse(localStorage.getItem("Outstanding") ?? "[]");
        // this.done = JSON.parse(localStorage.getItem("Done") ?? "[]");
        // this.listId = localStorage.getItem("listId") ?? "";
        this.list = { outstanding: [], done: [], id: "", timestamp: new Date() };
        // this.list = JSON.parse(localStorage.getItem("list") ?? "{ \"outstanding\": [], \"done\": [], \"id\": \"\" }");
        this.list = JSON.parse(localStorage.getItem("list") ?? JSON.stringify(this.list));
    }

    GetCurrentList(): Promise<CheckList> {
        return this.GetList(this.list.id);
    }

    MakeDone(value: string) {
        //const tempState: MainState = { outstanding: this.state.outstanding, done: this.state.done, isDoneVisible: this.state.isDoneVisible, currentValue: this.state.currentValue, listId: this.state.listId, showOpenList: this.state.showOpenList };
        if (!this.list.done?.includes(value) && this.list.outstanding?.includes(value)) {
            this.list.done?.push(value);
            this.list.outstanding.splice(this.list.outstanding?.indexOf(value), 1);
        }
        //throw new Error("Method not implemented.");
        this.PersistState();
    }

    async MakeOutstanding(value: string): Promise<boolean> {
        var isOk: boolean = (!this.list.outstanding?.includes(value) && this.list.done?.includes(value)) ?? false;
        if (!this.list.outstanding?.includes(value)) {
            this.list.outstanding?.push(value);
        }

        if (this.list.done?.includes(value)) {
            this.list.done.splice(this.list.done.indexOf(value), 1);
        }

        this.PersistState();
        return isOk;
    }

    EditItem(oldValue: string, newValue: string) {
        if (this.list.outstanding?.includes(oldValue)) {
            this.list.outstanding[this.list.outstanding.indexOf(oldValue)] = newValue;
        } else if (this.list.done?.includes(oldValue)) {
            this.list.done[this.list.done.indexOf(oldValue)] = newValue;
        }

        this.PersistState();
    }

    DeleteItem(value: string) {
        if (this.list.done?.includes(value)) {
            this.list.done.splice(this.list.done.indexOf(value), 1);
        } else if (this.list.outstanding?.includes(value)) {
            this.list.outstanding.splice(this.list.outstanding.indexOf(value), 1);
        }

        this.PersistState();
    }

    async AddItem(value: string): Promise<boolean> {
        var isOk: boolean = false;
        if (!this.list.outstanding?.includes(value)) {
            this.list.outstanding?.push(value);
            isOk = true;
        }

        if (this.list.done?.includes(value)) {
            this.list.done.splice(this.list.done.indexOf(value), 1);
        }

        this.PersistState();
        return isOk;
    }

    async GetList(listId: string): Promise<CheckList> {
        if (listId !== this.list.id) {
            throw new Error("List not found. Current list:" + this.list.id + ". Expected list: " + listId);
        }

        return this.list;
    }

    async SaveList(list: CheckList): Promise<CheckList> {
        // this.list.outstanding = list.outstanding ?? [];
        // this.list.done = list.done ?? [];
        // this.list.id = list.id;
        debugger;
        this.list = list;
        this.PersistState();

        return this.list;
    }

    PersistState(): void {
        // console.log(appState);
        // localStorage.setItem("Outstanding", JSON.stringify(this.outstanding));
        // localStorage.setItem("Done", JSON.stringify(this.done));
        // localStorage.setItem("listId", this.listId);
        this.list.timestamp=new Date();
        localStorage.setItem("list", JSON.stringify(this.list));
    }
}