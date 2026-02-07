import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../axios";
import { UserContext } from "../../../AuthContext";
import { NumericFormat } from "react-number-format";
import { BsArrowLeft } from "react-icons/bs";
const ViewAssetClass = () => {
  const [categories, setCategories] = useState([])
  const [departments, setDepartments] = useState([])
  const [branches, setBranches] = useState([])
  const [asset, setAsset] = useState({
    amortisationClassCode: "",
    amortisationClassName: "",
    netBookValue: 0,
    assetCategoryCode: "",
    assetCategoryName: "",
    debitAccount: "",
    creditAccount: "",
    debitAccountName: "",
    creditAccountName: "",
    monthlydepreciationValue: 0,
    disposalDate: "",
    startDate: "",
    totalCost: 0,
    accumulatedDepreciation: 0,
    branchLocation: "",
    departmentLocation: "",
    lastDepreciationDate: "",
    nextDepreciationDate: "",
    tagNumber: "",
    userID: "",
    nodeID: 0,
    status: "",
  });
  const navigate = useNavigate()
  const { id } = useParams();
  const {credentials} = useContext(UserContext)
  const getAssetClass = async () => {
    axios(`AssetsClass/get-assets-class-by-code?assetsCode=${id}`, {
      headers: {
        Authorization: `Bearer ${credentials?.token}`,
      },
    }).then((resp) => {
      setAsset(resp?.data?.data);
    });
  };
  const getBranches=()=>{
    axios('Common/get-branches', {
      headers:{
        Authorization: `Bearer ${credentials?.token}`
      }
    }).then(resp=>setBranches(resp?.data))
    }
    const getDepartments=()=>{
      axios('Common/get-departments', {
        headers:{
          Authorization: `Bearer ${credentials?.token}`
        }
      }).then(resp=>setDepartments(resp?.data))
      }
    const getCategories =()=>{
      axios('AssetCategory/get-fixed-assets-categories', {headers:{
        Authorization:`Bearer ${credentials?.token}`
      }})
      .then(resp=>setCategories(resp?.data.data))
    }
  useEffect(()=>{
    getBranches()
  },[])
  useEffect(()=>{
    getDepartments()
  },[])
  
  useEffect(()=>{
    getCategories()
  }, [])
  useEffect(() => {
    getAssetClass();
  }, []);

  return (
    <div className="card rounded-4" style={{border:'solid .5px #fafafa'}}>
      <div
        className="justify-content-center p-3"
        style={{ backgroundColor: "#f4fAfd", borderRadius: "8px 8px 0 0" }}
      >
        <div className="d-flex gap-3 align-items-center">
          <BsArrowLeft
            style={{ fontSize: "20px", cursor: "pointer" }}
            onClick={() => navigate(-1)}
          />
          View Asset Class
        </div>
      </div>
      <form className="mb-4">
        <div className="px-4 admin-task-forms">
          <div className="row g-2">
            <label htmlFor="amortisationClassCode" >
              Asset Class Code:
            </label>
            <input
              name="amortisationClassCode"
              id="amortisationClassCode"
              value={asset?.amortisationClassCode}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="amortisationClassName" >
              Asset Class Name:
            </label>
            <input
              name="amortisationClassName"
              id="amortisationClassName"
              value={asset?.amortisationClassName}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="netBookValue" >
              Net Book Value:
            </label>
            <NumericFormat
            thousandSeparator={true}
            decimalScale={2}
            fixedDecimalScale
              name="netBookValue"
              id="netBookValue"
              value={asset?.netBookValue}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="categoryCode" >
              Category Code:
            </label>
            <select
              name="assetCategoryCode"
              id="assetCategoryCode"
              value={asset?.assetCategoryCode}
              readOnly
            >
          <option value="">Select</option>
        {
          categories.map((category)=>(
            <option value={category.categoryCode} key={category.categoryCode}>
              {category.categoryName}
            </option>
          ))
        }
            </select>
          </div>
          <div className="row g-2">
            <label htmlFor="assetCategoryName" >
              Asset Category Name:
            </label>
            <input
              name="assetCategoryName"
              id="assetCategoryName"
              value={asset?.assetCategoryName}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="code" >
              Debit Account:
            </label>
            <input
              name="debitAccount"
              id="debitAccount"
              value={asset?.debitAccount}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="code" >
              Credit Account:
            </label>
            <input
              name="creditAccount"
              id="creditAccount"
              value={asset?.creditAccount}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="code" >
            Monthly Depreciation Value:
            </label>
            <input
              name="monthlydepreciationValue"
              id="monthlydepreciationValue"
              value={asset?.monthlydepreciationValue}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="accumulatedDepreciation" >
            Accumulated Depreciation:
            </label>
            <NumericFormat
            thousandSeparator={true}
            decimalScale={2}
            fixedDecimalScale
              name="accumulatedDepreciation"
              id="accumulatedDepreciation"
              value={asset?.accumulatedDepreciation}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="totalCost" >
            Total Cost:
            </label>
            <NumericFormat
            thousandSeparator={true}
            decimalScale={2}
            fixedDecimalScale
              name="totalCost"
              id="totalCost"
              value={asset?.totalCost}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="branchLocation" >
            Branch Location:
            </label>
            <select
              name="branchLocation"
              id="branchLocation"
              value={asset?.branchLocation}
              readOnly
            > 
            <option value="">Select</option>
            {
              branches.map((branch)=>(
                <option value={branch.branchCode} key={branch.branchCode}>
                  {branch.branchName}
                </option>
              ))
            }
            </select>
          </div>
          <div className="row g-2">
            <label htmlFor="departmentLocation" >
            Department:
            </label>
            <select
              name="departmentLocation"
              id="departmentLocation"
              value={asset?.departmentLocation}
              readOnly
            >
            <option value="">Select</option>
            {
               departments.map((department)=>(
                <option value={department.departmentId} key={department.departmentId}>
                  {department.departmentName}
                </option>
              ))
            }
            </select>
          </div>
          <div className="row g-2">
            <label htmlFor="lastDepreciationDate" >
            Last Depreciation Date:
            </label>
            <input
              name="lastDepreciationDate"
              id="lastDepreciationDate"
              value={new Date(asset?.lastDepreciationDate).toLocaleDateString('en-us')}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="nextDepreciationDate" >
            Next Depreciation Date:
            </label>
            <input
              name="nextDepreciationDate"
              id="nextDepreciationDate"
              value={new Date(asset?.nextDepreciationDate).toLocaleDateString('en-us')}
              readOnly
            />
          </div>
          <div className="row g-2">
            <label htmlFor="tagNumber" >
            Tag Number:
            </label>
            <input
              name="tagNumber"
              id="tagNumber"
              value={asset?.tagNumber}
              readOnly
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ViewAssetClass;
