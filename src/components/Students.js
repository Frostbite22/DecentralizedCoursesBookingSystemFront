import { useEffect, useState } from "react";
import { ethers } from "ethers";
import studentFactory from '../utils/contracts/StudentFactory.json' ; 
import { useNavigate ,Link} from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";


function Students()
{

    const [connStudent, setConnStudent] = useState();
    const studentContractAddress = "0xf92BB0b251E13575Ce746869Af7EC2A62B906A98" ; 

    const studentContractABI = studentFactory.abi ; 
    const [students, setStudents] = useState([]);
    const [studentsLength,setStudentsLength] = useState(0); 
    const [isLoading, setIsLoading] = useState(false);

  
    function connectStudent() {
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
  
      } else {
        console.log("Ethereum object doesn't exist ");
      }
    }
  
  
  
    const getStudentsLength = async (conn) => {
      try {
        let studentContract = conn ;
        const currentLength = await studentContract.getStudentsLength();
        setStudentsLength(currentLength.toNumber());
      } catch (error) {
        console.log(error);
      }
    };

    const getStudent = async (conn,index) => {
      try {
        let studentContract = conn ;
        const getStudent = await studentContract.getStudentById(index);
        return getStudent ;
      } catch (error) {
        console.log(error);
      }
    };

    const allStudents = async (conn) => {
      setIsLoading(true);
      for(let i=0 ; i <studentsLength ; i++)
      {
        const [id,firstName,lastName,account,email] = await getStudent(conn,i) ;
        let student = [] ;
        student.push({"id": id, "firstName" : firstName,"lastName" : lastName, "account" : account,"email" : email });
        setStudents(students => [...students,student] );
      }
      setIsLoading(false);
    }

    let navigate = useNavigate() ;
   
  
    useEffect(() => {
      connectStudent();
    },[]);
  
  
  
    useEffect(() => {
      studentsLength!==0 ?allStudents(connStudent): connectStudent();
    },[studentsLength]);

    useEffect(() => {
        connStudent!==undefined ?getStudentsLength(connStudent): connectStudent();
    },[studentsLength,connStudent]);
  
    return (
      <>
        <div className="path">
            {isLoading ? <LoadingSpinner message={"students are loading"}/>: ""}
            {students.map((stdContainer) => {
              return(
                stdContainer.map((student,index) => {
                  return(
                    <div key={student['id']} className="pathInsideDiv"> {student['firstName']} - {student['lastName']} </div>
                  )
                })
              )
            })}
        </div> 

      </>
    )

}

export default Students ;
