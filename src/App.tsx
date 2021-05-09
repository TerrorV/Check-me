import React from 'react';
import logo from './logo.svg';
import './App.css';
import { SearchField } from './SearchField';
import { ListComponent } from './List.component';
import { MainComponent } from './Main.component';

function App() {

  
  var items:string[]=["asd"];
  var style1:any = {'white-space': 'nowrap' };
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
      <header className="App-header" >
        <span>

      {/* <ListItem input="hhbvggg"/> */}
      <span style={style1}>
      {/* <SearchField listItems={items} onSelect={ItemSelected} /> */}
      <MainComponent listItems={items} onSelect={()=>{}} />
      </span>
      {/* <ListComponent listItems={items}></ListComponent> */}
      {/* <ListComponent listItems={items}></ListComponent> */}

      {/* <ListItem input="hhbvggg"/> */}
      <span>
      {/* <ListComponent listItems={items}></ListComponent>  */}

      </span>
      </span>

      {/* <ListComponent listItems={items}></ListComponent> */}
      </header>

    </div>
  );
}

export default App;
