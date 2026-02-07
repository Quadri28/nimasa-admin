import React, { useContext, useEffect, useMemo, useState } from "react";

import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { GoArrowUp } from "react-icons/go";
import { Field, Formik, Form } from "formik";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import Table from "./Table";
import { toast, ToastContainer } from "react-toastify";

const BuySMS = () => {
  const { credentials } = useContext(UserContext);
  const [histories, setHistories] = useState([]);
const [loading, setLoading] = useState('')
  const [pageCount, setPageCount] = useState(0);
 const [pageNumber, setPageNumber] = useState(0)
 const [pageSize, setPageSize] = useState(10)
  const fetchIdRef = React.useRef(0);
  const [units, setUnits] = useState([]);
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState({});
  const [statistic, setStatistic] = useState({})

  //Function to buy SMS
  const buySMS = (e) => {
    e.preventDefault();
    axios(
      `Communication/buy-sms-unit?UnitQuantity=${unit}&UnitAmount=${price.price}`,
      {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      }
    ).then(resp=>{
      toast(resp.data.message, {type:'success', autoClose:5000})
      fetchData({pageSize:10, pageNumber:1})
    }).catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}));
  };
 //Fetching units
 const getUnitPrices = () => {
  axios("Communication/list-sms-unit-price", {
    headers: {
      Authorization: `Bearer ${credentials.token}`,
    },
  }).then((resp) => setUnits(resp.data.data));
};

// Fetching SMS statistics

const FetchStatistics=()=>{
  axios('Communication/sms-unit-statistics', {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>setStatistic(resp.data.data))
}

// Fetching Price
const fetchPrice = () => {
  axios(
    `Communication/sms-unit-detail-by-sms-unit-priceId?smsUnitPriceId=${unit}`,
    {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }
  ).then((resp) => setPrice(resp.data.data));
};
useEffect(() => {
  getUnitPrices();
  FetchStatistics()
}, []);

useEffect(() => {
  fetchPrice();
}, [unit]);


  const fetchData = React.useCallback(({ pageSize, pageNumber }) => {
    const fetchId = ++fetchIdRef.current;

    setLoading(true);
    setTimeout(() => {
      if (fetchId === fetchIdRef.current) {
        axios(
          `Communication/sms-purchase-histories?PageSize=${pageSize}&PageNumber=${pageNumber+1}`,
          {
            headers: {
              Authorization: `Bearer ${credentials.token}`,
            },
          }
        ).then((resp) => {
          if (resp.data.data.modelResult) {
            setHistories(resp.data.data.modelResult);
            setPageCount(Math.ceil(resp.data.data.totalCount / pageSize));
          }
         
        });
        setLoading(false);
      }
    }, 1000);
  }, []);

 useEffect(() => {
    fetchData({ pageSize, pageNumber });
  }, [fetchData, pageNumber, pageSize])

  const column = [
    { Header: "Reference", accessor: "reference" },
    { Header: "Full Name", accessor: "fullName" },
    { Header: "Amount", accessor: "unitPrice", Cell:(({value})=>{
      return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
    }) },
    { Header: "Unit", accessor: "unit" },
    { Header: "Channel", accessor: "channel" },
    { Header: "Gateway Response", accessor: "gatewayResponse" },
  ];

  const columns = useMemo(() => column, []);
 
  return(
    <div className="card p-3 border-0 rounded-4">
      <div className="d-flex justify-content-between mt-3">
        <h5 style={{fontSize:'16px'}}>Buy SMS</h5>
        <div data-bs-toggle="modal" data-bs-target="#buy-sms">
          <button
            className="border-0 member btn-md"
          >
            Buy SMS
          </button>
        </div>
        <div
          className="modal fade"
          id="buy-sms"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog mt-4 py-4" role="document">
            <div className="modal-content card p-3">
              <form onSubmit={buySMS}>
                <h5 className="mb-3 text-center">Buy SMS units</h5>
                <div className="row align-items-center g-2 gap-2 justify-content-center">
                  <div className="row col-md-6 mb-3">
                    <label style={{ fontWeight: "500" }}>
                      Select SMS units:
                    </label>
                    <select
                      name={unit}
                      as="select"
                      onChange={(e) => setUnit(e.target.value)}
                      style={{
                        height: "2.5rem",
                        backgroundColor: "#f7f4fa",
                        border: "none",
                        borderRadius: "10px",
                      }}
                    >
                      <option value="">Select unit</option>
                      {units.map((unit) => (
                        <option value={unit.id} key={unit.id}>
                          {unit.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="row col-md-6 mb-3">
                    <label htmlFor="units"> Unit Amount:</label>
                    <input
                      name="price"
                      value={price.price}
                      readOnly
                      style={{
                        height: "2.5rem",
                        backgroundColor: "#f7f4fa",
                        border: "none",
                        borderRadius: "10px",
                      }}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-end gap-3 mt-3 px-3">
                  <button type="reset" className="border-0 discard-btn px-3 py-2 rounded-4">
                    Discard
                  </button>
                  <button type="submit" className="border-0 member btn-md rounded-4">
                    Proceed
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="p-1 admin-task-forms">
        <div className="p-3 bg-light align-items-center rounded-4 mt-2 sms">
          <div>
            <p className="text-uppercase small-card-title fs-7 ">
              Available SMS in units
            </p>
            <div className="d-flex justify-content-between align-items-baseline">
              <b>{statistic.availableSmsUnit >0 ? statistic.availableSmsUnit: 0} units</b>
            </div>
          </div>
        </div>
        <div className="p-3 bg-light align-items-center rounded-4 mt-2 sms">
          <div>
            <p className="text-uppercase small-card-title fs-7 ">
              Recently purchased SMS
            </p>
            <div className="d-flex justify-content-between align-items-baseline">
              <b>{statistic.recentlyPurchasedSmsUnit >0 ?statistic.recentlyPurchasedSmsUnit : 0 } units </b>
            </div>
          </div>
        </div>
        <ToastContainer/>
      </div>
    <Table 
    fetchData={fetchData}
    pageCount={pageCount}
    columns={columns}
    data={histories}
    pageNumber={pageNumber}
    setPageNumber={setPageNumber}
    pageSize={pageSize}
    setPageSize={setPageSize}
    />
    </div>
  )
};

export default BuySMS;
