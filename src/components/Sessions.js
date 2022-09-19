import { useEffect, useState } from "react";
import { ethers } from "ethers";
import sessionFactory from '../utils/contracts/SessionFactory.json' ; 
import { useParams } from "react-router-dom";


function Sessions()
{
    const [connSession, setConnSession] = useState();
    //const sessionContractAddress = "0x55792a70a58be33077eaB599344390d8c2d47916" ; 
    const sessionContractAddress = "0x5EE3aCb8e46c170ddF1e58eE1475448cDBDA582a" ; 

    const sessionContractABI = sessionFactory.abi ; 
    const [sessions, setSessions] = useState([]);
    const [sessionsLength,setSessionsLength] = useState(0); 
    const [levelSessions, setLevelSessions] = useState([]);
  
    function connectSession() {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const sessionContract = new ethers.Contract(
          sessionContractAddress,
          sessionContractABI,
          signer
        );
  
        setConnSession(sessionContract); 
  
      } else {
        console.log("Ethereum object doesn't exist ");
      }
    }
  
  
  
    const getSessionsLength = async (conn) => {
      try {
        let sessionContract = conn ;
        const currentLength = await sessionContract.getCurrentId();
        setSessionsLength(currentLength);
      } catch (error) {
        console.log(error);
      }
    };

    const getSession = async (conn,index) => {
      try {
        let sessionContract = conn ;
        const getSession = await sessionContract.getSessionById(index);
        return getSession ;
      } catch (error) {
        console.log(error);
      }
    };

    const allSessions = async (conn) => {
      for(let i=0 ; i <sessionsLength ; i++)
      {
        const [id,name,date,levelId] = await getSession(conn,i) ;
        let session = [] ;
        const response_date = new Date(date*1000);
        console.log(response_date)

        session.push({"id": id,"name": name, "date" : response_date,"levelId": levelId});
        setSessions(sessions => [...sessions,session] );
      }
    }

    let params = useParams();

    function getSessionsByLevelId(params)
    {
      let lvlSessions = []; 
      let levelId = params.levelId ; 
      sessions.map((sessionC) => {
        sessionC.map( (session) => {
          if(session.id == levelId)
          {
            console.log(session)
            lvlSessions.push(session);
          }
        })
      })
      setLevelSessions(lvlSessions); 
    }

    useEffect(() => {
      connectSession();
    },[]);
  
  
  
    useEffect(() => {
      connSession!==undefined ?allSessions(connSession): connectSession();
    },[connSession,sessionsLength]);

    useEffect(() => {
        getSessionsByLevelId(params);
    },[sessions]);

    useEffect(() => {
      connSession!==undefined ?getSessionsLength(connSession): connectSession();
    },[sessionsLength,connSession]);
  
    return (
        <div className="path">
            {levelSessions.map((session) => {
              return(
                <div key={session['id']} className="pathInsideDiv"> {session['name']} - {session['date']} </div>
              )
            })}
        </div>
    )
}

export default Sessions ; 