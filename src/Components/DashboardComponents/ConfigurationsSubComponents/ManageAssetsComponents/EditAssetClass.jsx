import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../axios";
import { UserContext } from "../../../AuthContext";
import { NumericFormat } from "react-number-format";
import { ToastContainer, toast } from "react-toastify";
import { BsArrowLeft } from "react-icons/bs";

const EditAssetClass = () => {
  const [categories, setCategories] = useState([]);
  const [netBook, setNetBook] = useState({});
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
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
  const navigate = useNavigate();
  const { id } = useParams();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setAsset({ ...asset, [name]: value });
  };
  const { credentials } = useContext(UserContext);
  const getAssetClass = async () => {
    axios(`AssetsClass/get-assets-class-by-code?assetsCode=${id}`, {
      headers: {
        Authorization: `Bearer ${credentials?.token}`,
      },
    }).then((resp) => {
      setAsset(resp?.data?.data);
    });
  };
  const getBranches = () => {
    axios("Common/get-branches", {
      headers: {
        Authorization: `Bearer ${credentials?.token}`,
      },
    }).then((resp) => setBranches(resp?.data));
  };
  const getDepartments = () => {
    axios("Common/get-departments", {
      headers: {
        Authorization: `Bearer ${credentials?.token}`,
      },
    }).then((resp) => setDepartments(resp?.data));
  };
  const getCategories = () => {
    axios("AssetCategory/get-fixed-assets-categories", {
      headers: {
        Authorization: `Bearer ${credentials?.token}`,
      },
    }).then((resp) => setCategories(resp?.data.data));
  };
  useEffect(() => {
    getBranches();
  }, []);
  useEffect(() => {
    getDepartments();
  }, []);

  useEffect(() => {
    getCategories();
  }, []);
  useEffect(() => {
    getAssetClass();
  }, []);

  const getNetBook = () => {
    axios(
      `AssetsClass/AssetsClassTotalCostTextChanged?AssetCategoryCode=${asset?.assetCategoryCode}&TotalCost=${asset?.totalCost}&AccumulatedDepreciation=${asset?.accumulatedDepreciation}`,
      {
        headers: {
          Authorization: `Bearer ${credentials?.token}`,
        },
      }
    ).then((resp) => setNetBook(resp.data.data));
  };
  useEffect(() => {
    getNetBook();
  }, [
    asset?.accumulatedDepreciation,
    asset?.totalCost,
    asset?.assetCategoryCode,
  ]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const toastOptions = {
      type: "success",
      pauseOnHover: true,
      autoClose: 5000,
    };
    const payload = {
      amortisationClassCode: asset.amortisationClassCode,
      amortisationClassName: asset.amortisationClassName,
      netBookValue: String(netBook.netBookValue),
      assetCategoryCode: asset.assetCategoryCode,
      debitAccount: asset.debitAccount,
      creditAccount: asset.creditAccount,
      monthlydepreciationValue: Number(netBook.monthlyDepreciationValue),
      purchaseDate: asset.purchaseDate,
      totalCost: Number(asset.totalCost),
      accumulatedDepreciation: Number(asset.accumulatedDepreciation),
      branchLocation: asset.branchLocation,
      departmentLocation: asset.departmentLocation,
      lastDepreciationDate: asset.lastDepreciationDate,
      tagNumber: asset.tagNumber,
    };
    axios
      .post("AssetsClass/update-assets-class", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then(() => {
        toast("Asset class updated successfully", toastOptions);
        getAssetClass();
      })
      .catch((error) => {
        const errorToastOptions = {
          type: "error",
          autoClose: 5000,
          pauseOnHover: true,
        };
        toast(error.response.data.message, errorToastOptions);
        console.log(error);
      });
  };

  return (
    <div className="card rounded-4" style={{ border: "solid 1px #fafafa" }}>
      <div
        className="justify-content-center p-3"
        style={{ backgroundColor: "#f4fAfd", borderRadius: "8px 8px 0 0" }}
      >
        <div className="d-flex gap-2 align-items-center">
          <BsArrowLeft
            style={{ fontSize: "20px", cursor: "pointer" }}
            onClick={() => navigate(-1)}
          />
          Edit Asset Class
        </div>
      </div>
      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="px-4 admin-task-forms">
          <div className="row g-2">
            <label htmlFor="amortisationClassCode">Asset Class Code:</label>
            <input
              name="amortisationClassCode"
              id="amortisationClassCode"
              value={asset?.amortisationClassCode}
              onChange={handleChange}
            />
          </div>
          <div className="row g-2">
            <label htmlFor="amortisationClassName">Asset Class Name:</label>
            <input
              name="amortisationClassName"
              id="amortisationClassName"
              value={asset?.amortisationClassName}
              onChange={handleChange}
            />
          </div>
          <div className="row g-2">
            <label htmlFor="categoryCode">Category Code:</label>
            <select
              name="assetCategoryCode"
              id="assetCategoryCode"
              value={asset?.assetCategoryCode}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {categories.map((category) => (
                <option
                  value={category.categoryCode}
                  key={category.categoryCode}
                >
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>
          <div className="row g-2">
            <label htmlFor="assetCategoryName">Asset Category Name:</label>
            <input
              name="assetCategoryName"
              id="assetCategoryName"
              value={asset?.assetCategoryName}
              onChange={handleChange}
            />
          </div>
          <div className="row g-2">
            <label htmlFor="code">Debit Account:</label>
            <input
              name="debitAccount"
              id="debitAccount"
              value={asset?.debitAccount}
              onChange={handleChange}
            />
          </div>
          <div className="row g-2">
            <label htmlFor="code">Credit Account:</label>
            <input
              name="creditAccount"
              id="creditAccount"
              value={asset?.creditAccount}
              onChange={handleChange}
            />
          </div>
          <div className="row g-2">
            <label htmlFor="totalCost">Total Cost:</label>
            <NumericFormat
              name="totalCost"
              decimalScale={2}
              thousandSeparator
              fixedDecimalScale
              value={asset?.totalCost}
              onValueChange={(values) =>
                setAsset((prev) => ({
                  ...prev,
                  totalCost: values.floatValue ?? 0,
                }))
              }
            />
          </div>
          <div className="row g-2">
            <label htmlFor="accumulatedDepreciation">
              Accumulated Depreciation:
            </label>
            <input
              name="accumulatedDepreciation"
              id="accumulatedDepreciation"
              value={asset?.accumulatedDepreciation}
              onChange={handleChange}
            />
          </div>
          <div className="row g-2">
            <label htmlFor="netBookValue">Net Book Value:</label>
            <input
              name="netBookValue"
              id="netBookValue"
              value={netBook?.netBookValue}
              disabled
            />
          </div>
          <div className="row g-2">
            <label htmlFor="code">Monthly Depreciation Value:</label>
            <input
              name="monthlydepreciationValue"
              id="monthlydepreciationValue"
              value={netBook?.monthlyDepreciationValue}
              disabled
            />
          </div>
          <div className="row g-2">
            <label htmlFor="branchLocation">Branch Location:</label>
            <select
              name="branchLocation"
              id="branchLocation"
              value={asset?.branchLocation}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {branches.map((branch) => (
                <option value={branch.branchCode} key={branch.branchCode}>
                  {branch.branchName}
                </option>
              ))}
            </select>
          </div>
          <div className="row g-2">
            <label htmlFor="departmentLocation">Department:</label>
            <select
              name="departmentLocation"
              id="departmentLocation"
              value={asset?.departmentLocation}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {departments.map((department) => (
                <option
                  value={department.departmentId}
                  key={department.departmentId}
                >
                  {department.departmentName}
                </option>
              ))}
            </select>
          </div>
          <div className="row g-2">
            <label htmlFor="lastDepreciationDate">
              Last Depreciation Date:
            </label>
            <input
              name="lastDepreciationDate"
              id="lastDepreciationDate"
              value={new Date(asset?.lastDepreciationDate).toLocaleDateString(
                "en-us"
              )}
              onChange={handleChange}
            />
          </div>
          <div className="row g-2">
            <label htmlFor="nextDepreciationDate">
              Next Depreciation Date:
            </label>
            <input
              name="nextDepreciationDate"
              id="nextDepreciationDate"
              value={new Date(asset?.nextDepreciationDate).toLocaleDateString(
                "en-us"
              )}
              onChange={handleChange}
            />
          </div>
          <div className="row g-2">
            <label htmlFor="tagNumber">Tag Number:</label>
            <input
              name="tagNumber"
              id="tagNumber"
              value={asset?.tagNumber}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="d-flex justify-content-end px-2">
          <button className="border-0 member btn-md" type="submit">
            Update Asset
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditAssetClass;
