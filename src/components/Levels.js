import { useEffect, useState } from "react";
import { ethers } from "ethers";
import levelFactory from '../utils/contracts/LevelFactory.json' ; 


function Levels()
{
    const [connLevel, setConnlevel] = useState();
    const levelContractAddress = "0xe55e33D0030c0aE4999b16F2E4cf92533930F18a" ; 
    const levelContractABI = levelFactory.abi ; 
    const [levels, setLevels] = useState([]);
    const [levelsLength,setlevelsLength] = useState(0); 
  
    function connectLevel() {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const levelContract = new ethers.Contract(
          levelContractAddress,
          levelContractABI,
          signer
        );
  
        setConnlevel(levelContract); 
  
      } else {
        console.log("Ethereum object doesn't exist ");
      }
    }
  
  
  
    const getlevelsLength = async (conn) => {
      try {
        let levelContract = conn ;
        const currentLength = await levelContract.getCurrentId();
        setlevelsLength(currentLength);
      } catch (error) {
        console.log(error);
      }
    };

    const getLevel = async (conn,index) => {
      try {
        let levelContract = conn ;
        const getlevel = await levelContract.getLevelById(index);
        return getlevel ;
      } catch (error) {
        console.log(error);
      }
    };

    const allLevels = async (conn) => {
      for(let i=0 ; i <levelsLength ; i++)
      {
        const [id,name,description,imgUrl,id_path] = await getLevel(conn,i) ;
        let level = [] ;
        level.push({"id": id, "name" : name, "description":description,"imgUrl":imgUrl,"id_path": id_path});
        setLevels(levels => [...levels,level] );
      }
    }
  
  
    useEffect(() => {
      connectLevel();
    },[]);
  
  
  
    useEffect(() => {
      connLevel!==undefined ?allLevels(connLevel): connectLevel();
    },[connLevel,levelsLength]);

    useEffect(() => {
      connLevel!==undefined ?getlevelsLength(connLevel): connectLevel();
    },[levelsLength,connLevel]);
  
    return (
        <div className="path">
            {levels.map((levelContainer) => {
              return(
                levelContainer.map((level,index) => {
                  return(
                    <div key={level['id']} className="pathInsideDiv"> {level['name']} - {level['description']} </div>
                  )
                })
              )
            })}
        </div>
    )
}

export default Levels ; 