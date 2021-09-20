import { CheckList, Configuration, ItemsApi, ListsApi } from "./dal";

export function syncList(listId: string) {
    console.log("Worker list id:" + listId);
    throw JSON.stringify({data:"Worker list id:" + listId})
    // , callback: (list: CheckList) => void
    var config = new Configuration();
    config.basePath = process.env.REACT_APP_API_HOST;
    var listsRepo = new ListsApi(config, config.basePath);
    //var itemsRepo = new ItemsApi(config, config.basePath);
    while (true) {
        listsRepo.listsGetList(listId).then(x =>  console.log(x)).catch(e => console.log("asdasd"));
        setTimeout(() => { }, 30000);
    }

    //callback("awdasd");
}