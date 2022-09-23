import { useEffect, useState } from "react";
import { ethers } from "ethers";
import levelFactory from '../utils/contracts/LevelFactory.json' ; 
import studentLevelFactory from '../utils/contracts/StudentLevelFactory.json' ; 

import LoadingSpinner from "./LoadingSpinner";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function Levels({passedId,type})
{
    const [connStudentLevel, setConnStudentLevel] = useState();
    const studentLevelContractAddress = "0xF2803B2D7eA2078Da4D44E887dC1429437d17731" ; 
    const studentLevelContractABI = studentLevelFactory.abi ; 

    const [connLevel, setConnlevel] = useState();
    const levelContractAddress = "0x2c094862CDd298BB1ECBBb31e6924639Afc0C92c" ; 
    const levelContractABI = levelFactory.abi ; 

    const [levelsLength,setlevelsLength] = useState(0); 
    const [pathLevels, setPathLevels] = useState([]);
    const [levels, setLevels] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


  
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

    function connectStudentLevel() {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const studentLevelContract = new ethers.Contract(
          studentLevelContractAddress,
          studentLevelContractABI,
          signer
        );
  
        setConnStudentLevel(studentLevelContract); 
  
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
      setIsLoading(true);
      for(let i=0 ; i <levelsLength ; i++)
      {
        const [id,name,description,imgUrl,placesLeft,id_path] = await getLevel(conn,i) ;
        let level = [] ;
        level.push({"id": id, "name" : name, "description":description,"imgUrl":imgUrl,"placesLeft" :placesLeft,"id_path": id_path});
        setLevels(levels => [...levels,level] );
      }
      setIsLoading(false); 
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

    


    const createStdLvl = async (conn,level_id) => {
      try {
        setIsLoading(true);
        let studentLevelContract = conn ;
        console.log(conn)
        const stdToLevelTnx = await studentLevelContract.createStudentLevel(passedId,level_id,levelContractAddress);
        const stdToLvl = await stdToLevelTnx.wait(); 
        const eventStdToLvl = stdToLvl.events.find(event => event.event ==='studentLevelCreated');
        const [id,studentId,levelId] = eventStdToLvl.args ;
        console.log("student added to level "); 
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    useEffect(() => {
      connectLevel();
    },[]);

    useEffect(() => {
      connectStudentLevel();
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
          { isLoading ? <LoadingSpinner message={"Please wait"}/> : "" }
            {pathLevels.map((level) => {
              return(
                <div key={level['id']} className="levelInsideDiv" onClick={() => {navigate(`${level['id']}/sessions`)}}>
                  <div> {level['name']} - {level['description']}</div> 
                  <div className="divEl"> places left <span className="badge" >{level['placesLeft']}</span></div>
                  { type == "student" && <button className="btn" onClick={() => createStdLvl(connStudentLevel,level['id'])}>book now</button> }
                </div>
              )
            })}
        </div>
    )
}

export default Levels ; 