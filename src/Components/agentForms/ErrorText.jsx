import React from 'react'

const ErrorText = (props) => {
  return (
    <div className='text-danger' style={{fontSize:'13px'}}>
      {props.children}
    </div>
  )
}

export default ErrorText
