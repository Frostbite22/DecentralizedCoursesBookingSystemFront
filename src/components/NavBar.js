import { useEffect } from 'react';
import {BrowserRouter, Routes, Route, Link ,  useLocation,Outlet, useNavigate} from 'react-router-dom' ; 


function NavBar(props) 
{
  
  let navigate = useNavigate();

  return(
    <div className="topnav">
        <div className='left'>
            <a key="paths">paths</a>
            <a key="learning">my learning</a>
        </div>
        <div className='right'>
            <a key={props.firstName} onClick={() => {navigate("profile")}}>{props.firstName} profile</a>
        </div>
    </div>
    
  );
}

export default NavBar ; 