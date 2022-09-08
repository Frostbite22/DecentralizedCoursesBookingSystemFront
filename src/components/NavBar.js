import { useEffect } from 'react';
import {BrowserRouter, Routes, Route, Link ,  useLocation,Outlet, useNavigate} from 'react-router-dom' ; 


function NavBar(props) 
{
  
  const titles = props.titles ;
  let navigate = useNavigate();
  // const location = useLocation(); 
  // props.setTitle(location.pathname);

  return(
    <div className="topnav">
      {
        titles.map((title) => {
        return <a key={title} onClick={() => {
          props.setTitle(title);
          navigate(title);
        }
        }>{title}</a>
        })
      }
      <a key="paths">paths</a>
      <a key="learning">my learning</a>
    </div>
    
  );
}
