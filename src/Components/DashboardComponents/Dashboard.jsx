import React, { useContext, useEffect, useState } from "react";
import { GoArrowUp } from "react-icons/go";
import "./Dashboard.css";
import OverviewChart from "./OverviewChart";
import FinancialOverviewChart from "./FinancialOverviewChart";
import ProductOverviewChart from "./ProductOverviewChart";
import { UserContext } from "../AuthContext";
import axios from "../axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const {credentials} = useContext(UserContext)
  const [details, setDetails]= useState({})
  const [members, setMembers]= useState([])
  const [financial, setFinancial]= useState([])
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 3000); // ⏳ Re-renders after 3 seconds
  }, []);

const getDashboardDetails=()=>{
  axios('DashBoard/admin-fetch-dashboard-data', {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>{
    setDetails(resp.data.data)
  })
}

const getMemberOverview=()=>{
  axios('DashBoard/member-overview', {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>{
    setMembers(resp.data.data)
  })
}
const getFinancialOverview=()=>{
  axios('DashBoard/financial-overview', {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>{
    setFinancial(resp.data.data)
  })
}

useEffect(()=>{
  getDashboardDetails()
  getFinancialOverview()
  getMemberOverview()
}, [])


  return (
    <div>
      <div className="d-flex flex-column" style={{fontFamily:'DM Sans'}}>
        <h5 className="dash-title" style={{fontSize:'18px', fontWeight:'500'}}> General Overview</h5>
        <div className="small-card-container">
          <div className=" p-1">
            <div className="p-3 bg-white align-items-center rounded-3 small-cards">
              <div>
                <p className="text-uppercase small-card-title">Total Savings</p>
                <div className="d-flex justify-content-between align-items-baseline">
                  <span style={{fontWeight:'500'}}>{new Intl.NumberFormat('en-US', 
                    {minimumFractionDigits:2}).format(details?.totalContributions)} </span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-1">
            <div className="p-3 bg-white align-items-center rounded-3 small-cards">
              <div>
                <p className="text-uppercase small-card-title">
                  Loan Portfolio
                </p>
                <div className="d-flex justify-content-between align-items-baseline">
                  <span style={{fontWeight:'500'}}>{new Intl.NumberFormat('en-US', 
                    {minimumFractionDigits:2}).format(details?.totalLoanPortFolio)} </span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-1">
            <div className="p-3 bg-white align-items-center rounded-3 small-cards">
              <div>
                <p className="text-uppercase small-card-title">
                  Total Shares
                </p>
                <div className="d-flex justify-content-between align-items-baseline">
                  <span style={{fontWeight:'500'}}>
                    {new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(details?.totalSharesPortFolio)} </span>
                </div>
              </div>
            </div>
          </div>
          <div className=" p-1">
            <div className="p-3 bg-white align-items-center rounded-3 small-cards">
              <div>
                <p className="text-uppercase small-card-title">
                  Total Investment
                </p>
                <div className="d-flex justify-content-between align-items-baseline">
                  <span style={{fontWeight:'500'}}>{new Intl.NumberFormat('en-US',
                     {minimumFractionDigits:2}).format(details?.totalInvestmentPortFolio)} </span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-1">
            <div className="p-3 bg-white align-items-center rounded-3 small-cards">
              <div>
                <p className="text-uppercase small-card-title">
                    Loan Repayment Due
                </p>
                <div className="d-flex justify-content-between align-items-baseline">
                  <span style={{fontWeight:'500'}}>{new Intl.NumberFormat('en-US',
                     {minimumFractionDigits:2}).format(details?.totalLoanRepaymentThisWeek)} </span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-1">
            <div className="p-3 bg-white align-items-center rounded-3 small-cards">
              <div>
                <p className="text-uppercase small-card-title">
                    Loan Due Today
                </p>
                <div className="d-flex justify-content-between align-items-baseline">
                  <span style={{fontWeight:'500'}}>{new Intl.NumberFormat('en-US', 
                    {minimumFractionDigits:2}).format(details?.totalLoanrepaymentToday)} </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="doughnut-container my-4">
        <div className="card p-3 rounded-3 border-0" style={{height:'fit-content'}}>
          <div className="d-flex justify-content-between flex-wrap member-overview-container align-items-center">
            <h5 className="overview-title" style={{fontSize:'16px'}}>Member Overview</h5>
            <Link to='/admin-dashboard/member-management'
              className="border-0 member px-3 py-1" style={{textDecoration:'none', fontSize:'14px'}}>      Membership Management
            </Link>
          </div>
          <OverviewChart members={members}/>
        </div>
        <div className="card p-3 product-overview-container rounded-3 border-0">
        <h5 style={{fontSize:'16px'}}>Financial Overview</h5>
          <div >
            <FinancialOverviewChart financial={financial}/>
          </div>
        </div>
      </div>
      <div className="card p-3 border-0" style={{height:'fit-content'}}>
        <div className="d-sm-flex justify-content-between align-items-center">
            <h5 style={{fontSize:'16px'}}>Product Overview</h5>
          </div>
            <ProductOverviewChart/>
        </div>
    </div>
  );
};

export default Dashboard;
