import { useEffect, useState } from "react";
import { ethers } from "ethers";
import pathFactory from '../utils/contracts/PathFactory.json' ; 


function Paths()
{
    const [connPath, setConnPath] = useState();
    const pathContractAddress = "0x739e90e2a472A583904f11A7daF7D17916dB4F9f" ; 
    const pathContractABI = pathFactory.abi ; 
    const [path, setPath] = useState();
  
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
        setPath(getPath);
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
        <div>
            {path}
        </div>
    )
}

export default Paths ; 