import React, { useState } from 'react'
import './GlobalFilter.css'

const GlobalFilter = ({filter, setFilter}) => {
    const [blur, setBlur] = useState(false)
  return (
    <span>
      <input type="text" value={filter || ''} 
      onChange={(e)=>setFilter(e.target.value)} className='search-input my-2 w-100'
      placeholder='Search anything' onClick={()=>setBlur(!blur)} />
    </span>
  )
}

export default GlobalFilter
