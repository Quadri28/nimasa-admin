import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import {MdOutlineEdit} from 'react-icons/md'
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from '../../../Components/axios'
import {UserContext} from '../../../Components/AuthContext'
import ErrorText from "../ErrorText";
import *as Yup from 'yup'
import { ToastContainer, toast } from "react-toastify";
import {LiaTimesCircle} from 'react-icons/lia'

const Product = () => {
    const [data, setData] = useState([])
    const [accounts, setAccounts]= useState([])
    const [id, setId] = useState('')
    const [input, setInput] = useState({
      inventoryCategoryId: null,
        inventoryCategoryName: '',
        purchaseAccount: '',
        salesAccount:''
    })
    const {credentials} = useContext(UserContext)
const getCategory =()=>{
  axios(`InventoryManagement/inventory-category?inventoryCategoryId=${id}`, {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>setInput(resp.data.data))
}
    const getCategories=()=>{
      axios('InventoryManagement/inventory-categories', {headers:{
        Authorization: `Bearer ${credentials.token}`
      }}).then(resp=>{
        if (resp.data.data.inventoryCategories) {
          setData(resp.data.data.inventoryCategories)
        }}
        )
    }
    const getSalesAccounts=()=>{
      axios('InventoryManagement/inventory-category-account-select', {headers:{
        Authorization: `Bearer ${credentials.token}`
      }}).then(resp=>{
        setAccounts(resp.data.data)
      })
    }
    useEffect(()=>{
      getCategories()
      getSalesAccounts()
    },[])

    useEffect(()=>{
getCategory()
    },[id])
    const handleChange=(e)=>{
      const name = e.target.name;
      const value = e.target.value;
      setInput({...input, [name]:value})
    }
    const updateCategory=(e)=>{
      e.preventDefault()
      const payload={
        inventoryCategoryId: input.inventoryCategoryId,
        inventoryCategoryName: input.inventoryCategoryName,
        purchaseAccount: input.purchaseAccount,
        salesAccount: input.salesAccount
      }
      axios.post('InventoryManagement/update-inventory-category', payload, {headers:{
        Authorization: `Bearer ${credentials.token}`
      }}).then(resp=>{
        toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover: true})
        getCategories()
      }).catch(error=>{
        toast(error.response.data.message, {type:'error', autoClose: false})
      })
    }
    const initialValues={
      description: '',
      purchase:'',
      sales:''
    }
