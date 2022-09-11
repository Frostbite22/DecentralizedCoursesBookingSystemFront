import { useEffect, useState,useLayoutEffect } from "react";
import { ethers } from "ethers";
import {BrowserRouter, Routes, Route, Link ,  useLocation,Outlet, useNavigate} from 'react-router-dom' ; 

import './App.css';
import studentFactory from './utils/contracts/StudentFactory.json';
import pathFactory from './utils/contracts/PathFactory.json' ; 
import checkIfWalletIsConnected from "./utils/functions/checkWallet";
import connectWallet from "./utils/functions/checkWallet";
import FormCreateStudentAccount from "./components/FormCreateStudentAccount";
import NavBar from "./components/NavBar";
import Profile from "./components/Profile";
import background from './welcome.jpg';

import Student from "./components/Student" ; 



function App() {



  const [connPath, setConnPath] = useState();
  const pathContractAddress = "0x739e90e2a472A583904f11A7daF7D17916dB4F9f" ; 
  const pathContractABI = pathFactory.abi ; 


  function connectPath() {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const pathContract = new ethers.Contract(
        pathContractAddress,
        pathContractABI,
        signer
      );

      setConnPath(pathContract); 

    } else {
      console.log("Ethereum object doesn't exist ");
    }
  }



  const getPath = async (conn) => {
    try {
      let pathContract = conn ;
      const getPath = await pathContract.getPathById(0);
      console.log(getPath);
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    connectPath();
  },[]);


  // useEffect(() => {
  //   connStudent!==undefined ?studentsNumber(connStudent): connectEthers();
  // },[connStudent,totalStudentsNumber]);

  // useEffect(() => {
  //   connStudent!==undefined ?getStd(connStudent): connectEthers();
  // },[connStudent]);

  // useEffect(() => {
  //   connPath!==undefined ?getPath(connPath): connectEthers();
  // },[connPath]);



    return (
      <Student/>
  );
}

export default App;
