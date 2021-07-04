export interface ListInput {
    listItems:string[];  
    onSelect:(value:string) =>void;
    onEdit:(value:string) =>void;
}