const validationSchema= Yup.object({
description: Yup.string().required().label('Description'),
purchase: Yup.string().required().label('Purchase Account'),
sales: Yup.string().required().label('Sales Account')
})
    const onSubmit=(values)=>{
      const payload={
        description: values.description,
        purchaseAccount: values.purchase,
        salesAccount: values.sales
      }
      axios.post('InventoryManagement/add-inventory-category', payload, {headers:{
        Authorization: `Bearer ${credentials.token}`
      }}).then(resp=>{
        toast(resp.data.message,{type:'success', autoClose: 5000, pauseOnHover:true})
        getCategories()
      })
      .catch(error=>toast(error.response.data.message, {type:'error', autoClose: false}))
    }

      const column = [
        { Header: "Inventory Category", accessor: "inventoryCategoryName" },
        { Header: "Sales Account", accessor: "salesAccount" },
        { Header: "Purchase Account", accessor: "purchaseAccount" },
        { Header: "Action", accessor: "action", Cell:((cell)=>{
          const id = cell.row.original.inventoryCategoryId
            return <div className="d-flex fs-5 justify-content-center align-items-center" 
              data-bs-toggle="modal" data-bs-target="#categoryUpdate">
                <MdOutlineEdit onClick={()=>setId(id)} style={{cursor:'pointer'}}/>
            </div>
        }) },
      ];
    
      const columns = useMemo(() => column, []);
    
      const tableInstance = useTable(
        {
          columns: columns,
          data: data,
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
        setGlobalFilter,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage,
        pageCount,
      } = tableInstance;
      const { globalFilter, pageIndex } = state;
  return (
    <div className="card p-3 border-0 rounded-4">
      <div className="d-flex justify-content-between">
        <p className="active-selector">Item Category</p>
        <div data-bs-toggle="modal" data-bs-target="#product">
        <button className="btn btn-md text-white rounded-5" 
        style={{backgroundColor:'var(--custom-color)', fontSize:'14px'}}>
            Add new category
        </button>
         </div>
         
         {/* Add product modal */}
         <div
            className="modal fade"
            id="product"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog mt-4 py-4" role="document">
              <div className="modal-content card py-3 px-2 mx-auto">
                <Formik
                 onSubmit={onSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
                 >
                <Form className="px-2">
                    <h4 className="text-center" style={{fontSize:'18px'}}>Add new category</h4>
                    <div className="row g-1 ">
                    <label htmlFor="description" style={{fontWeight:'400'}}>Description:</label>
                  <Field name="description" as='textarea' className='py-1 px-2 rounded-3'
                   style={{border:'solid 1px #ddd', backgroundColor:'#fafafa'}}/>
                  </div>
                <div className="mt-3">
                  <div className="d-flex flex-column gap-1 mb-2">
                    <label htmlFor="purchase" style={{fontWeight:'400'}}>Purchase Account:</label>
                  <Field name="purchase" className='py-1 px-2 rounded-3'
                   style={{border:'solid 1px #ddd', height:'2.5rem', backgroundColor:'#fafafa'}} as='select'>
                    <option value="">Select Account</option>
                    {
                        accounts.map((sale)=>(
                          <option value={sale.glNumber} key={sale.glNumber}>{sale.accountName}</option>
                        ))
                      }
                    </Field>
                    <ErrorMessage name="purchase" component={ErrorText}/>
                  </div>
                  <div className="d-flex flex-column gap-1">
                    <label htmlFor="sales" style={{fontWeight:'500'}}>Sales Account:</label>
                  <Field name="sales" className='py-1 px-2 rounded-3'
                   style={{border:'solid 1px #ddd', height:'2.5rem', backgroundColor:'#fafafa'}} as='select'>
                    <option value="">Select Account</option>
                      {
                        accounts.map((sale)=>(
                          <option value={sale.glNumber} key={sale.glNumber}>{sale.accountName}</option>
                        ))
                      }
                    </Field>
                    <ErrorMessage name="sale" component={ErrorText}/>
                  </div>
                  </div>
                  <div className="d-flex justify-content-between mb-2 mt-4">
                    <button type="reset" className="btn btn-md" style={{fontSize:'14px', backgroundColor:'#e5e5e5', color:'#666'}}>Discard</button>
                    <button className="btn btn-md btn-primary" type="submit" style={{fontSize:'14px', }}>
                      Add Category
                    </button>
                  </div>
                  </Form>
                </Formik>
              </div>
            </div>
          </div>
       {/* End of modal to post product */}

       {/* Modal to update category */}
       <div
            className="modal fade"
            id="categoryUpdate"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog mt-4 py-4" role="document">
              <div className="modal-content card py-3 px-2 mx-auto">
                <form className="px-2" onSubmit={updateCategory}>
                    <h4 className="text-6 text-center">Edit category</h4>
                    <div className="row g-1">
                    <label htmlFor="description" style={{fontWeight:'500'}}>Description:</label>
                  <textarea name="inventoryCategoryName" value={input.inventoryCategoryName} onChange={handleChange}
                   className='py-1 px-2 rounded-3' style={{border:'solid 1px #ddd'}}/>
                  </div>
                <div className="d-flex flex-column gap-2 mt-3">
                  <div className="d-flex flex-column gap-1">
                    <label htmlFor="purchase" style={{fontWeight:'500'}}>Purchase Account:</label>
                  <select name="purchaseAccount" className='p-2 rounded-3' 
                  style={{border:'solid 1px #f2f2f2', backgroundColor:'#fafafa'}} value={input.purchaseAccount} onChange={handleChange} >
                    <option value="">Select Account</option>
                    {
                        accounts.map((sale)=>(
                          <option value={sale.glNumber} key={sale.glNumber}>{sale.accountName}</option>
                        ))
                      }
                    </select>
                  </div>
                  <div className="d-flex flex-column gap-1">
                    <label htmlFor="sales" style={{fontWeight:'500'}}>Sales Account:</label>
                  <select name="salesAccount" value={input.salesAccount} onChange={handleChange} 
                  className='p-2 rounded-3'
                   style={{border:'solid 1px #f2f2f2', backgroundColor:'#fafafa'}}>
                    <option value="">Select Account</option>
                      {
                        accounts.map((sale)=>(
                          <option value={sale.glNumber} key={sale.glNumber}>{sale.accountName}</option>
                        ))
                      }
                    </select>
                  </div>
                  </div>
                  <div className="d-flex my-4">
                    <button className="border-0 btn-md member w-100" type="submit">
                      Update Category
                    </button>
                  </div>
                  </form>
              </div>
            </div>
          </div>
       {/*End of Modal to update category */}
      </div>
      <div>
        <form className="search-form">
      <input
                type="text"
                name="search"
                value={globalFilter || ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search anything"
                className="py-2 search-inputs w-100 mt-2 px-2"
              />
            </form>
      <div className="table-responsive mt-4">
        <table {...getTableProps()} id="customers" className="table">
          <thead >
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} >
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {data.length > 0  && (
            <tbody {...getTableBodyProps()}>
              {page.map((row, index) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>

        {data.length > 0 ?<div className="d-flex justify-content-center gap-3 mt-2 align-items-center">
          <button
            onClick={() => gotoPage(0)}
            className="px-2 py-1 rounded-3 border-0 pagination-btn"
            disabled={!canPreviousPage}
          >
            {"<<"}
          </button>
          <button disabled={!canPreviousPage} className="px-2 py-1 rounded-3 border-0 pagination-btn">
            {" "}
            <FaAngleLeft onClick={() => previousPage()} />{" "}
          </button>
          <span>
            Page {""}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </span>
          <button disabled={!canNextPage} className="px-2 py-1 rounded-3 border-0 pagination-btn">
            <FaAngleRight onClick={() => nextPage()} />
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            className="px-2 py-1 rounded-3 border-0 pagination-btn"
            disabled={!canNextPage}
          >
            {">>"}
          </button>
        </div>:  <div className="d-flex justify-content-center flex-column">
              <LiaTimesCircle className='mx-auto' size={30}/>
              <p className="text-center">No record yet</p>
              </div> }
</div>

      </div>
      <ToastContainer/>
    </div>
    
  );
};

export default Product;
