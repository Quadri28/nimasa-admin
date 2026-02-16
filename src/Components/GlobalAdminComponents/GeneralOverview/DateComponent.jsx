import React, { useState } from "react";
import './DateComponent.css'

const DateComponent = ({ setValue , active, setActive}) => {
  return (
    <div className="d-flex gap-1 align-items-center">
      <div
        style={{
          padding: "3px 10px",
          borderRadius: "20px",
          cursor: "pointer",
        }}
        className={active === 'today' ? 'active-date' : 'in-active-date'}
        onClick={() =>{
          setActive('today')
          setValue(1)
        }}
      >
        <span style={{ fontWeight: "400", fontSize: "12px",  }}>
          Today
        </span>
      </div>
      <div
        style={{
          padding: "3px 10px",
          borderRadius: "20px",
          cursor: "pointer",
        }}
        className={active === '7 days' ? 'active-date' : 'in-active-date'}
        onClick={() =>{
          setActive('7 days')
          setValue(2)
        }}
      >
        <span style={{ fontWeight: "400", fontSize: "12px",  }}>
          7 days
        </span>
      </div>
      <div
        style={{
          padding: "3px 10px",
          borderRadius: "20px",
          cursor: "pointer",
        }}
        className={active === '14 days' ? 'active-date' : 'in-active-date'}
        onClick={() =>{
          setActive('14 days')
          setValue(3)
        }}
      >
        <span style={{ fontWeight: "400", fontSize: "12px",  }}>
          14 days
        </span>
      </div>
      <div
        style={{
          padding: "3px 10px",
          borderRadius: "20px",
          cursor: "pointer",
        }}
        className={active === '1 month' ? 'active-date' : 'in-active-date'}
        onClick={() =>{
          setActive('1 month')
          setValue(4)
        }}
      >
        <span style={{ fontWeight: "400", fontSize: "12px",  }}>
          1 month
        </span>
      </div>
      <div
        style={{
          
          padding: "3px 10px",
          borderRadius: "20px",
          cursor: "pointer",
        }}
        className={active === '3 months' ? 'active-date' : 'in-active-date'}
        onClick={() =>{
          setActive('3 months')
          setValue(5)
        }}
      >
        <span style={{ fontWeight: "400", fontSize: "12px",  }}>
          3 months
        </span>
      </div>
    </div>
  );
};

export default DateComponent;
