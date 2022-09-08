import { useEffect } from 'react';
import {BrowserRouter, Routes, Route, Link ,  useLocation,Outlet, useNavigate} from 'react-router-dom' ; 


function NavBar(props) 
{
  
  let navigate = useNavigate();

  return(
    <div className="topnav">
      <a key="paths">paths</a>
      <a key="learning">my learning</a>
    </div>
    
  );
}

export default NavBar ; 