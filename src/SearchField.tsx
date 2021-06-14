import React, { Component } from 'react';
import { ListInput } from './ListInput';
import ListItem from './ListItem';
import { SearchInput } from './SearchInput';

type    SearchState = {
        searchTerm:string,
        state:ListInput,
        showList:boolean
}

export class SearchField extends Component<SearchInput, SearchState> {

        /**
         *
         */

        public parent1:SearchField = this;
        constructor(props: SearchInput) {
                super(props);
                this.state = {
                        searchTerm : "",
                        state : props,
                        showList:false
                }
        }

        onChange = (e:React.FormEvent<HTMLInputElement>):void => {
                console.log(e.currentTarget.value);
                //this.setState({showList:})

                var state: SearchState = {
                        searchTerm : e.currentTarget.value,
                        state : this.state.state,
                        showList:e.currentTarget.value !== ""
                };

                if(state.showList){
                        this.props.onOpen();
                }
                else{
                        this.props.onClose();
                }

                this.parent1.setState(state);
        }

        onBlure = (e:React.FormEvent<HTMLInputElement>):void => {
                //var searchBox:HTMLInputElement = document.getElementById("search-box") as HTMLInputElement;

                this.setState({showList:this.state.searchTerm !== ""})
                if(!this.state.showList){
                        this.props.onClose();
                }
        }

        onKeyDown = (e:React.KeyboardEvent):void=>{
                console.log(e)
                console.log("Show list:" + this.state.showList)
                if (e.key==="Enter") {
                        this.props.onSelect(this.state.searchTerm);
                        this.props.onClose();
                        var state: SearchState = {
                                searchTerm : "",
                                state : this.state.state,
                                showList:this.state.showList
                        };
        
                        this.parent1.setState(state);
                        var searchBox:HTMLInputElement = document.getElementById("search-box") as HTMLInputElement;
                        searchBox.value="";
                        console.log(searchBox);
                }

                console.log(this.state.searchTerm !== "");
                //this.setState({showList:this.state.searchTerm !== ""})
        }   

        // const SearchField:React.FC<ListInput>=({children,listItems})=> (
        render() {
                // const mystyle = { textDecoration: "line-through" };

                return (<div>
                        <div>
                        <input className="main__search_input" id="search-box" type="text" onChange={this.onChange} onKeyDown={this.onKeyDown} onFocus={()=>{}} onBlur={this.onBlure} />
                        </div>
                        <span className="main__search">
                          
                        {
                                this.state.showList?this.state.state.listItems.filter(x=>x.toLowerCase().includes(this.state.searchTerm.toLowerCase())).map((i)=><ListItem key={i.toString()} input={i} onClick={()=>{console.log("search click");this.props.onSelect(i);this.setState({showList:false})}} />): null
                        }
                        </span>
                </div>
                );
        }
}
// export default SearchField;

