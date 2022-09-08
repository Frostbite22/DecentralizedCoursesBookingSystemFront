
function FormCreateStudentAccount({currentAccount,connection,studentsNumber,setIsLoggedIn}) 
{

  async function handleCreateStudent(event)
  {

    event.preventDefault();
    let firstName = event.target.elements.firstName.value ;
    let lastName = event.target.elements.lastName.value ;
    let mail = event.target.elements.email.value ;

    let studentContract = connection ;
    const studentToCreate = await studentContract.createStudent(firstName,lastName,mail,currentAccount)
    const student = await studentToCreate.wait();
    const eventStd = student.events.find(event => event.event === 'studentCreated');
    const [id, first,last,account,email] = eventStd.args;
    studentsNumber(connection);
    setIsLoggedIn(true);
    console.log(`created student with id ${id} firstName ${first} and lastName ${last} with acc ${account} and email ${email}`);
  }
  return(
      <form  onSubmit={handleCreateStudent} className="formLayout" >
        <label htmlFor="firstName" >firstName
          <input type="text" id="firstName" />
        </label>
        <label htmlFor="lastName" >lastName
          <input type="text" id="lastName" />
        </label>
        <label htmlFor="email" >email
          <input type="text" id="email" />
        </label>

        <input type="submit" value="create student account" className='btn'/>
      </form>
    )
}

export default FormCreateStudentAccount ;
