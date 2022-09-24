import LoadingSpinner from "./LoadingSpinner";
import { useEffect, useState,useLayoutEffect } from "react";
import {useLocation} from "react-router-dom" ;

function FormCreatePath()
{
    const [isLoading, setIsLoading] = useState(false);

    const { state } = useLocation();


    async function handleCreatePath(event)
    {
      setIsLoading(true) ;
      event.preventDefault();
      let pathName = event.target.elements.pathName.value ;
      let description = event.target.elements.description.value ;
      let imageUrl = event.target.elements.url.value ;
  
      let pathContract = state.connection ;
      const createPathTxn = await pathContract.createPath(pathName,description,imageUrl)
      const path = await createPathTxn.wait();
      const eventPath = path.events.find(event => event.event === 'pathCreated');
      const [id, name,desc,imgUrl] = eventPath.args;
      setIsLoading(false);
      console.log(`created student with id ${id} pathName ${name} and description ${desc} with imgUrl ${imgUrl} `);
    }
    return(
      <> 
     {isLoading && <LoadingSpinner message={"path is being created"} /> }
     <br></br>
        <form  onSubmit={handleCreatePath} className="formLayout" >
          <label htmlFor="pathName" >pathName
            <input type="text" id="firstName" />
          </label>
          <label htmlFor="description" >Description
            <input type="text" id="lastName" />
          </label>
          <label htmlFor="imageUrl" >imageUrl
            <input type="text" id="email" />
          </label>
  
          <input type="submit" value="create new path" className='btn'/>
        </form>
      </>
      )
  
}

export default FormCreatePath ; 