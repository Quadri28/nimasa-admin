import React,{useState} from 'react'
import Expenses from './IncomeStatementComponent/Expenses'
import Revenue from './IncomeStatementComponent/Revenue'
import NetIncome from './IncomeStatementComponent/NetIncome'

const IncomeStatement = () => {

    const [selected, setSelected] = useState('expenses')

    const getComponent=()=>{
        if (selected === 'expenses') {
            return <Expenses/>
        }else if (selected === 'revenue') {
            return <Revenue/>
        }else if (selected ==='net-income') {
            return <NetIncome/>
        }
    }
  return (
    <>
    <div className="d-flex gap-3 my-3 flex-wrap">
   <span
     className={selected === "expenses" ? "active-selector" : ""}
     onClick={() => setSelected("expenses")}
     style={{cursor:'pointer'}}
   >
     Expenses
   </span>
   <span 
   className={selected === "revenue" ? "active-selector" : ""}
   onClick={() => setSelected("revenue")}
   style={{cursor:'pointer'}}
   >Revenue</span>
   <span className={selected === "net-income" ? "active-selector" : ""}
     onClick={() => setSelected("net-income")}
     style={{cursor:'pointer'}}
     >Net-Income</span>
 </div>
 {
   getComponent()
 }
</>
  )
}

export default IncomeStatement
