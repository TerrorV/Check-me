import { CloseRounded, DeleteRounded, DoneRounded } from '@material-ui/icons';
import React from 'react';
import './App.css';

function MainControls(props:any) {
//   var onClickMethod=props.onClick;
//   if  (onClickMethod===undefined){
//     onClickMethod=()=>{};
//   }

  return (
    <div className="edititem__buttons__row"><span className="edititem__button"  onClick={()=>console.log("button 1")} ><DoneRounded/></span><span className="edititem__button" onClick={()=>console.log("button 2")}><DeleteRounded /></span><span className="edititem__button" onClick={()=>console.log("button 3")}><CloseRounded /></span> </div>
  );
}

export default MainControls;
