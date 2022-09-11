import { useEffect, useState,useLayoutEffect } from "react";
import { ethers } from "ethers";

import './App.css';
import pathFactory from './utils/contracts/PathFactory.json' ; 
import Home from "./components/Home" ; 



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



  useEffect(() => {
    connPath!==undefined ?getPath(connPath): connectPath();
  },[connPath]);



    return (
      <Home/>
  );
}

export default App;
