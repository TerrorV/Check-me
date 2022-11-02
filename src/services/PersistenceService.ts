import { CheckList, ItemsApi, ItemState, ListsApi } from "../dal/api";
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
                this.listsRepo.listsUpdateList(list.id,list);
                var tempList = await this.listsRepo.listsGetList(list.id);
                
                // if (tempList.timestamp > list.timestamp) {
                //     list = tempList;
                // } else {
                //     tempList = this.MergeLists(list, tempList);
                //     list=tempList;
                //     this.listsRepo.listsUpdateList(list.id,tempList);
                // }

               this.localRepo.SaveList(tempList);
            } catch (error) {
                console.log(error);
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
        } catch(ex) {
            console.log(ex);
            this.localRepo.SaveList(list);
        }

        return list;
    }

    SubscribeToList(listId: string, handleMessage: (message: any) => void, handleError: (message: any) => void): EventSource {
        return this.listsSubscribeToList(listId, handleMessage, handleError);
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
        this.itemsRepo.itemsUpdateItem(listId, value, ItemState.NUMBER_1).catch((ex)=>{this.AddItem(value,listId);this.HandleError(ex)});
        return this.localRepo.MakeOutstanding(value);
    }

    async AddItem(value: string, listId: string): Promise<boolean> {
        this.itemsRepo.itemsAddItem(listId, value).catch(this.HandleError);
        return this.localRepo.AddItem(value);
    }

    async MoveToDone(value: string, listId: string) {
        this.itemsRepo.itemsUpdateItem(listId, value,ItemState.NUMBER_2).catch(this.HandleError);
        return this.localRepo.MakeDone(value);
    }

    async DeleteItem(value: string, listId: string) {
        this.itemsRepo.itemsRemoveItem(listId, value).catch(this.HandleError);
        this.localRepo.DeleteItem(value);
    }

    async EditItem(oldValue: string, newValue: string, listId: string) {
        this.itemsRepo.itemsEditItem( listId, oldValue, newValue);
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

     /**
         * 
         * @param {string} listId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
      listsSubscribeToList(listId: string, messageCallback: any, errorCallback: any, options: any = {}): EventSource {
        // verify required parameter 'listId' is not null or undefined
        if (listId === null || listId === undefined) {
            throw new Error('Required parameter listId was null or undefined when calling listsGetList.');
        }
        const localVarPath = `/api/v1/Lists/{listId}/events`
            .replace(`{${"listId"}}`, encodeURIComponent(String(listId)));
        
        // // const localVarUrlObj = url.parse(localVarPath, true);
        // // const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
        // // const localVarHeaderParameter = {} as any;
        // // const localVarQueryParameter = {} as any;

        // // localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
        // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
        // // delete localVarUrlObj.search;
        // // localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

        var es = new EventSource(process.env.REACT_APP_API_HOST + localVarPath)
        es.onmessage = messageCallback;
        es.onerror = errorCallback;
        return es;
    }

}