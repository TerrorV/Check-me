import React from 'react';
import './App.css';

function ListItem(input:any,evt:any) {
  return (
    <div onClick={()=>{console.log(evt)}}>
      {input.input}
    </div>
  );
}

export default ListItem;
