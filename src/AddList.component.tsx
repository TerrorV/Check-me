import { Component } from "react";
import { EditItemState } from "./EditItemState";
import { CloseRounded, DeleteRounded, DoneRounded } from "@material-ui/icons";
import { ListsApiFactory, ListsApi, ListsApiFetchParamCreator, ItemsApi } from "./dal/api"
import { Configuration } from "./dal";
import { AddListState } from "./AddListState";

export class AddListComponent extends Component<AddListState, AddListState> {
/**
 *
 */
constructor(props:AddListState) {
    super(props);
    this.onChange=this.onChange.bind(this);
    this.state = props;
}

onChange(e: React.FormEvent<HTMLInputElement>): void {
var tempState:AddListState ={
    onAccept:this.state.onAccept,
    onCancel:this.state.onCancel,
    value:e.currentTarget.value
};

this.setState(tempState);
}

    render() {
        return (
            <span className="edititem" >
                <input className="edititem__input" id="edit-value-box" type="text" value={this.state.value} onChange={this.onChange} />
                <div className="edititem__buttons__row"><span className="edititem__button" onClick={() => this.props.onAccept(this.state.value)} ><DoneRounded /></span><span className="edititem__button" onClick={() => this.props.onCancel()}><CloseRounded /></span> </div>
            </span>
        );
    }
}