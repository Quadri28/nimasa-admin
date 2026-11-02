import React from 'react'
import { Link } from 'react-router-dom'

const DeleteAccount = () => {
  return (
        <div style={{ backgroundColor: "#EDF4FF" }}>
      <div className="container d-flex flex-column">
        <div
          className="text-center py-3 rounded-2 w-100 mt-5"
          style={{ backgroundColor: "#0452C8" }}
        >
          <h2
            className="text-white"
            style={{ fontWeight: "700", fontSize: "20px" }}
          >
            Wait! Before You Deactivate Your Account
          </h2>
        </div>
          <p className='mt-3'> We're sorry to see you go.
            Before you leave, here are a few things you should know: 
            </p> 
            <div className='d-flex flex-column gap-3 w-100'>
            What Deactivation Means:
            <ol>
            <li style={{listStyleType: 'decimal' }}>Your account will be temporarily disabled and inaccessible. </li>
            <li style={{listStyleType: 'decimal' }}> You won’t receive updates, notifications, or have access to any features.</li>
            <li style={{listStyleType: 'decimal' }}>Your data will be safely stored, and you can reactivate anytime by contacting your cooperative to be reactivated and then logging back in.</li>
            </ol>
             </div>
            <h3>Need Help Instead?</h3>
            <p>If you’re leaving due to issues or concerns, we’d love a chance to make things right  <Link to='/contact-us'>Contact us</Link>
            </p>

            <div className="d-flex flex-column w-100"> Ready to Go?
            If you're sure you want to deactivate your account, please follow the steps below:
            <ol className='mt-3'>
    <li style={{listStyleType: 'decimal' }}>Log in to your app.</li>
        <li style={{listStyleType: 'decimal' }}>Navigate to Finance and select Retirement.</li>
            <li style={{listStyleType: 'decimal' }}>Click the Submit button to initiate the process.</li>
           </ol>
            Once submitted, your cooperative will review and approve your request. After approval, your funds will be credited directly to your bank account.
</div>
    </div>
    <div className="container pb-4 mt-4">
    <p>Changed Your Mind? That’s okay — click <Link to='/'>Go back</Link> to return</p>
</div>
    </div>
  )
}

export default DeleteAccount
