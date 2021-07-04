export interface EditItemState {
    value:string;
    onDelete:() =>void;
    onUpdate:(value:string) =>void;
    onCancel:() =>void;
}