import React from 'react';
import logo from './logo.svg';
import './App.css';
import { SearchField } from './SearchField';

function App() {

  var items:string[]=["asd"];
  // var items:string[]=["asd","qwe","123","asf","asdf","asdfg","afgh","1654","qw1"];
  function ItemSelected(value:string) {
    console.log(value);
    if (!items.includes(value)){
      items.push(value);
    }
  }
  //var input:ListInput= {listItems:items}
  return (
    <div className="App">
      <header className="App-header">
      {/* <ListItem input="hhbvggg"/> */}
      <SearchField listItems={items} onSelect={ItemSelected} />
      {/* <ListComponent listItems={items}></ListComponent> */}
      {/* <ListComponent listItems={items}></ListComponent> */}
      </header>
    </div>
  );
}

export default App;
