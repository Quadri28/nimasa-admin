import React, { useState } from 'react'
import SavingAcctSummary from './SavingAcctSummary'
import SavingTransaction from './SavingTransaction'

const SavingReport = () => {
  const [active, setActive]= useState('saving-account')

  const getComponent=()=>{
    if (active === 'saving-account') {
      return <SavingAcctSummary/>
    }else{
      return <SavingTransaction/>
    }

  }
  return (
    <div className='card py-4 px-3 mt-3'>
    <div className='d-flex gap-3 mb-3'>
      <span className={active === 'saving-account' ? 'active-selector' : null}
      onClick={()=>setActive('saving-account')} style={{cursor:'pointer'}}>Saving Account Summary</span>
      <span className={active === 'saving-transaction' ? 'active-selector' : null}
      onClick={()=>setActive('saving-transaction')} style={{cursor:'pointer'}}>Saving Transactions</span>
    </div>
    {
      getComponent()
    }
    </div>
  )
}

export default SavingReport
