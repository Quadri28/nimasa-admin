import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../AuthContext";
import axios from "../../../axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { TfiAngleLeft } from "react-icons/tfi";
import { BsArrowLeft } from "react-icons/bs";

const EditAssetCategory = () => {
    const [accounts, setAccounts] = useState([]);
const fetchAccounts = async () => {
    await axios("AssetsClass/ListGeneralLedgerAccountNumbers", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => {
      setAccounts(resp.data.data);
    });
  };
 
  useEffect(() => {
    fetchAccounts();
  }, []);
  const [assets, setAssets] = useState({
    categoryCode: "",
    debitAccount: "",
    categoryName: "",
    creditAccount: "",
    depreciationRate: "",
    suspenseAcct: "",
    residualValue: "",
    disposalAcct: "",
    lifeSpan: "",
    assetAccount: "",
  });
  const navigate = useNavigate();
  const {credentials} = useContext(UserContext);
  const { id } = useParams();
  const getAssets = async () => {
    await axios(
      `AssetCategory/get-fixed-assets-category-by-code?fixedAssetCategory=${id}`,
      {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      }
    ).then((resp) => setAssets(resp.data.data));
  };
  useEffect(() => {
    getAssets();
  }, []);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setAssets({ ...assets, [name]: value });
  };
  const submitHandler = (e) => {
    e.preventDefault()
    const toastOptions = {
      autoClose: 5000,
      pauseOnHover: true,
      type: "success",
    };
    const payload = {
      categoryCode: assets.categoryCode,
      categoryName: assets.categoryName,
      debitAccount: assets.debitAccount,
      creditAccount: assets.creditAccount,
      depreciationRate: assets.depreciationRate,
      suspenseAcct: assets.suspenseAcct,
      disposalAcct: assets.disposalAcct,
      residualValue: assets.residualValue,
      lifeSpan: assets.lifeSpan,
      assetAccount: assets.assetAccount,
    };
    axios.post(`AssetCategory/update-fixed-assets-category`, payload, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then(() => {
      setTimeout(() => {
        navigate(-1)
      }, 5000);
        toast("Asset edited successfully", toastOptions)
    });
  };
  return (
    <div className="card rounded-4 mt-3" style={{border:'solid .5px #fafafa'}}>
      <div
        className="justify-content-center p-3"
        style={{ backgroundColor: "#f4fAfd", borderRadius: "8px 8px 0 0" }}
      >
        <div className="d-flex gap-2 align-items-center">
          <BsArrowLeft
           style={{ fontSize: "20px", cursor: "pointer" }}
            onClick={() => navigate(-1)}
          />
          Edit Asset Category
        </div>
      </div>
      <form onSubmit={submitHandler}>
        <div className="px-4 admin-task-forms">
          <div className="row g-2">
            <label htmlFor="code" >
              Category Code
            </label>
            <input
              name="categoryCode"
              id="categoryCode"
              min={0}
              onChange={handleChange}
              value={assets.categoryCode}
              disabled
            />
          </div>
          <div className="row g-2">
            <label htmlFor="debitAccount" >
              Debit Account <sup className="text-danger">*</sup>
            </label>
            <select name="debitAccount" id="debitAccount" min={0}       onChange={handleChange}
              value={assets.debitAccount}>
              <option value="">Select</option>
              {
                accounts.map(account=>(
                  <option value={account.accountNumber} key={account.accountNumber}>{account.accountName}</option>
                ))
              }
              </select>
          </div>
          <div className="row g-2">
            <label htmlFor="categoryName" >
              Category Name <sup className="text-danger">*</sup>
            </label>
            <input name="categoryName" id="categoryName" min={0}       onChange={handleChange}
              value={assets.categoryName}/>
          </div>
          <div className="row g-2">
            <label htmlFor="creditAccount" >
              Credit Account <sup className="text-danger">*</sup>
            </label>
            <select
              name="creditAccount"
              id="creditAccount"
              type="number"
              min={0}
              onChange={handleChange}
              value={assets.creditAccount}
            >
               <option value="">Select</option>
              {
                accounts.map(account=>(
                  <option value={account.accountNumber} key={account.accountNumber}>{account.accountName}</option>
                ))
              }
            </select>
          </div>
          <div className="row g-2">
            <label htmlFor="depreciationRate" >
              Depreciation Rate <sup className="text-danger">*</sup>
            </label>
            <input
              name="depreciationRate"
              id="depreciationRate"
              min={0}
              type="number"
              onChange={handleChange}
              value={assets.depreciationRate}
            />
          </div>
          <div className="row g-2">
            <label htmlFor="suspenseAcct" >
              Suspense Account <sup className="text-danger">*</sup>
            </label>
            <select name="suspenseAcct" id="suspenseAcct" min={0} 
                  onChange={handleChange}
                  value={assets.suspenseAcct}>
                     <option value="">Select</option>
              {
                accounts.map(account=>(
                  <option value={account.accountNumber} key={account.accountNumber}>{account.accountName}</option>
                ))
              }
            </select>
          </div>
          <div className="row g-2">
            <label htmlFor="residualValue" >
              Residual Value <sup className="text-danger">*</sup>
            </label>
            <input
              name="residualValue"
              id="residualValue"
              min={0}
              type="number"
              onChange={handleChange}
              value={assets.residualValue}
            />
          </div>
          <div className="row g-2">
            <label htmlFor="disposalAcct" >
              Disposal Account <sup className="text-danger">*</sup>
            </label>
            <select
              name="disposalAcct"
              id="disposalAcct"
              min={0}
              onChange={handleChange}
              value={assets.disposalAcct}
            >
               <option value="">Select</option>
              {
                accounts.map(account=>(
                  <option value={account.accountNumber} key={account.accountNumber}>{account.accountName}</option>
                ))
              }
            </select>
          </div>
          <div className="row g-2">
            <label htmlFor="lifeSpan" >
              Life Span (Months)<sup className="text-danger">*</sup>
            </label>
            <input name="lifeSpan" id="lifeSpan" min={0} type="number"   onChange={handleChange}
              value={assets.lifeSpan} />
          </div>
          <div className="row g-2">
            <label htmlFor="assetAccount" >
              Asset Account <sup className="text-danger">*</sup>
            </label>
            <select name="assetAccount" id="assetAccount" min={0} 
                  onChange={handleChange}
                  value={assets.assetAccount}>
                 <option value="">Select</option>
              {
                accounts.map(account=>(
                  <option value={account.accountNumber} key={account.accountNumber}>{account.accountName}</option>
                ))
              }
              </select>
          </div>
        </div>
        <div className="d-flex justify-content-end mt-3 p-3 gap-3"
         style={{backgroundColor:'#f2f2f2', borderRadius:'0 0 15px 15px'}}>
            <button type="reset" className="btn-md discard border-0 px-3 rounded-5">
              Discard
            </button>
            <button
              type="submit"
              className="border-0 member btn-md"
            >
              Update category
            </button>
          </div>
        <ToastContainer />
      </form>
    </div>
  );
};

export default EditAssetCategory;
