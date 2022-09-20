import { useEffect, useState } from "react";
import { ethers } from "ethers";
import studentLevelFactory from '../utils/contracts/StudentLevelFactory.json' ; 
import levelFactory from '../utils/contracts/LevelFactory.json' ; 

import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function MyLearning({std_id})
{
    const [connStudentLevel, setConnStudentLevel] = useState();
    const studentLevelContractAddress = "0x4c895A941F39b5BF9B300D305c8D3482152C368B" ; 
    const studentLevelContractABI = studentLevelFactory.abi ; 
    const [stdLevelsIds,setStdLevelsIds] = useState([]) ; 
    const [studentLevels,setStudentLevels] = useState([]);

    const [connLevel, setConnlevel] = useState();
    const levelContractAddress = "0x6883dA174e6F4232e9Ffe2d514c1922B650d5670" ; 
    const levelContractABI = levelFactory.abi ; 


    let navigate = useNavigate() ;

    let params = useParams();


    function connectStudentLevel() {
      const { ethereum } = window;
        if(ethereum) {
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

    const getStudentLevelsId = async (conn) => {
        try {
          let studentLevelContract = conn ;
          const std_level_ids = await studentLevelContract.getStudentLevelsId(std_id);
          setStdLevelsIds(std_level_ids);
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
  
      const allStudentLevels = async (conn) => {
        for(let i=0 ; i <stdLevelsIds.length ; i++)
        {
          console.log(stdLevelsIds[i])
          const [id,name,description,imgUrl,placesLeft,id_path] = await getLevel(conn,stdLevelsIds[i]) ;
          let level = [] ;
          level.push({"id": id, "name" : name, "description":description,"imgUrl":imgUrl,"placesLeft" :placesLeft,"id_path": id_path});
          setStudentLevels(studentLevels => [...studentLevels,level] );
        }
        console.log(studentLevels)
      }
  
      useEffect(() => {
        connectLevel();
      },[]);


    useEffect(() => {
      stdLevelsIds == [] ? getStudentLevelsId(connStudentLevel) : allStudentLevels(connLevel)
    },[stdLevelsIds])

    useEffect(() => {
      connStudentLevel == undefined ? connectStudentLevel() : getStudentLevelsId(connStudentLevel)
    },[connStudentLevel])


    useEffect(() => {
      connectStudentLevel();
    },[]);

  
    return (
        <div className="path">
            {studentLevels.map((level) => {
              return(
                <div key={level['id']} className="levelInsideDiv" onClick={() => {navigate(`${level['id']}/sessions`)}}>
                  <div> {level['name']} - {level['description']}</div> 
                </div>
              )
            })}
        </div>
    )
}

export default MyLearning ; 