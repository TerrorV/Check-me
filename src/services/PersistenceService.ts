import { CheckList, ItemsApi, ListsApi } from "../dal/api";
import { LocalStorageRepo } from "../dal/LocalStorageRepo";

export class PersistenceService {
    private listsRepo: ListsApi;
    private itemsRepo: ItemsApi;
    private localRepo: LocalStorageRepo;
    constructor(listsRepo: ListsApi, itemsRepo: ItemsApi, localRepo: LocalStorageRepo) {
        this.listsRepo = listsRepo;
        this.itemsRepo = itemsRepo;
        this.localRepo = localRepo;
    }


    async InitList(): Promise<CheckList> {
        var list: CheckList = { outstanding: [], done: [], id: "", timestamp: new Date() };
        try {
            list = await this.localRepo.GetCurrentList();
        } catch (error) {
            console.log(error);
        }

        if (list.id === "") {
            list = await this.CreateNewList(list);
            // this.CreateNewList("00000000-0000-0000-0000-000000000000", list.outstanding, list.done);
        } else {
            try {
                var tempList = await this.listsRepo.listsGetList(list.id);
                if (tempList.timestamp > list.timestamp) {
                    list = tempList;
                } else {
                    list = this.MergeLists(list, tempList);
                }
            } catch (error) {

            }
        }

        return list
    }
    async CreateNewList(list: CheckList): Promise<CheckList> {
        try {
            list = await this.listsRepo.listsCreateList(
                {
                    id: "00000000-0000-0000-0000-000000000000",
                    outstanding: list.outstanding,
                    done: list.done,
                    timestamp: new Date()
                });

            this.localRepo.SaveList(list);
        } catch {
            this.localRepo.SaveList(list);
        }

        return list;
    }

    SubscribeToList(listId: string, handleMessage: (message: any) => void, handleError: (message: any) => void): EventSource {
        return this.listsRepo.listsSubscribeToList(listId, handleMessage, handleError);
    }

    async GetCurrentList(): Promise<CheckList> {
        return this.localRepo.GetCurrentList();
    }

    async GetList(listId: string): Promise<CheckList> {
        return this.listsRepo.listsGetList(listId).then(x => this.localRepo.SaveList(x)).catch(x => this.localRepo.GetList(listId));
    }

    async SaveList(list: CheckList): Promise<CheckList> {
        this.listsRepo.listsCreateList(list).catch(this.HandleError);
        return this.localRepo.SaveList(list);
    }

    async MoveToOutstanding(value: string, listId: string): Promise<boolean> {
        this.itemsRepo.itemsUpdateItem(1, listId, value).catch(this.HandleError);
        return this.localRepo.MakeOutstanding(value);
    }

    async AddItem(value: string, listId: string): Promise<boolean> {
        this.itemsRepo.itemsAddItem(value, listId).catch(this.HandleError);
        return this.localRepo.AddItem(value);
    }

    async MoveToDone(value: string, listId: string) {
        this.itemsRepo.itemsUpdateItem(2, listId, value).catch(this.HandleError);
        return this.localRepo.MakeDone(value);
    }

    async DeleteItem(value: string, listId: string) {
        this.itemsRepo.itemsRemoveItem(listId, value).catch(this.HandleError);
        this.localRepo.DeleteItem(value);
    }

    async EditItem(oldValue: string, newValue: string, listId: string) {
        this.itemsRepo.itemsEditItem(newValue, listId, oldValue);
        this.localRepo.EditItem(oldValue, newValue);
    }

    HandleError(message: any) {
        console.trace(message);
        console.log(message);
        console.log(message.stack);
    }


    MergeLists(list1: CheckList, list2: CheckList): CheckList {
        var temp: CheckList = { outstanding: [], done: [], id: list1.id, timestamp: new Date() };
        var words: Map<string, boolean> = new Map<string, boolean>();
        for (const item of list1.outstanding ?? []) {
            words.set(item, false);
        }

        for (const item of list1.done ?? []) {
            words.set(item, true);
        }

        for (const item of list2.outstanding ?? []) {
            if (!words.has(item)) {
                words.set(item, false);
            }
        }

        for (const item of list1.done ?? []) {
            if (!words.has(item)) {
                words.set(item, true);
            }
        }

        words.forEach((v, k) => {
            if (v) {
                temp.done?.push(k);
            } else {
                temp.outstanding?.push(k);
            }
        });

        return temp;
    }

}