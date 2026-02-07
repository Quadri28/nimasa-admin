import React,{useContext, useEffect, useMemo, useState} from 'react'
import {useTable, useSortBy, useGlobalFilter, usePagination, } from "react-table";
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa';
import { UserContext } from '../AuthContext';
import axios from '../axios';
import Modal from 'react-modal'
import { toast, ToastContainer } from 'react-toastify';

const PositionEligibility = () => {
  const [positions, setPositions]= useState([])
  const {credentials}= useContext(UserContext)
  const [position, setPosition]= useState('')
  const [description, setDescription]= useState('')
  const [isOpen, setIsOpen]= useState(false)
  const getPositions=()=>{
    axios('Election/election-positions', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      setPositions(resp.data.data.positions)
    })
  }
  const openModal=()=>{
    setIsOpen(true)
  }
  const closeModal=()=>{
    setIsOpen(false)
  }
useEffect(()=>{
getPositions()
}, [])

    const column=[
        {Header: 'Position', accessor: 'name'},
        {Header: 'Description', accessor: 'description'},
        {Header: 'Status', accessor: 'isActive',Cell:(({value})=>{
           if (value === true) {
            return( 
                <div className='active-status px-3' style={{width:'max-content'}}>
                    <hr />
                     <span >Active</span>
                </div>)
        }else if (value === false) {
            return(
            <div className='suspended-status px-3' style={{width:'max-content'}}>
                <hr />
             <span >In-active</span>
             </div>
             )}
        })},
        {Header:'Date Created', accessor:'dateCreated', Cell:(({value})=>{
          return <span>{new Date(value).toLocaleDateString('en-US')}</span>
        })},
        {Header: 'Action', accessor: 'action', Cell:(props)=>{
            const value = props.row.original.isActive
            const id = props.row.original.id
            if (value === true) {
              return <button className='btn-md rounded-5 border-0 discard-btn px-3 py-2' 
              onClick={()=>updatePosition(id, false)}>Deactivate</button>
            }else{
               return <button className='btn-md border-0 member' 
               onClick={()=>updatePosition(id, true)}>Activate</button>
            }
        }},
    ]

    const columns = useMemo(() => column, []);

    const tableInstance = useTable(
        {
          columns: columns,
          data: positions,
        },
        useGlobalFilter,
        useSortBy,
        usePagination
      );
    
      const {
        getTableProps,
        getTableBodyProps,
        page,
        prepareRow,
        headerGroups,
        state,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage,
        pageCount
      } = tableInstance;
      const {  pageIndex } = state;
      const customStyles = {
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "1rem",
          overFlowY: "scroll",
          width:'350px',
          zIndex:'999999'
        },
      };
const updatePosition=(id, value)=>{
  const payload={
    id:id,
    isActive: value
  }
axios.post('Election/set-active-or-deactive-position', payload, {headers:{
Authorization: `Bearer ${credentials.token}`
}}).then(resp=>{
  toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
  getPositions()
}).catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
}
      const createPosition=(e)=>{
        e.preventDefault()
        const payload={
          positionName: position,
          description: description
        }
        axios.post('Election/create-position', payload, {headers:{
          Authorization:`Bearer ${credentials.token}`
        }}).then(resp=>{
          toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
          getPositions()
          setTimeout(()=>{
            closeModal()
          }, 5000)
        }).catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
      }
    
  return (
    <>
    <div className='card p-3 border-0 rounded-4'>
    <div className='d-sm-flex justify-content-between align-items-center my-3'>
        <p className="active-selector">
        Positions setup  
        </p>
      <div className='d-flex gap-2 export-btn-container my-2 flex-wrap '>
        <button className='border-0 member btn-md text-white' 
       onClick={()=>openModal()}>
            Create new position</button>
      </div>
    </div>
    <div className='table-responsive'>
    <table {...getTableProps()} id="customers" className="table">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {positions.length > 0 && <tbody {...getTableBodyProps()}>
              {page.map((row, index) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell, ) => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>}
          </table>
          {positions.length > 0 ?<div className="d-flex justify-content-center gap-2 mt-2 align-items-center">
           
            <button onClick={()=>gotoPage(0)} className="px-2 py-1 rounded-3 border-0 pagination-btn" disabled={!canPreviousPage}>{'<<'}</button>
           <button disabled={!canPreviousPage} className="px-2 py-1 rounded-3 border-0 pagination-btn"> <FaAngleLeft onClick={()=>previousPage()}/> </button>
            <span>
                page {''}
                <strong>{pageIndex + 1} of {pageOptions.length}</strong>
            </span>
           <button disabled={!canNextPage} className="px-2 py-1 rounded-3 border-0 pagination-btn"><FaAngleRight onClick={()=>nextPage()}/></button>
           <button onClick={()=>gotoPage(pageCount -1)} className="px-2 py-1 rounded-3 border-0 pagination-btn" disabled={!canNextPage}>{'>>'}</button>
           </div>: <div className="d-flex justify-content-center">No data yet!!!</div> }
    </div>
     </div>    
     <Modal
     isOpen={isOpen}
     onRequestClose={closeModal}
     style={customStyles}
     >
      <h3 style={{fontSize:'18px', fontWeight:'600', textAlign:'center'}}>Create new position</h3>
      <form onSubmit={createPosition}>
      <div className="d-flex flex-column gap-1">
        <label htmlFor="position">Position name</label>
        <input type="text" name='position' className='p-2 rounded-3' placeholder='President'
        required
         style={{border:'solid 1px #ddd'}} onChange={(e)=>setPosition(e.target.value)}/>
      </div>
      <div className="d-flex flex-column gap-1 mt-2">
        <label htmlFor="description">Position description</label>
        <textarea type="text" name='description' className='p-2 rounded-3'
         placeholder='Takes care of meeting minutes' required
         style={{border:'solid 1px #ddd'}} onChange={(e)=>setDescription(e.target.value)}/>
      </div>
      <div className="d-flex">
      <button className='member mt-3 w-100 border-0'>Create</button>
      </div>
      </form>
     </Modal>
     <ToastContainer/>
     </>
  )
}


export default PositionEligibility
