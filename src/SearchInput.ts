// https://www.benmvp.com/blog/react-prop-types-with-typescript/

export interface SearchInput {

    listItems:string[];

    onSelect:(value:string) =>void;
    onOpen:() =>void;
    onClose:() =>void;
}
