import { useEffect, useState } from "react";
import { ethers } from "ethers";
import pathFactory from '../utils/contracts/PathFactory.json' ; 
import { useNavigate } from "react-router-dom";


function Paths()
{
    const [connPath, setConnPath] = useState();
    const pathContractAddress = "0x739e90e2a472A583904f11A7daF7D17916dB4F9f" ; 
    const pathContractABI = pathFactory.abi ; 
    const [paths, setPaths] = useState([]);
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
      } catch (error) {
        console.log(error);
      }
    };

    const getPath = async (conn,index) => {
      try {
        let pathContract = conn ;
        const getPath = await pathContract.getPathById(index);
        return getPath ;
      } catch (error) {
        console.log(error);
      }
    };

    const allPaths = async (conn) => {
      for(let i=0 ; i <pathsLength ; i++)
      {
        const [id,name,description,imgUrl] = await getPath(conn,i) ;
        let path = [] ;
        path.push({"id": id, "name" : name, "description":description,"imgUrl":imgUrl});
        setPaths(paths => [...paths,path] );
      }
    }

    let navigate = useNavigate() ;
   
  
    useEffect(() => {
      connectPath();
    },[]);
  
  
  
    useEffect(() => {
      connPath!==undefined ?allPaths(connPath): connectPath();
    },[connPath,pathsLength]);

    useEffect(() => {
      connPath!==undefined ?getPathsLength(connPath): connectPath();
    },[pathsLength,connPath]);
  
    return (
        <div className="path">
            {paths.map((pathContainer) => {
              return(
                pathContainer.map((path,index) => {
                  return(
                    <div key={path['id']} className="pathInsideDiv" onClick={() => {navigate(`${path['id']}/levels`)}}> {path['name']} - {path['description']} </div>
                  )
                })
              )
            })}
        </div>
    )
}

export default Paths ; 