import React, { useState } from 'react'
import Assets from './BalanceSheetComponents/Assets'
import Liabilities from './BalanceSheetComponents/Liabilities'
import Equity from './BalanceSheetComponents/Equity'
import'./BalanceSheet.css'


const BalanceSheet = () => {
    const [activated, setActivated] = useState('assets')

    const getComponent=()=>{
        if (activated === 'assets') {
            return <Assets/>
        }else if (activated === 'liabilities') {
            return <Liabilities/>
        }else if (activated ==='equity') {
            return <Equity/>
        }
    }

  return (
    <>
         <div className="d-flex flex-wrap gap-3 my-3">
        <span
          className={activated === "assets" ? "active-selector" : ""}
          onClick={() => setActivated("assets")}
          style={{cursor:'pointer'}}
        >
          Assets
        </span>
        <span 
        className={activated === "liabilities" ? "active-selector" : ""}
        onClick={() => setActivated("liabilities")}
        style={{cursor:'pointer'}}
        >Liabilities</span>
        <span className={activated === "equity" ? "active-selector" : ""}
          onClick={() => setActivated("equity")}
          style={{cursor:'pointer'}}
          >Equity</span>
      </div>
      {
        getComponent()
      }
    </>
  )
}

export default BalanceSheet
