import React,{useContext, useEffect, useMemo, useState} from 'react'
import {
    useTable,
    useSortBy,
    useGlobalFilter,
    usePagination,
  } from "react-table";
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa';
import { CSVLink } from 'react-csv'
import { UserContext } from '../../AuthContext';
import axios from '../../axios';
import { LuView } from 'react-icons/lu';
import { Link } from 'react-router-dom';

const Products = () => {
  const [reports, setReports] = useState([])
  const [variances, setVariances] = useState([])
  const [showVariance, setShowVariance]= useState(false)
  const{credentials} = useContext(UserContext)
  const getReports=()=>{
    axios('Reports/product-summary-analysis', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setReports(resp.data.data.productSummaryAnalysissdue))
  }


  const getVariances=()=>{
    axios(`Reports/product-summary-analysis-variance?NodeId=${credentials.logInfo.nodeId}`, {
      headers:{
        Authorization:`Bearer ${credentials.token}`
      }
    }).then(resp=>setVariances(resp.data.data.productSummaryAnalysisVariances))
  }
 
  useEffect(()=>{
    getReports()
    getVariances()
  },[])

  console.log(variances)
 

    return (
      <div className='card p-3 mt-3 rounded-4' style={{border:'solid 1px #f2f2f2'}}>
        <div className="d-flex justify-content-end">
          <button   className="border-0 btn-md text-white member"
        onClick={()=>setShowVariance(!showVariance)}>
          {showVariance ? 'Hide Variance': 'Show Variance'}
          </button>
        </div>

        <div className="table-responsive mt-3" id='customers'>
        {!showVariance ?
      <table className="table table-bordered" >
      <thead className="thead-dark">
              <tr>
                <th>Product Code</th>
                <th>Product Name</th>
                <th>No of Account</th>
                <th>Cr. Product Bal.</th>
                <th>Dr. Product Bal.</th>
                <th>Total Bal.</th>
                <th>Action</th>
                </tr>
                </thead>
             {reports.length >0 ? 
            <tbody>
            {
            reports.map((report)=>(
              <tr>
                    <td>{report.productCode}</td>
                    <td>{report.productName}</td>
                    <td className='text-center'>{report.noOfAccount}</td>
                    <td>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(report.crProductBal)}</td>
                    <td>{new Intl.NumberFormat('en-US',).format(report.drProductBal)}</td>
                    <td>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(report.totalBal)}</td>
                    <td className='text-center'> <Link to={`details/${report.productCode}`} className='text-dark text-center'> <LuView/></Link></td>
              </tr>
                ))
              }
            </tbody> : <tbody className='text-center'>Loading...</tbody>}
                </table>:
                  <table className="table table-bordered" >
                  <thead className="thead-dark">
                          <tr>
                            <th>Product Code</th>
                            <th>Product Name</th>
                            <th>Branch Code</th>
                            <th>Gl Account</th>
                            <th>Customer Balance</th>
                            <th>GL Balance</th>
                            <th>Variance</th>
                            </tr>
                            </thead>
                         {variances.length >0 ? 
                        <tbody>
                        {
                              variances.map((report)=>(
                          <tr>
                                <td>{report.productCode}</td>
                                <td>{report.productName}</td>
                                <td>{report.branchCode}</td>
                                <td>{report.glAccount}</td>
                                <td>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(report.customerBalance)}</td>
                                <td>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(report.glbalance)}</td>
                                <td>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(report.variance)}</td>
                          </tr>
                            ))
                          }
                 </tbody> : <tbody className='text-center'>Loading...</tbody>}
               </table>
                }
        </div>

      </div>
    )
}

export default Products
