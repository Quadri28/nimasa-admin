import React from 'react'
import { GoArrowLeft } from 'react-icons/go'
import { useNavigate, useParams } from 'react-router-dom'

const TransactionDetail = () => {
    const {id} = useParams()
    const navigate = useNavigate()
  return (
    <div>
      <span onClick={()=>navigate(-1)} style={{cursor:'pointer'}}><GoArrowLeft /> Back</span>
     <p> {id}</p>
    </div>
  )
}

export default TransactionDetail
