import { timeStamp } from "console";
import { Component } from "react";
import { ListInput } from "./ListInput";
import ListItem from "./ListItem";

interface IState{
    listItems: string[]
}

interface IProps{
    listItems: string[]
}
export class TempComponent extends Component<IProps,IState> {
/**
 *
 */
constructor(props:IProps) {
    super(props);
    console.log("Temp Component");
    console.log(props);
    this.onChange=this.onChange.bind(this);
    // this.state = {
    //         listItems: props.listItems
    // }      
}

onChange(e: React.FormEvent<HTMLInputElement>): void {
// var tempState:ListInput ={
//     listItems: this.state.listItems,
//     onEdit:this.state.onEdit,
//     onSelect:this.state.onSelect,
//     reverse:this.state.reverse
// };

// this.setState(tempState);
}

    render() {
        return (
            this.props.listItems.map((i) => <ListItem input={i} /> )
        );
    }
}