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
import '../index.css';


function Student()
{   
    const [currentAccount, setCurrentAccount] = useState("");
    const [connStudent, setConnStudent] = useState();
    const studentContractAddress = "0xc41b42048a1D396e9d011edDCb822E04d30AFc66";
    const studentContractABI = studentFactory.abi ; 
    const [isLoggedIn,setIsLoggedIn] = useState(false);

    const [totalStudentsNumber,setTotalStudentsNumber] = useState(0);



    function connectStudent() 
    {
        const { ethereum } = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const studentContract = new ethers.Contract(
            studentContractAddress,
            studentContractABI,
            signer
        );

        setConnStudent(studentContract);
        } 
        else 
        {
            console.log("Ethereum object doesn't exist ");
        }
    }


const [firstName,setFirstName] = useState("");
const [lastName,setLastName] = useState("");
const [email,setEmail] = useState("");


const getStudentByAcc = async (connStudent) => 
  {
    try {
      let studentContract = connStudent ;
      const [id_,first,last,acc,mail]= await studentContract.getStudentByAccount(currentAccount);
      setFirstName(first);
      setLastName(last);
      setEmail(mail);
      setIsLoggedIn(true);

    } catch (error) {
      setIsLoggedIn(false);
      console.log(error);
    }
  }

  useEffect(() => {
    currentAccount!=="" ?getStudentByAcc(connStudent): connectStudent();
  },[currentAccount])


    const studentsNumber = async (conn) => {
        try {
          let studentContract = conn ;
          let currentLength = await studentContract.getStudentsLength();
          setTotalStudentsNumber(currentLength.toNumber());
        } catch (error) {
          console.log(error);
        }
      };

    useEffect(() => {
    connStudent!==undefined ?studentsNumber(connStudent): connectStudent();
    },[connStudent,totalStudentsNumber]);





    useLayoutEffect(() => {
        checkIfWalletIsConnected(setCurrentAccount);
    }, []);

    useEffect(() => {
        connectStudent();
      },[]);

      return (
        <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <div className="App">
            <div>
              { !isLoggedIn &&(
                <FormCreateStudentAccount currentAccount={currentAccount} setIsLoggedIn={setIsLoggedIn} connection={connStudent} studentsNumber={studentsNumber} />)
              }
              {
                isLoggedIn && (
                  <div>
                    <NavBar firstName={firstName}/>
                    <Outlet/>
                  </div>
                )
              }
              {!currentAccount && (
              <button className ="btn" onClick={() => connectWallet(setCurrentAccount)}>
                connect Wallet
              </button>
              )}
            </div>
            </div>
          }>
            <Route index element={
            <img className='background' alt="background" src={background} />} />
            <Route path="profile" element={
            <Profile account={currentAccount} firstName={firstName} lastName={lastName} email={email} />}/>


          </Route>
        

        </Routes>
      </BrowserRouter>

      );
}

export default Student ; 