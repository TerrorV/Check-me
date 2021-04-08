import React from 'react';
import { ListInput } from './ListInput';
import ListItem from './ListItem';

// const SearchField:React.FC<ListInput>=({children,listItems})=> (
function SearchField(input:ListInput){
        return(<div>
                 <input type="text" />
        {/* {input.listItems.filter(x=>x.startsWith()).map((i)=><ListItem key={i.toString()} input={i} />)} */}

        {input.listItems[0]}
        </div>
        );
}


export default SearchField;