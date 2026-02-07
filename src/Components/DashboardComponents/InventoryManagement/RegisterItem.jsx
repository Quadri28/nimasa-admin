import React, { useEffect, useMemo, useState, useContext } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "../../../Components/axios";
import Modal from "react-modal";
import { UserContext } from "../../AuthContext";
import useScreenSize from "../../ScreenSizeHook";
import { ToastContainer, toast } from "react-toastify";
import DatePicker from "react-datepicker";
import * as Yup from 'yup'
import ErrorText from '../../DashboardComponents/ErrorText'
import { NumericFormat } from "react-number-format";
import { LiaTimesCircle } from "react-icons/lia";

const RegisterItem = () => {
  const [data, setData] = useState([]);
  const [add, setAdd] = useState(false);
  const [view, setView] = useState(false);
  const [id, setId] = useState("");
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([])
  const [item, setItem] = useState({});
  const [image, setImage]= useState('')
  const [file, setFile]= useState('')
  const [totalCost, setTotalCost]= useState(0)
  const { credentials } = useContext(UserContext);
  const [input, setInput]= useState({
    sellingPrice:'', unitCost:'', amountPaid:''
  })


  const changeHandler=(e)=>{
    const name = e.target.name;
    const value = e.target.value;
    setInput({...input, [name]:value})
  }

  const getVendors = () => {
    axios("InventoryManagement/vendor-select", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setVendors(resp.data.data));
  };
  const fetchAccounts=()=>{
    axios('InventoryManagement/inventory-category-account-select', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setAccounts(resp.data.data))
  }
  const getCategories = () => {
    axios("InventoryManagement/inventory-category-select", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setCategories(resp.data.data));
  };
  const getItems = () => {
    axios("InventoryManagement/register-items", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) =>{ 
      if (resp.data.data.registerItems) {
        setData(resp.data.data.registerItems)
      }}
      );
  };
  useEffect(() => {
    getVendors();
    getItems();
    fetchAccounts()
    getCategories();
  }, []);

  const getItem = () => {
    axios(`InventoryManagement/register-item?itemCode=${id}`, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setItem(resp.data.data));
  };
  useEffect(() => {
    getItem();
  }, [id]);
  const openAddRegister = () => {
    setAdd(true);
  };
  const closeAddRegister = () => {
    setAdd(false);
  };

  const openViewRegister = () => {
    setView(true);
  };
  const closeViewRegister = () => {
    setView(false);
  };

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

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setItem({ ...item, [name]: value });
  };

  const updateItem = (e) => {
    e.preventDefault()
    const payload= new FormData()
      payload.append('VendorId', item.vendorId)
      payload.append('CategoryId', item.categoryId)
      payload.append('ItemCode', item.itemCode)
      payload.append('ItemName', item.itemName)
      payload.append('CashAccount', item.cashAccount)
      payload.append('StockAccount', item.stockAccount)
      payload.append('Quantity', item.quantity)
      payload.append('UnitCost', item.unitCost)
      payload.append('SellingPrice', item.sellingPrice)
      payload.append('TotalCost', item.totalCost)
      payload.append('AmountPaid', item.amountPaid)
      payload.append('DatePurchased', item.datePurchased)
      payload.append('MaximumItemCanBuy', item.maximumItemCanBuy)
      payload.append('MinimumItemCanBuy', item.minimumItemCanBuy)
      payload.append('Narration', item.narration)
      payload.append('Narration', item.narration)
      payload.append('Narration', item.narration)
      payload.append('ProductImage', file)
    axios
      .post("InventoryManagement/update-register-item", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) =>{
        toast(resp.data.message, {
          type: "success",
          autoClose: 5000,
          pauseOnHover: true,
        })
        
        setTimeout(() => {
        getItems()
          closeViewRegister()
        }, 3000);
  })
      .catch((error) =>
        toast(error.response.data.message, { type: "error", autoClose: false })
      );
  };

