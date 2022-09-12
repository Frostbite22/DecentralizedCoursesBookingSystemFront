import { useEffect, useState } from "react";
import { ethers } from "ethers";
import pathFactory from '../utils/contracts/PathFactory.json' ; 


function Paths()
{
    const [connPath, setConnPath] = useState();
    const pathContractAddress = "0x739e90e2a472A583904f11A7daF7D17916dB4F9f" ; 
    const pathContractABI = pathFactory.abi ; 
    const [path, setPath] = useState();
    const [pathsLength,setPathsLength] = useState(0); 
  
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
  
  
  
    const getPathsLength = async (conn) => {
      try {
        let pathContract = conn ;
        const currentLength = await pathContract.getCurrentId();
        setPathsLength(currentLength);
        console.log(currentLength);
      } catch (error) {
        console.log(error);
      }
    };

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

    useEffect(() => {
      connPath!==undefined ?getPathsLength(connPath): connectPath();
    },[pathsLength,connPath]);
  
    return (
        <div>
            {path} - {pathsLength}
        </div>
    )
}

export default Paths ; 