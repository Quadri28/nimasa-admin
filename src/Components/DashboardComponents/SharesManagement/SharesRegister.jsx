import React, { useContext, useEffect, useMemo, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Link, Outlet, useLocation } from "react-router-dom";
import axios from "../../axios";
import Table from "../CommunicationSubComponents/Table";
import { UserContext } from "../../AuthContext";

const SharesRegister = () => {
  const [data, setData]= useState([])
  const{credentials}= useContext(UserContext)
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading]= useState(false)

  const {pathname} = useLocation()

  return (
    <>
      <div className="card mt-3 border-0 rounded-4">
        <div className="d-flex justify-content-between mt-4">
          <div className="d-flex gap-3 px-3">
            <Link to='' className={pathname === '/admin-dashboard/shares-management/shares-register' ? 'active-selector' : 'text-dark'} 
            style={{textDecoration:'none'}}>Add Shares</Link>
            <Link to='withdraw-shares'
             className={pathname.includes('/admin-dashboard/shares-management/shares-register/withdraw-shares') ? 'active-selector' :'text-dark'}
             style={{textDecoration:'none'}}>Withdraw Shares</Link>
          </div>
        </div>
       <Outlet/>
       </div>
       </>
  );
};

export default SharesRegister;