const initialValues={
      vendorId: '',
      categoryId: '',
      itemName: '',
      cashAccount: '',
      maxItem:0,
      minItem:0,
      stockAccount: '',
      quantity: '',
      datePurchased: '',
      narration: '',
}

const validationSchema=Yup.object({
//   vendorId: Yup.string().required().label('Vendor'),
//   categoryId: Yup.string().required().label('Category'),
//   itemName: Yup.string().required().label('Item Name'),
//   cashAccount: Yup.string().required().label('Cash Account'),
//   stockAccount: Yup.string().required().label('Stock Account'),
//   quantity: Yup.string().required().label('Quantity'),
//   totalCost: Yup.string().required().label('Total Cost'),
//   amountPaid: Yup.string().required().label('Amount Paid'),
  datePurchased: Yup.string().required().label('Date'),
  narration: Yup.string().required().label('Narration'),
})

const onSubmit=(values)=>{
  const payload= new FormData()
    payload.append('VendorId', values.vendorId),
    payload.append('CategoryId',values.categoryId),
    payload.append('ItemName', values.itemName),
    payload.append('CashAccount', values.cashAccount),
    payload.append('StockAccount', values.stockAccount),
    payload.append('Quantity', Number(values.quantity)),
    payload.append('MaximumItemCanBuy', Number(values.maxItem)),
    payload.append('MinimumItemCanBuy', Number(values.minItem)),
    payload.append('UnitCost', Number(input.unitCost.replace(/,/g, ""))),
    payload.append('SellingPrice', Number(input.sellingPrice.replace(/,/g, ""))),
    payload.append('TotalCost', Number(totalCost)),
    payload.append('AmountPaid', Number(input.amountPaid.replace(/,/g, ""))),
    payload.append('DatePurchased', new Date(values.datePurchased).toLocaleDateString('en-CA')),
    payload.append('Narration', values.narration),
    payload.append('ProductImage', image)
  
  axios.post('InventoryManagement/add-register-item', payload, {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>{
    toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
    setInput({})
    setTimeout(() => {
      getItems()
      closeAddRegister()
    }, 3000);
  })
  .catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
}

  const column = [
    { Header: "Item Code", accessor: "itemCode" },
    { Header: "Item Name", accessor: "itemName" },
    { Header: "Quantity", accessor: "quantity" },
    {
      Header: "Cost Price",
      accessor: "costPrice",
      Cell: ({ value }) => {
        return new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value);
      },
    },
    {
      Header: "Selling Price",
      accessor: "sellingPrice",
      Cell: ({ value }) => {
        return new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value);
      },
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: ({ cell }) => {
        const id = cell.row.original.itemCode;
        return (
          <div className="d-flex justify-content-center fs-5 align-items-center">
            <MdOutlineEdit
              style={{ cursor: "pointer" }}
              onClick={() => {
                setId(id);
                openViewRegister();
              }}
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
  return (
    <div className="card p-3 border-0 rounded-4">
      <div className="d-flex justify-content-between">
        <p className="active-selector">Register Item</p>
        <button
          className="btn btn-md text-white rounded-5"
          style={{ backgroundColor: "var(--custom-color)", fontSize: "14px" }}
          onClick={openAddRegister}
        >
          + Register items
        </button>
      </div>
      <div className="table-responsive mt-4">
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
          {data.length > 0 && (
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
        </div>: <div className="d-flex justify-content-center flex-column">
                                <LiaTimesCircle className='mx-auto' size={30}/>
                                <p className="text-center">No record yet</p>
                                </div> }
      </div>
      {/* Register items */}
      <Modal
        isOpen={add}
        onRequestClose={closeAddRegister}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        <h4 style={{ fontSize: "18px", fontWeight: "600" }}>
          Register New Item
        </h4>
        <Formik onSubmit={onSubmit}
         initialValues={initialValues} 
         validationSchema={validationSchema}
         >
          {({ values }) => (
          <Form>
          <div className="item-register-container">
          <div className="">
              <label htmlFor="vendorId">Select Vendor:</label>
              <Field as='select'
                type="text"
                name="vendorId"
                className="w-100"
              >
                <option value="">Select Vendor</option>
                {vendors.map((vendor) => (
                  <option value={vendor.vendorId} key={vendor.vendorId}>
                    {vendor.vendorName}
                  </option>
                ))}
              </Field>
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="categoryId">Select Category:</label>
              < Field as='select'
                type="text"
                name="categoryId"
                className="w-100"
              >
                <option value="">Select</option>
                {categories.map((category) => (
                  <option
                    value={category.inventoryCategoryId}
                    key={category.inventoryCategoryId}
                  >
                    {category.inventoryCategoryDescription}
                  </option>
                ))}
              </Field>
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="itemName">Item Name:</label>
              <Field type="text" name="itemName" />
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="cashAccount">Cash Account:</label>
              <Field as='select' type="text" name="cashAccount" >
                <option value="">Select</option>
                {
                  accounts.map(account=>(
                    <option value={account.glNumber} key={account.glNumber}>{account.accountName}</option>
                  ))
                }
                </Field>
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="stockAccount">Stock Account:</label>
              <Field as='select' type="text" name="stockAccount" >
                <option value="">Select</option>
                {
                  accounts.map(account=>(
                    <option value={account.glNumber} key={account.glNumber}>{account.accountName}</option>
                  ))
                }
                </Field>
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="amountPaid">Amount Paid<sup className="text-danger">*</sup></label>
              <NumericFormat onChange={changeHandler} name="amountPaid"
              thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="quantity">Quantity</label>
              <Field type="text" name="quantity" />
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="unitCost">Unit Cost<sup className="text-danger">*</sup></label>
              <NumericFormat onChange={changeHandler} thousandSeparator={true} decimalScale={2}
               fixedDecimalScale={true} name="unitCost" required />
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="sellingPrice">Selling Price<sup className="text-danger">*</sup></label>
              <NumericFormat thousandSeparator={true} decimalScale={2} fixedDecimalScale={true}
               name="sellingPrice" required onChange={(e)=>{
                changeHandler(e)
                setTotalCost(values.quantity * Number(input?.unitCost?.replace(/,/, "")))
                }}/>
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="totalCost">Total Cost:</label>
              <input type="text" name="totalCost" value={totalCost}/>
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="datePurchased">Date Purchased:</label>
              <Field type="date" name="datePurchased" />
              <ErrorMessage component={ErrorText} name="datePurchased"/>
            </div>
             <div className="d-flex flex-column">
              <label htmlFor="minItem">Min. Item buyable:</label>
              <Field type="number" name="minItem" />
              <ErrorMessage component={ErrorText} name="minItem"/>
            </div>
             <div className="d-flex flex-column">
              <label htmlFor="maxItem">Max. Item buyable:</label>
              <Field type="number" name="maxItem" />
              <ErrorMessage component={ErrorText} name="maxItem"/>
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="narration">Narration:</label>
              <Field type="text" name="narration" />
              <ErrorMessage component={ErrorText} name="narration"/>
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="productImage">Product image:</label>
              <input type="file" name="productImage" onChange={(e)=>setImage(e.target.files[0])} />
            </div>
          </div>
          <div className="d-flex gap-3 mt-3 justify-content-end">
              <button className="px-3 btn btn-md rounded-4" type="reset"
              style={{backgroundColor:'#ddd'}}>Discard</button>
              <button className="px-3 border-0  btn-md member" type="submit">Submit</button>
        </div>
       </Form>)}
       
        </Formik>
      </Modal>

      {/* Edit Items */}
      <Modal
        isOpen={view}
        onRequestClose={closeViewRegister}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        <h4 style={{ fontSize: "18px", fontWeight: "600", textAlign:'center' }}>Edit Item</h4>
        <form onSubmit={updateItem}>
          <div className="item-register-container">
            <div className="d-flex flex-column">
              <label htmlFor="vendorId">Select Vendor:</label>
              <select
                type="text"
                name="vendorId"
                className="w-100"
                value={item?.vendorId}
                onChange={handleChange}
              >
                <option value="">Select Vendor</option>
                {vendors.map((vendor) => (
                  <option value={vendor.vendorId} key={vendor.vendorId}>
                    {vendor.vendorName}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="categoryId">Select Category:</label>
              <select
                type="text"
                name="inventoryCategoryId"
                className="w-100"
                value={item?.categoryId}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {categories.map((category) => (
                  <option
                    value={category.inventoryCategoryId}
                    key={category.inventoryCategoryId}
                  >
                    {category.inventoryCategoryDescription}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="itemName">Item Name:</label>
              <input type="text" name="itemName" value={item?.itemName} onChange={handleChange}/>
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="itemCode">Item Code:</label>
              <input type="text" name="itemCode" value={item?.itemCode} onChange={handleChange}/>
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="cashAccount">Cash Account:</label>
              <select type="text" name="cashAccount" value={item?.cashAccount} onChange={handleChange}>
                <option value="">Select</option>
                {
                  accounts.map(account=>(
                    <option value={account.glNumber} key={account.glNumber}>{account.accountName}</option>
                  ))
                }
                </select>
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="stockAccount">Stock Account:</label>
              <select as='select' type="text" name="stockAccount" value={item?.stockAccount} onChange={handleChange}>
                <option value="">Select</option>
                {
                  accounts.map(account=>(
                    <option value={account.glNumber} key={account.glNumber}>{account.accountName}</option>
                  ))
                }
                </select>
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="amountPaid">Amount Paid:</label>
              <input type="text" name="amountPaid" value={item?.amountPaid} onChange={handleChange}/>
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="quantity">Quantity:</label>
              <input type="text" name="quantity" value={item?.quantity} onChange={handleChange}/>
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="unitCost">Unit Cost:</label>
              <input type="text" name="unitCost" value={item?.unitCost} onChange={handleChange} />
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="sellingPrice">Selling Price:</label>
              <input type="text" name="sellingPrice" value={item?.sellingPrice} onChange={handleChange}/>
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="totalCost">Total Cost:</label>
              <input type="text" name="totalCost" value={item?.totalCost} onChange={handleChange}/>
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="minItem">Min. Item buyable:</label>
              <input type="number" name="minimumItemCanBuy" value={item?.minimumItemCanBuy} onChange={handleChange}/>
            </div>
             <div className="d-flex flex-column">
              <label htmlFor="maxItem">Max. Item buyable:</label>
              <input type="number" name="maximumItemCanBuy" value={item?.maximumItemCanBuy} onChange={handleChange}/>
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="datePurchased">Date Purchased:</label>
              <DatePicker
                          selected={
                            item?.datePurchased &&
                            !isNaN(Date.parse(item.datePurchased))
                              ? new Date(item.datePurchased)
                              : null
                          }
                          onChange={(date) =>
                            handleChange({
                              target: { name: "productExpire", value: date },
                            })
                          }
                          className="w-100"
                          dateFormat="dd-MM-yyyy"
                        />
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="narration">Narration:</label>
              <input type="text" name="narration" value={item?.narration} onChange={handleChange} />
            </div>
          </div>
          <div className="d-flex flex-column">
              <label htmlFor="itemImage">Item image:</label>
              <img src={item?.itemImage} alt="item-image" />
              <input type="file" name="file"  onChange={(e)=>setFile(e.target.files[0])} />
            </div>
          <div className="d-flex gap-3 mt-3 justify-content-end">
              <button className="px-3 btn btn-md rounded-4" type="reset"
              style={{backgroundColor:'#ddd'}}>Discard</button>
              <button className="px-3 border-0 btn-md member" type="submit">Submit</button>
        </div>
        </form>
      </Modal>
      <ToastContainer/>
    </div>
  );
};

export default RegisterItem;
