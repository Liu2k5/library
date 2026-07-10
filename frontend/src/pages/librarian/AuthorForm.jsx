import { useEffect,useState } from "react";
import { useNavigate,useParams } from "react-router-dom";

import { createAuthor, updateAuthor, getAuthor } from "../../../src/api/authorApi";

function AuthorForm(){

const navigate=useNavigate();

const {id}=useParams();

const isEdit=id!=null;

const [author,setAuthor]=useState({

name:"",
description:""

});

useEffect(()=>{

if(isEdit){

loadAuthor();

}

},[]);

const loadAuthor=async()=>{

const res=await getAuthor(id);

setAuthor(res.data);

}

const handleChange=(e)=>{

setAuthor({

...author,

[e.target.name]:e.target.value

});

}

const handleSubmit=async(e)=>{

e.preventDefault();

if(isEdit){

await updateAuthor(id,author);

}else{

await createAuthor(author);

}

navigate("/librarian/authors");

}

return(

<div className="container mt-4">

<h3>

{isEdit?"Edit Author":"Add Author"}

</h3>

<form onSubmit={handleSubmit}>

<div className="mb-3">

<label>Name</label>

<input
className="form-control"
name="name"
value={author.name}
onChange={handleChange}
/>

</div>

<div className="mb-3">

<label>Biography</label>

<textarea
className="form-control"
name="biography"
value={author.biography}
onChange={handleChange}
/>

</div>

<button className="btn btn-success me-2">

Save

</button>

<button
type="button"
className="btn btn-secondary"
onClick={()=>navigate("/librarian/authors")}
>

Cancel

</button>

</form>

</div>

);

}

export default AuthorForm;