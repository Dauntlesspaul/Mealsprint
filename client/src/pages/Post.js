import React, { useState, useRef } from 'react';

const MyForm = () => {
  const [formData, setFormData] = useState({
    file: null,
    name: '',
    price: '',
    discountprice: '',
    category: '',
    description: ''
  });
  const resetRef = useRef(null)



  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formDataObject = new FormData();
      formDataObject.append('name', formData.name);
      formDataObject.append('price', formData.price);
      formDataObject.append('category', formData.category);
      formDataObject.append('section', formData.section);
      formDataObject.append('description', formData.description);
      formDataObject.append('file', formData.file);

      const response = await fetch('http://localhost:8000/api/upload',{
      method: 'POST',
      body:  formDataObject
     })
     const result = await response.json();
     console.log(result)
    } catch (error) {
      console.error('Form submission failed!', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setFormData({
      ...formData,
      file
    });
  };

 

  return (
    <div className='w-full grid justify-items-center'> 
      <form className=' overflow-x-hidden px-1 box-border w-9/12 mt-16' ref={resetRef} encType="multipart/form-data" onSubmit={handleSubmit}>
        <input 
          type="file" 
          name="file" 
          onChange={handleFileChange} 
          className='mb-2'
          required
          accept='image/*'
        />
        <input 
          type="text" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          placeholder="NAME" 
          className='w-full block border border-black mb-2 bg-slate-100 px-2'
          required
        />
        <input 
          type="text" 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          placeholder="DESCRIPTION" 
          className='w-full block border border-black mb-2 bg-slate-100 px-2'
          required
        />
        <input 
          type="number" 
          name="price" 
          value={formData.price} 
          onChange={handleChange} 
          placeholder="PRICE" 
          className='w-full block border border-black mb-2 bg-slate-100 px-2'
          required
        />
       
        <input 
          type="text" 
          name="section" 
          value={formData.section} 
          onChange={handleChange} 
          placeholder="SECTION" 
          className='w-full block border border-black bg-slate-100 px-2'
          required
        />
         <input 
          type="text" 
          name="category" 
          value={formData.category} 
          onChange={handleChange} 
          placeholder="CATEGORY" 
          className='w-full block border border-black bg-slate-100 px-2'
          required
        />
        <button
        onClick={handleSubmit} 
        className=' w-full rounded-lg h-9 text-white my-4 bg-stone-900 flex justify-center items-center' 
        type='submit'
        
      >
       <span>Submit</span>
      </button>
      </form>
    </div>
    
  );
};

export default MyForm;
