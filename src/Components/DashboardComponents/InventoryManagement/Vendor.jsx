import React, { useEffect, useMemo, useState, useContext } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import axios from "../../../Components/axios";
import { UserContext } from "../../AuthContext";
import { ToastContainer, toast } from "react-toastify";
import Modal from 'react-modal'
import useScreenSize from "../../ScreenSizeHook";
import { LiaTimesCircle } from "react-icons/lia";

const Vendor = () => {
  const [data, setData] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [id, setId] = useState('')
  const [text, setText]= useState({})
  const [isOpen, setIsOpen]= useState(false)
  const [open, setOpen]= useState(false)
  const [input, setInput] = useState({
    vendorName: '',
    companyEmail:'',
    phone:'', 
    address:'',
    accountPayable:'',
    registrationNo:'',
  })
  const { credentials } = useContext(UserContext);
  function openModal(){
    setIsOpen(true)
  }
  function closeModal(){
    setIsOpen(false)
 }

 function handleOpenModal(){
  setOpen(true)
}
function handleCloseModal(){
  setOpen(false)
}

const changeHandler =(e)=>{
  const name = e.target.name;
  const value = e.target.value;
  setText({...text, [name]:value})
}
  const getSalesAccounts = () => {
    axios("InventoryManagement/inventory-category-account-select", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => {
      setAccounts(resp.data.data);
    });
  };
  useEffect(() => {
    getSalesAccounts();
  }, []);
  const getVendors = () => {
    axios("InventoryManagement/vendors", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) =>{
if (resp.data.data.vendors) {
  setData(resp.data.data.vendors)
}}
    );
  };
  useEffect(() => {
    getVendors();
  }, []);
  const column = [
    { Header: "Vendor ID", accessor: "vendorId" },
    { Header: "Company Name", accessor: "companyName" },
    { Header: "Reg. No", accessor: "registrationNo" },
    { Header: "Email", accessor: "companyEmail" },
    { Header: "Address", accessor: "address" },
    { Header: "Payable Acct.", accessor: "accountPayable" },
    {
      Header: "Action",
      accessor: "action",
      Cell: ({cell}) => {
        const id = cell.row.original.vendorId
        return (
          <div className="d-flex gap-3 fs-6 align-items-center">
            <MdOutlineEdit style={{ cursor: "pointer" }} role="button"
            onClick={()=>{
              setId(id)
              handleOpenModal()
            }
            }
             />
          </div>
        );
      },
    },
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
  

  const handleChange=(e)=>{
    const name= e.target.name;
    const value= e.target.value;
  setInput({...input, [name]:value})
  }

  const getVendorDetails=()=>{
    axios(`InventoryManagement/vendor?vendorId=${id}`, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then((resp)=>setInput(resp.data.data))
  }
  useEffect(()=>{
getVendorDetails()
  },[id])
 

  const onSubmit = (e) => {
    e.preventDefault()
    const payload = {
      registrationNo: text.regNo,
      vendorName: text.vendorName,
      companyEmail: text.companyEmail,
      phoneNumber: text.phoneNumber,
      address: text.address,
      accountPayable: text.acctPayable,
    };
    axios
      .post("InventoryManagement/add-Vendor", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) => {
        toast(resp.data.message, {
          type: "success",
          autoClose: 5000,
          pauseOnHover: true,
        });
        setTimeout(() => {
        getVendors();
        closeModal()
        }, 5000);
      })
      .catch((error) => {
        toast(error.response.data.message, { type: "error", autoClose: false });
      });
  };

  const updateVendor=(e)=>{
    e.preventDefault()
    const payload={
      registrationNo: input.registrationNo,
      vendorName: input.vendorName,
      email: input.companyEmail,
      vendorId: Number(input.vendorId),
      phone: input.phone,
      address: input.address,
      accountPayable: input.accountPayable,
    }
    axios.post('InventoryManagement/update-Vendor', payload,{headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      toast(resp.data.message, {type:'success', autoClose: 5000, pauseOnHover:true})
      setTimeout(() => {
        getVendors()
        handleCloseModal()
      }, 5000);
    }).catch(error=>{
      toast(error.response.data.message, {type:'error', autoClose:false})
    })
  }
  const { width } = useScreenSize();
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      height: "65%",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      // padding:'1rem',
      borderRadius: "1rem",
      width: width > 900 ? "800px" : "320px",
      // overFlowY: "scroll",
    },
  };

  return (
    <div className="card p-3 border-0 rounded-4">
      <div className="d-flex justify-content-between">
        <p className="active-selector">Vendor</p>
          <button
            className="btn btn-md text-white rounded-5"
            onClick={()=>{openModal()}}
            style={{ backgroundColor: "var(--custom-color)", fontSize: "14px" }}
          >
            Add new vendor
          </button>

        {/* Add product modal */}
              <Modal
              isOpen={isOpen}
              onRequestClose={closeModal}
              style={customStyles}>
              <form onSubmit={onSubmit} >
                <div className="px-2">
                  <h4 className="text-center" style={{fontSize:'18px'}}>Add new vendor</h4>
                  <div className="cooperative-info-form-wrapper">
                    <div className="row g-1">
                      <label htmlFor="vendorName" style={{ fontWeight: "500" }}>
                        Vendor Name:
                      </label>
                      <input name="vendorName" onChange={changeHandler} required/>
                    </div>
                    <div className="row g-1">
                      <label htmlFor="regNo" style={{ fontWeight: "500" }}>
                        Registration No:
                      </label>
                      <input name="regNo" onChange={changeHandler}/>
                    </div>
                    <div className="row g-1 ">
                      <label htmlFor="email" style={{ fontWeight: "500" }}>
                        Email:
                      </label>
                      <input name="companyEmail" onChange={changeHandler}/>
                    </div>
                    <div className="row g-1 ">
                      <label
                        htmlFor="acctPayable"
                        style={{ fontWeight: "500" }}
                      >
                        Account Payable:
                      </label>
                      <select name="acctPayable" as="select" onChange={changeHandler}>
                        <option value="">Select</option>
                        {accounts.map((account) => (
                          <option
                            value={account.glNumber}
                            key={account.glNumber}
                          >
                            {account.accountName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="row g-1 ">
                      <label htmlFor="address" style={{ fontWeight: "500" }}>
                        Address:
                      </label>
                      <input name="address" onChange={changeHandler}/>
                    </div>
                    <div className="row g-1 ">
                      <label
                        htmlFor="phoneNumber"
                        style={{ fontWeight: "500" }}
                      >
                        Phone Number:
                      </label>
                      <input name="phoneNumber" onChange={changeHandler}/>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between my-3">
                    <button type="reset" className="btn btn-md" style={{fontSize:'14px', color:'#666', backgroundColor:'#e5e5e5'}}>
                      Discard
                    </button>
                    <button className="btn btn-md btn-primary" type="submit" style={{fontSize:'14px'}}>
                      Add Vendor
                    </button>
                  </div>
                </div>
              </form>
            </Modal>
       
        {/* End of modal to post product */}

        {/* Modal to update vendor details */}
        <Modal 
        isOpen={open}
        onRequestClose={handleCloseModal}
        style={customStyles}
        >
              <form onSubmit={updateVendor}>
                <h2 style={{fontSize:'18px', fontWeight:'600', textAlign:'center'}}>Update Vendor</h2>
                <div className="cooperative-info-form-wrapper">
                <div className="row g-1">
                        <label htmlFor="vendorName">Vendor Name:</label>
                        <input type="text" name="vendorName" value={input.vendorName} 
                         style={{border:'solid 1px #f2f2f2'}} onChange={handleChange} />
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <label htmlFor="registrationNo">Registration No:</label>
                        <input type="text" value={input.registrationNo}  name="registrationNo" 
                         style={{border:'solid 1px #f2f2f2'}} onChange={handleChange} />
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <label htmlFor="companyEmail">Email:</label>
                        <input type="text" value={input.companyEmail} name="companyEmail" 
                         style={{border:'solid 1px #f2f2f2'}} onChange={handleChange} />
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <label htmlFor="accountPayable">Account Payable:</label>
                        <select type="text" name="accountPayable" 
                         style={{border:'solid 1px #f2f2f2'}} value={input.accountPayable} onChange={handleChange} >
                          <option value="">Select</option>
                          {
                            accounts.map(account=>(
                              <option value={account.glNumber} key={account.glNumber}>
                                {account.accountName}</option>
                            ))
                          }
                          </select>
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <label htmlFor="phone">Phone Number:</label>
                        <input type="text" name="phone" value={input.phone} 
                         style={{border:'solid 1px #f2f2f2'}} onChange={handleChange} />
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <label htmlFor="address">Address:</label>
                        <input type="text" name="address" value={input.address} 
                         style={{border:'solid 1px #f2f2f2'}} onChange={handleChange} />
                      </div>
                </div>
                <div className="d-flex mt-4 px-1">
                  <button className="member btn-md border-0 w-100 py-2 " type="submit">Update</button>
                </div>
              </form>
          </Modal>
          </div>
        {/*End of Modal to update Vendor details */}

      <div>
        <form className="search-form">
          <input
            type="text"
            name="search"
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search anything"
            className="p-2 search-inputs w-100 mt-2"
          />
        </form>
        <div className="table-responsive mt-4">
          <table {...getTableProps()} id="customers" className="table">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {data.length > 0 && (
              <tbody {...getTableBodyProps()}>
                {page.map((row, index) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            )
             }
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
            <button disabled={!canNextPage}className="px-2 py-1 rounded-3 border-0 pagination-btn">
              <FaAngleRight onClick={() => nextPage()} />
            </button>
            <button
              onClick={() => gotoPage(pageCount - 1)}
              className="px-2 py-1 rounded-3 border-0 pagination-btn"
              disabled={!canNextPage}
            >
              {">>"}
            </button>
          </div>: <div className="d-flex justify-content-center flex-column">
                        <LiaTimesCircle className='mx-auto' size={30}/>
                        <p className="text-center">No record yet</p>
                        </div>}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
export default Vendor;
