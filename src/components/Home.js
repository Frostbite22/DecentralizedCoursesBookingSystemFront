import FormCreateStudentAccount from "./FormCreateStudentAccount";
import Profile from "./Profile";
import NavBar from "./NavBar";
import checkIfWalletIsConnected from "../utils/functions/checkWallet";
import connectWallet from "../utils/functions/checkWallet";
import studentFactory from '../utils/contracts/StudentFactory.json';
import { useEffect, useState,useLayoutEffect } from "react";
import { ethers } from "ethers";
import {BrowserRouter, Routes, Route, Link ,  useLocation,Outlet, useNavigate} from 'react-router-dom' ; 
import background from '../welcome.jpg' ; 
import Paths from "./Paths";
import Levels from "./Levels";
import Sessions from "./Sessions";
import MyLearning from "./MyLearning";
import Admin from "./Admin";
import Student from "./Student";

function Home()
{   
const [currentAccount, setCurrentAccount] = useState("");
const [firstName,setFirstName] = useState("");
const [lastName,setLastName] = useState("");
const [email,setEmail] = useState("");
const [id,setId] = useState("");


      return (
        <BrowserRouter>
        <Routes>
          <Route path="student" element={
            <Student setCurrentAccountLanding={setCurrentAccount} setFirstNameLanding={setFirstName} setIdLanding={setId}
            setEmailLanding={setEmail} setLastNameLanding={setLastName} />
          }>
            <Route index element={
            <img className='background' alt="background" src={background} />} />
            <Route path="profile" element={
            <Profile account={currentAccount} firstName={firstName} lastName={lastName} email={email} />}/>
            <Route path="paths" element={<Paths/>} />
            <Route path="learning" element={<MyLearning std_id={id} />} />
            <Route path="paths/:pathId/levels" element={<Levels std_id={id} />}/>
            <Route path="paths/:pathId/levels/:levelId/sessions" element={<Sessions/>}/>
          </Route>
          <Route path="admin" element={<Admin />} />

        

        </Routes>
      </BrowserRouter>

      );
}

export default Home ; 