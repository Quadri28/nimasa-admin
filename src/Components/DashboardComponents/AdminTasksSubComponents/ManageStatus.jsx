import React, { useState } from "react";
import BalanceSheet from "./BalanceSheet";
import CashFlow from "./CashFlow";
import IncomeStatement from "./IncomeStatement";

const ManageStatus = () => {
  const [active, setActive] = useState("balance-sheet");

  const getComponents =()=>{
    if (active === 'balance-sheet') {
      return <BalanceSheet/>
    }else if (active === 'income') {
      return <IncomeStatement/>
    }else if (active === 'cash-flow') {
     return <CashFlow/> 
    }
  }

  return (
    <div className="">
      <div className="d-sm-flex justify-content-between align-items-center">
      <div className="d-flex flex-wrap gap-3 my-4">
        <span
          className={active === "balance-sheet" ? "active-selector" : ""}
          onClick={() => setActive("balance-sheet")}
          style={{cursor:'pointer'}}
        >
          Balance Sheet
        </span>
        <span 
        className={active === "income" ? "active-selector" : ""}
        onClick={() => setActive("income")}
        style={{cursor:'pointer'}}
        >Income Statement</span>
        <span className={active === "cash-flow" ? "active-selector" : ""}
          onClick={() => setActive("cash-flow")}
          style={{cursor:'pointer'}}
          >Cashflow Statement</span>
      </div>
      <div>
      <button className="btn btn-md member px-4" style={{outline:'none'}}>Export</button>
      </div>
      </div>

      <div className="card  p-3">
            {getComponents()}
      </div>

    </div>
  );
};

export default ManageStatus;
