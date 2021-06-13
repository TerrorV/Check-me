import React from 'react';
import './App.css';

function ListItem(props:any) {
  var onClickMethod=props.onClick;
  if  (onClickMethod===undefined){
    onClickMethod=()=>{};
  }
  return (
    <div className="list-item" onClick={()=>{onClickMethod(props.input)}}>
      {props.input}
    </div>
  );
}

export default ListItem;
