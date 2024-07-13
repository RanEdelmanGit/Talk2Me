import React from 'react'

export default function ClientSearch({search, setSearch}) {

const handleChange = (e)=>{
  setSearch(e.target.value)
}

  return (
    <div className='w-full flex bg-gray-200 justify-center items-center py-4 sticky top-16 border-b'>
      <input type='text' value={search} onChange={handleChange} placeholder='חפש לפי שם ...' className='block w-[300px] md:w-[600px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6'/>
    </div>
  )
}
