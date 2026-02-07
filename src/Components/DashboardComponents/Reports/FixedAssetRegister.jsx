import React, { useContext, useEffect, useMemo, useState } from 'react'
import axios from '../../axios';
import { UserContext } from '../../AuthContext';
import UnpaginatedTable from './UnpaginatedTable';

const FixedAssetRegister = () => {
  const [branches, setBranches] = useState([]);
  const[input, setInput]= useState({})
  const [statuses, setStatuses] = useState([])
  const [reports, setReports] = useState([])
  const {credentials} = useContext(UserContext)


  const handleChange=(e)=>{
    const name = e.target.name;
    const value = e.target.value;
    setInput({...input, [name]:value})
  }

  const getStatuses= async()=>{
    await axios('Reports/fixed-asset-register-report-status', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setStatuses(resp.data))
  }
  const getBranches = () => {
      axios("MemberManagement/get-branch",{headers:{
        Authorization:`Bearer ${credentials.token}`
      }}).then((resp) => {
        setBranches(resp.data.data);
      });
    };
    useEffect(() => {
      getBranches();
      getStatuses()
    }, []);
    const getReports =async()=>{
      await axios(`Reports/fixed-asset-register?BranchCode=${input.branch}&AssetStatus=${input.status}`, {
        headers:{
          Authorization:`Bearer ${credentials.token}`
        }
      })
    .then(resp=>{
      if (resp.data.data.fixedAssetRegisterReports) {
      setReports(resp.data.data.fixedAssetRegisterReports)
      }
    })}

    useEffect(()=>{
      getReports()
    }, [input?.branch, input?.status])

    const column= [
      {Header: 'Branch Location', accessor:'branchLocation'},
      {Header: 'Asset ID', accessor:'assetId'},
      {Header: 'Asset Name', accessor:'assetName'},
      {Header: 'Item Cost', accessor:'itemCost', Cell:(({value})=>{
        return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
      })},
      {Header: 'Accumulated Depreciation', accessor:'accumulateDepreciation'},
      {Header: 'Netbook Value', accessor:'netBookValue', Cell:(({value})=>{
        return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
      })},
      {Header: 'SI Amount', accessor:'siAmount', Cell:(({value})=>{
        return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
      })},
      {Header: 'Depreciation Rate %', accessor:'depreciationRate'},
      {Header: 'Tenure (Months)', accessor:'tenure'},
      {Header: 'Expired Life (Months)', accessor:'eexpiredLife'},
      {Header: 'Savage Value', accessor:'savageValue'},
      {Header: 'Next Depr Date', accessor:'nextDeprRate'},
      {Header: 'Purchase Date', accessor:'purchaseDate'},
      {Header: 'Expense A/C', accessor:'expenseAcc'},
      {Header: 'Liability A/C', accessor:'liabilityAcc'},
      {Header: 'Department Location', accessor:'departmentLocation'},
      {Header: 'Tag No', accessor:'tagNo'},
      {Header: 'Created By', accessor:'createdBy'},
      {Header: 'Disposed Date', accessor:'disposedDate'},
    ]
    const columns = useMemo(() => column, []);
  

  return (
    <div className='card p-3 mt-3' style={{border:'solid .5px #f2f2f2'}}>
      <div className="admin-task-forms mb-2">
        <div className=" d-flex flex-column gap-1">
          <label htmlFor="branch">
            Select Branch<sup className="text-danger">*</sup>
          </label>
          <select
            name='branch'
            onChange={handleChange}
            className="border-0 rounded-3" style={{height:'2.5rem'}}
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option value={branch.branchCode} key={branch.Name}>
                {branch.branchName}
              </option>
            ))}
          </select>
        </div>
        <div className="d-flex flex-column gap-1">
        <label htmlFor="status">Asset status:</label>
        <select  className='rounded-3' 
        style={{border:'solid 1px #ddd', outline:'none', height:'2.5rem'}} name='status' 
        onChange={handleChange}>
          <option value="">Select</option>
            {
              statuses.map(status=>(
                <option value={status.value} key={status.value}>{status.name}</option>
              ))
            }
          </select>
        </div>
        </div>
        <UnpaginatedTable 
        data={reports}
        columns={columns}
        filename='FixedAssetRegisterReport'
        />
    </div>
  )
}

export default FixedAssetRegister
