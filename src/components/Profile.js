function Profile({firstName,lastName,email,account})
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