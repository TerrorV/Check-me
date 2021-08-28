export interface AddListState {
    value:string;
    onAccept:(value:string) =>void;
    onCancel:() =>void;
}