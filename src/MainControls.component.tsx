import { AddCircleRounded, CloseRounded, CloudDownload, DeleteRounded, DoneRounded, PostAddRounded, SyncRounded } from '@material-ui/icons';
import React from 'react';
import './App.css';
import { MainControlsState } from './MainControlsState';

function MainControls(props:MainControlsState) {
//   var onClickMethod=props.onClick;
//   if  (onClickMethod===undefined){
//     onClickMethod=()=>{};
//   }

  return (
    <div className="main__buttons__row">
      <span className="main__button"  onClick={props.onAddExisting} ><CloudDownload/></span>
      <span className="main__button" onClick={props.onSync}><SyncRounded /></span>
      <span className="main__button" onClick={props.onNew}><AddCircleRounded /></span>
      <span className="main__button" onClick={props.onDelete}><DeleteRounded /></span> </div>
  );
}

export default MainControls;
