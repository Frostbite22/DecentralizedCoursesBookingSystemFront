import LoadingSpinner from "./LoadingSpinner";
import { useEffect, useState,useLayoutEffect } from "react";
import { ethers } from "ethers";
import pathFactory from '../utils/contracts/PathFactory.json' ; 
import {useNavigate} from 'react-router-dom' ; 


function FormCreatePath()
{
    const [isLoading, setIsLoading] = useState(false);
    const [connPath, setConnPath] = useState();
    const pathContractAddress = "0xa120d22888ee93947eb93B4A1C3555B2fdc5B4dB" ; 
    const pathContractABI = pathFactory.abi ; 

    const navigate = useNavigate();

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

    async function handleCreatePath(event)
    {
      setIsLoading(true) ;
      event.preventDefault();
      let pathName = event.target.elements.pathName.value ;
      let description = event.target.elements.description.value ;
      let imageUrl = event.target.elements.imageUrl.value ;
        
      let pathContract = connPath ;
      const createPathTxn = await pathContract.createPath(pathName,description,imageUrl)
      const path = await createPathTxn.wait();
      const eventPath = path.events.find(event => event.event === 'pathCreated');
      const [id, name,desc,imgUrl] = eventPath.args;
      setIsLoading(false);
      navigate(-1);
      console.log(`created student with id ${id} pathName ${name} and description ${desc} with imgUrl ${imgUrl} `);

    }

     
    useEffect(() => {
        connectPath();
      },[]);

    
    return(
      <> 
     {isLoading && <LoadingSpinner message={"path is being created"} /> }
     <br></br>
        <form  onSubmit={handleCreatePath} className="formLayout" >
          <label htmlFor="pathName" >pathName
            <input type="text" id="pathName" />
          </label>
          <label htmlFor="description" >Description
            <input type="text" id="description" />
          </label>
          <label htmlFor="imageUrl" >imageUrl
            <input type="text" id="imageUrl" />
          </label>
  
          <input type="submit" value="create new path" className='btn'/>
        </form>
      </>
      )
  
}

export default FormCreatePath ; 