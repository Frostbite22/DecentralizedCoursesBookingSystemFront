import { useEffect, useState } from "react";
import { ethers } from "ethers";
import levelFactory from '../utils/contracts/LevelFactory.json' ; 
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function Levels()
{
    const [connLevel, setConnlevel] = useState();
    //const levelContractAddress = "0xe55e33D0030c0aE4999b16F2E4cf92533930F18a" ; 
    const levelContractAddress = "0x0349b9032058bd51e259a20bEE55da094320d039" ; 
    const levelContractABI = levelFactory.abi ; 
    const [levels, setLevels] = useState([]);
    const [levelsLength,setlevelsLength] = useState(0); 
    const [pathLevels, setPathLevels] = useState([]);
  
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
        const [id,name,description,imgUrl,placesLeft,id_path] = await getLevel(conn,i) ;
        let level = [] ;
        level.push({"id": id, "name" : name, "description":description,"imgUrl":imgUrl,"placesLeft" :placesLeft,"id_path": id_path});
        setLevels(levels => [...levels,level] );
      }
    }
    let navigate = useNavigate() ;

    let params = useParams();

    function getLevelsByPathId(params)
    {
      let pathLvls = []; 
      let pathId = params.pathId ; 
      levels.map((levelC) => {
        levelC.map( (level) => {
          if(level.id_path == pathId)
          {
            pathLvls.push(level);
          }
        })
      })

      setPathLevels(pathLvls); 
    }

    useEffect(() => {
      connectLevel();
    },[]);
  
  
  
    useEffect(() => {
      connLevel!==undefined ?allLevels(connLevel): connectLevel();
    },[connLevel,levelsLength]);

    useEffect(() => {
      getLevelsByPathId(params);
    },[levels]);

    useEffect(() => {
      connLevel!==undefined ?getlevelsLength(connLevel): connectLevel();
    },[levelsLength,connLevel]);
  
    return (
        <div className="path">
            {pathLevels.map((level) => {
              return(
                <div key={level['id']} className="levelInsideDiv" onClick={() => {navigate(`${level['id']}/sessions`)}}>
                  <div> {level['name']} - {level['description']}</div> 
                  <div className="divEl"> places left <span className="badge" >{level['placesLeft']}</span></div>
                  <button className="btn">purchase</button>
                </div>
              )
            })}
        </div>
    )
}

export default Levels ; 