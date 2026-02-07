import React, { useState } from "react";
import FinancingActivities from "./Cashflow/FinancingActivities";
import OperatingActivities from "./Cashflow/OperatingActivities";
import InvestingActivities from "./Cashflow/InvestingActivities";

const CashFlow = () => {
  const [active, setActive] = useState("financing");

  const getComponents =()=>{
    if (active === 'financing') {
      return <FinancingActivities/>
    }else if (active === 'operating') {
      return <OperatingActivities/>
    }else if (active === 'investing') {
      return <InvestingActivities/>
    }
  }
  
  return (
    <>
    <div className="d-flex gap-3 flex-wrap">
      <span
        onClick={() => setActive("financing")}
        className={active === "financing" ? "active-selector" : null}
        style={{cursor:'pointer'}}
      >
        Financing Activities
      </span>
      <span
        onClick={() => setActive("operating")}
        className={active === "operating" ? "active-selector" : null}
        style={{cursor:'pointer'}}

      >
        Operating Activities
      </span>
      <span
        onClick={() => setActive("investing")}
        className={active === "investing" ? "active-selector" : null}
        style={{cursor:'pointer'}}
      >
        Investing Activities
      </span>
    </div>
    {
      getComponents()
    }
    </>
  );
};

export default CashFlow;
