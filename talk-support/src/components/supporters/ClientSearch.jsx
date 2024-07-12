import React from 'react'

export default function ClientSearch({search, setSearch}) {

const handleChange = (e)=>{
  setSearch(e.target.value)
}

  return (
    <div>
      <div>ClientSearch</div>
      <input type='text' value={search} onChange={handleChange} placeholder='חפש לפי שם ...'/>
    </div>
  )
}
