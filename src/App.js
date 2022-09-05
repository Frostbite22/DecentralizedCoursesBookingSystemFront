import logo from './logo.svg';
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import './App.css';
import studentFactory from './utils/StudentFactory.json'

function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [connEthers, setConnEthers] = useState();

  const studentContractAddress = "0x7076842Da0B597642c71feE0B956f3a27c7F73F5";
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

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);


  useEffect(() => {
    connectWallet();
  }, []);


  useEffect(() => {
    connectEthers();
  }, []);



    return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
