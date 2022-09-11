import { useEffect, useState,useLayoutEffect } from "react";


function Profile({account,firstName,lastName,email})
{
    return (
    <div className="profile">
        <p>Hello {firstName} {lastName} </p>
        <p>{email}</p>
        <p>{account}</p>
    </div>    
    )
    
}

export default Profile ; 