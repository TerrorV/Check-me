import { Component } from "react";
import { EditItemState } from "./EditItemState";
import { CloseRounded, DeleteRounded, DoneRounded } from "@material-ui/icons";
import {ListsApiFactory, ListsApi,ListsApiFetchParamCreator, ItemsApi} from "./dal/api"
import { Configuration } from "./dal";

export class EditItemComponent extends Component<EditItemState, EditItemState> {
    constructor(props: EditItemState) {
        super(props);
        var tempState: EditItemState = props;
        if (props.onUpdate === undefined) {
            tempState.onUpdate = () => { };
        }

        if (props.onDelete === undefined) {
            tempState.onDelete = () => { };
        }

        if (props.onCancel === undefined) {
            tempState.onCancel = () => { };
        }

        this.DeleteItem = this.DeleteItem.bind(this);
        this.CancelItem = this.CancelItem.bind(this);
        this.UpdateItem = this.UpdateItem.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.state = tempState;
    }

    DeleteItem(): void {
        this.state.onDelete()
    }

    CancelItem(): void {
        console.log("cancel edit");
        this.state.onCancel();
    }

    onChange(e: React.FormEvent<HTMLInputElement>): void {
        console.log(e);
        console.log("on change");

        var tempState: EditItemState = {
            onCancel: this.state.onCancel,
            onDelete: this.state.onDelete,
            onUpdate: this.state.onUpdate,
            value: e.currentTarget.value
        };

        this.setState(tempState);
    }

    onKeyDown(): void {
        console.log("on key down");
    }

    UpdateItem(value: string) {
        console.log("update")
        this.state.onUpdate(value);
    }

    render() {
        return (
            <span className="edititem" >
                <div>{this.props.value}</div>
                <input className="edititem__input" id="edit-value-box" type="text" value={this.state.value} onChange={this.onChange} onKeyDown={this.onKeyDown} />
                <div className="edititem__buttons__row"><span className="edititem__button"  onClick={()=>this.UpdateItem(this.state.value)} ><DoneRounded/></span><span className="edititem__button" onClick={()=>this.DeleteItem()}><DeleteRounded /></span><span className="edititem__button" onClick={()=>this.CancelItem()}><CloseRounded /></span> </div>
            </span>
        );
    }
}