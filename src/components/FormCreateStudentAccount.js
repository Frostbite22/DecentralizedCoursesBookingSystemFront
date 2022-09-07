import { ethers } from "ethers";


function FormCreateStudentAccount({currentAccount,connection,studentsNumber}) 
{

  async function handleCreateStudent()
  {

    let firstName = event.target.elements.firstName.value ;
    let lastName = event.target.elements.lastName.value ;
    let mail = event.target.elements.email.value ;

    let studentContract = connection ;
    const studentToCreate = await studentContract.createStudent("hatem","doe","hatm@gmail.tn",currentAccount)
    const student = await studentToCreate.wait();
    const event = student.events.find(event => event.event === 'studentCreated');
    const [id, first,last,account,email] = event.args;
    studentsNumber(connection);
    console.log(`created student with id ${id} firstName ${first} and lastName ${last} with acc ${account} and email ${email}`);
  }
  return(
      <form  onSubmit={handleCreateStudent} className="formLayout" >
        <label htmlFor="firstName" >firstName
          <input type="text" id="firstName" />
        </label>
        <label htmlFor="lastName" >firstName
          <input type="text" id="lastName" />
        </label>
        <label htmlFor="email" >email
          <input type="text" id="email" />
        </label>

        <input type="submit" value="Submit" className='btn'/>
      </form>
    )
}

export default FormCreateStudentAccount ;
