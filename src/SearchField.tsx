import React, { Component } from 'react';
import { ListInput } from './ListInput';
import ListItem from './ListItem';
import { SearchInput } from './SearchInput';

type    SearchState = {
        searchTerm:string,
        state:ListInput
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
                        state : props 
                }
        }

        onChange = (e:React.FormEvent<HTMLInputElement>):void => {
                var state: SearchState = {
                        searchTerm : e.currentTarget.value,
                        state : this.state.state
                };

                this.parent1.setState(state);

        }

        onKeyDown = (e:any):void=>{
                console.log(e)
                if (e.keyCode===13) {
                        this.props.onSelect(this.state.searchTerm);
                        var state: SearchState = {
                                searchTerm : "",
                                state : this.state.state
                        };
        
                        this.parent1.setState(state);
                        var searchBox:HTMLInputElement = document.getElementById("search-box") as HTMLInputElement;
                        searchBox.value="";
                        console.log(searchBox);
                }

        }

        

        // const SearchField:React.FC<ListInput>=({children,listItems})=> (
        render() {
                return (<div>
                        <input id="search-box" type="text" onChange={this.onChange} onKeyDown={this.onKeyDown}/>
                        {
                          
                          this.state.state.listItems.filter(x=>x.includes(this.state.searchTerm)).map((i)=><ListItem key={i.toString()} input={i} />)
                        }

                        {/* {this.state.state.listItems[0]} */}
                </div>
                );
        }
}
// export default SearchField;

