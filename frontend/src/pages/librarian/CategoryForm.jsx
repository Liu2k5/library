import { useEffect,useState } from "react";
import { useNavigate,useParams } from "react-router-dom";

import { createCategory, updateCategory, getCategory } from "../../../src/api/categoryApi";

function CategoryForm(){

const navigate=useNavigate();

const {id}=useParams();

const isEdit=id!=null;

const [category,setCategory]=useState({

name:"",
description:""

});

useEffect(()=>{

if(isEdit){

loadCategory();

}

},[]);

const loadCategory=async()=>{

const res=await getCategory(id);

setCategory(res.data);

}

const handleChange=(e)=>{

setCategory({

...category,

[e.target.name]:e.target.value

});

}

const handleSubmit=async(e)=>{

e.preventDefault();

if(isEdit){

await updateCategory(id,category);

}else{

await createCategory(category);

}

navigate("/librarian/categories");

}

return(

<div className="container mt-4">

<h3>

{isEdit?"Edit Category":"Add Category"}

</h3>

<form onSubmit={handleSubmit}>

<div className="mb-3">

<label>Name</label>

<input
className="form-control"
name="name"
value={category.name}
onChange={handleChange}
/>

</div>

<div className="mb-3">

<label>Description</label>

<textarea
className="form-control"
name="description"
value={category.description}
onChange={handleChange}
/>

</div>

<button className="btn btn-success me-2">

Save

</button>

<button
type="button"
className="btn btn-secondary"
onClick={()=>navigate("/librarian/categories")}
>

Cancel

</button>

</form>

</div>

);

}

export default CategoryForm;