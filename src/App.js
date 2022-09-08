import { useEffect, useState,useLayoutEffect } from "react";
import { ethers } from "ethers";

import './App.css';
import studentFactory from './utils/StudentFactory.json'
import FormCreateStudentAccount from "./components/FormCreateStudentAccount";

function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [connEthers, setConnEthers] = useState();
  const [totalStudentsNumber,setTotalStudentsNumber] = useState(0);
  const [isLoggedIn,setIsLoggedIn] = useState(false);

  const studentContractAddress = "0xc41b42048a1D396e9d011edDCb822E04d30AFc66";
  const studentContractABI = studentFactory.abi ; 

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  function connectEthers() {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const studentContract = new ethers.Contract(
        studentContractAddress,
        studentContractABI,
        signer
      );
      setConnEthers(studentContract);
    } else {
      console.log("Ethereum object doesn't exist ");
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get Metamask");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log("Connected", [0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("error");
    }
  };


  const studentsNumber = async (conn) => {
    try {
      let studentContract = conn ;
      let currentLength = await studentContract.getStudentsLength();
      setTotalStudentsNumber(currentLength.toNumber());
    } catch (error) {
      console.log(error);
    }
  };

  const getStd = async (conn) => {
    try {
      let studentContract = conn ;
      const getStudent = await studentContract.getStudentById(0);
      console.log(getStudent);
    } catch (error) {
      console.log(error);
    }
  };

  const getStudentByAcc = async (conn) => 
  {
    try {
      let studentContract = conn ;
      const [id_,first,last,acc,mail]= await studentContract.getStudentByAccount(currentAccount);
      setIsLoggedIn(true);

    } catch (error) {
      setIsLoggedIn(false);
      console.log(error);
    }
  }

  useEffect(() => {
    currentAccount!=="" ?getStudentByAcc(connEthers): connectEthers();
  },[currentAccount])


  useLayoutEffect(() => {
    checkIfWalletIsConnected();
}, []);


  useEffect(() => {
    connectEthers();
  },[]);


  useEffect(() => {
    connEthers!==undefined ?studentsNumber(connEthers): connectEthers();
  },[connEthers,totalStudentsNumber]);

  useEffect(() => {
    connEthers!==undefined ?getStd(connEthers): connectEthers();
  },[connEthers]);


    return (
    <div className="App">
      <div>
      <p>
          students number : {totalStudentsNumber}
        </p>
        {!currentAccount && (
          <button className ="btn" onClick={connectWallet}>
            connect Wallet
          </button>
        )}
          { !isLoggedIn &&(
            <FormCreateStudentAccount currentAccount={currentAccount} setIsLoggedIn={setIsLoggedIn} connection={connEthers} studentsNumber={studentsNumber} />)
          }
        </div>
    </div>
  );
}

export default App;
