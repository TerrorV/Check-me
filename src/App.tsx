import React from 'react';
import logo from './logo.svg';
import './App.css';
import ListItem from './ListItem';
import { ListComponent } from './List.component';
import SearchField from './SearchField';
import { ListInput } from './ListInput';

function App() {

  var items:string[]=["asd","qwe","123"];
  //var input:ListInput= {listItems:items}
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      <ListItem input="hhbvggg"/>
      <SearchField listItems={items} />
      <ListComponent listItems={items}></ListComponent>
      </header>
    </div>
  );
}

export default App;
