import React, { useState, useContext, useEffect } from "react";
import ErrorText from "../../ErrorText";
import { UserContext } from "../../../AuthContext";
import { ToastContainer, toast } from "react-toastify";
import axios from "../../../axios";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { NumericFormat } from "react-number-format";

const AddAssetClass = () => {
  const [categories, setCategories] = useState([]);
  const [code, setCode] = useState({});
  const [loading, setLoading] = useState(false);
  const [netBook, setNetBook] = useState({});
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [accounts, setAccounts] = useState({});
  const [tag, setTag] = useState({});
  const [text, setText] = useState({});
  const { credentials } = useContext(UserContext);

  const getTag = () => {
    axios(
      `AssetsClass/get-tag-number?AssetCategoryCode=${text?.categorySelection}&DepartmentLocation=${text?.branchLocation}&AmortizationClassCode=${code}&PurchaseDate=${text?.purchaseDate}`,
      {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      }
    ).then((resp) => setTag(resp.data.data));
  };
  useEffect(() => {
    getTag();
  }, [
    code,
    text?.categorySelection,
    text?.purchaseDate,
    text?.departmentLocation,
  ]);
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setText({ ...text, [name]: value });
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
  const getAmortizationCode = () => {
    axios("AssetsClass/GetAmortisationClassCode", {
      headers: {
        Authorization: `Bearer ${credentials?.token}`,
      },
    }).then((resp) => setCode(resp.data.data.amortisationClassCode));
  };
  const getAccounts = () => {
    axios(
      `AssetsClass/GetCreditAndDebitAccountNumberByCategoryCode?AssetCategoryCode=${text?.categorySelection}`,
      {
        headers: {
          Authorization: `Bearer ${credentials?.token}`,
        },
      }
    ).then((resp) => setAccounts(resp?.data?.data));
  };
  const getNetBook = () => {
    axios(
      `AssetsClass/AssetsClassTotalCostTextChanged?AssetCategoryCode=${text?.categorySelection}&TotalCost=${text?.totalCost}&AccumulatedDepreciation=${text?.accumulatedDepreciation}`,
      {
        headers: {
          Authorization: `Bearer ${credentials?.token}`,
        },
      }
    ).then((resp) => setNetBook(resp.data.data));
  };
  useEffect(() => {
    getBranches();
    getTag();
    getDepartments();
    getCategories();
    getAmortizationCode();
  }, []);
  useEffect(() => {
    getAccounts();
  }, [text?.categorySelection]);

  useEffect(() => {
    getNetBook();
  }, [text?.categorySelection, text?.totalCost, text?.accumulatedDepreciation]);

  const addAssetClass = (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      amortisationClassCode: code,
      amortisationClassName: text.assetClassName,
      netBookValue: String(netBook?.netBookValue),
      assetCategoryCode: text.categorySelection,
      debitAccount: accounts.dr,
      creditAccount: accounts.cr,
      monthlydepreciationValue: Number(netBook?.monthlyDepreciationValue),
      purchaseDate: text.purchaseDate,
      totalCost: Number(text.totalCost.replace(/,/g, "")),
      accumulatedDepreciation: Number(text.accumulatedDepreciation),
      branchLocation: text.branchLocation,
      departmentLocation: text.departmentLocation,
      lastDepreciationDate: text?.lastDepreciationDate,
      tagNumber: tag?.tagNumber,
    };
    axios
      .post("AssetsClass/create-assets-class", payload, {
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
          navigate(-1);
          setLoading(false);
        }, 5000);
      })
      .catch((error) => {
        setLoading(false);
        toast(error.response.data.message, { type: "error", autoClose: false });
      });
  };

  const navigate = useNavigate();
  return (
    <>
      <form
        onSubmit={addAssetClass}
        style={{ border: "solid .5px #fafafa", borderRadius: "15px" }}
      >
        <div
          className="p-3"
          style={{
            backgroundColor: "#F5F9FF",
            borderRadius: "15px 15px 0 0",
          }}
        >
          <div
            className=" d-flex align-items-center gap-2 title-link"
            style={{ width: "fit-content" }}
            onClick={() => navigate(-1)}
          >
            <BsArrowLeft />{" "}
            <span style={{ fontSize: "16px" }}>Add asset class </span>
          </div>
        </div>
        <div className="px-4 admin-task-forms">
          <div className="row g-2">
            <label htmlFor="assetClassCode" style={{ fontWeight: "500" }}>
              Asset Class Code<sup className="text-danger">*</sup>
            </label>
            <input
              name="assetClassCode"
              id="assetClassCode"
              readOnly
              disabled
              value={code}
            />
          </div>
          <div className="row g-2">
            <label htmlFor="categorySelection" style={{ fontWeight: "500" }}>
              Category Selection<sup className="text-danger">*</sup>
            </label>
            <select
              name="categorySelection"
              id="categorySelection"
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
            <label htmlFor="assetClassName" style={{ fontWeight: "500" }}>
              Asset Class Name<sup className="text-danger">*</sup>
            </label>
            <input
              name="assetClassName"
              id="assetClassName"
              required
              onChange={handleChange}
            />
          </div>
          <div className="row g-2">
            <label htmlFor="branchLocation" style={{ fontWeight: "500" }}>
              Branch Location<sup className="text-danger">*</sup>
            </label>
            <select name="branchLocation" required onChange={handleChange}>
              <option value="">Select</option>
              {branches.map((branch) => (
                <option value={branch.branchCode} key={branch.branchCode}>
                  {branch.branchName}
                </option>
              ))}
            </select>
          </div>
          <div className="row g-2">
            <label htmlFor="departmentLocation" style={{ fontWeight: "500" }}>
              Department Location<sup className="text-danger">*</sup>
            </label>
            <select required name="departmentLocation" onChange={handleChange}>
              <option value=""> Select</option>
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
            <label htmlFor="totalCost" style={{ fontWeight: "500" }}>
              Total Cost<sup className="text-danger">*</sup>
            </label>
            <NumericFormat
              thousandSeparator={true}
              fixedDecimalScale={true}
              decimalScale={2}
              name="totalCost"
              required
              onChange={handleChange}
            />
          </div>
          <div className="row g-2">
            <label
              htmlFor="accumulatedDepreciation"
              style={{ fontWeight: "500", fontSize: "14px" }}
            >
              Accumulated Depreciation<sup className="text-danger">*</sup>
            </label>
            <input
              name="accumulatedDepreciation"
              id="accumulatedDepreciation"
              required
              onChange={handleChange}
              type="number"
              min={0}
            />
          </div>
          <div className="row g-2">
            <label htmlFor="netBookValue" style={{ fontWeight: "500" }}>
              Net Book Value<sup className="text-danger">*</sup>
            </label>
            <input
              name="netBookValue"
              id="netBookValue"
              value={netBook?.netBookValue}
              readOnly
              required
              disabled
            />
          </div>
          <div className="row g-2">
            <label
              htmlFor="monthlyDepreciationValue"
              style={{ fontWeight: "500", fontSize: "14px" }}
            >
              Monthly Depreciation Value<sup className="text-danger">*</sup>
            </label>
            <input
              name="monthlyDepreciationValue"
              id="monthlyDepreciationValue"
              disabled
              value={netBook.monthlyDepreciationValue}
            />
          </div>
          <div className="row g-2">
            <label htmlFor="debitAccount" style={{ fontWeight: "500" }}>
              Debit Account<sup className="text-danger">*</sup>
            </label>
            <input
              name="debitAccount"
              id="debitAccount"
              value={accounts.dr}
              readOnly
              required
              disabled
            />
          </div>
          <div className="row g-2">
            <label htmlFor="creditAccount" style={{ fontWeight: "500" }}>
              Credit Account<sup className="text-danger">*</sup>
            </label>
            <input
              name="creditAccount"
              id="creditAccount"
              required
              value={accounts.cr}
              readOnly
              disabled
            />
          </div>
          <div className="row g-2">
            <label htmlFor="purchaseDate" style={{ fontWeight: "500" }}>
              Purchase Date<sup className="text-danger">*</sup>
            </label>
            <input
              name="purchaseDate"
              id="purchaseDate"
              type="date"
              required
              onChange={handleChange}
            />
          </div>
          <div className="row g-2">
            <label htmlFor="lastDepreciationDate" style={{ fontWeight: "500" }}>
              Last depreciation date<sup className="text-danger">*</sup>
            </label>
            <input
              onChange={handleChange}
              name="lastDepreciationDate"
              id="lastDepreciationDate"
              type="date"
              required
            />
          </div>
          <div className="row g-2">
            <label htmlFor="nextDepreciationDate" style={{ fontWeight: "500" }}>
              Next Depreciation Date<sup className="text-danger">*</sup>
            </label>
            <input
              name="nextDepreciationDate"
              id="nextDepreciationDate"
              type="date"
              required
            />
          </div>
          <div className="row g-2">
            <label htmlFor="tagNumber" style={{ fontWeight: "500" }}>
              Tag Number<sup className="text-danger">*</sup>
            </label>
            <input
              name="tagNumber"
              id="tagNumber"
              disabled
              value={tag.tagNumber}
            />
          </div>
        </div>
        <div
          className="d-flex justify-content-end mt-3 p-3 gap-3"
          style={{ backgroundColor: "#f2f2f2", borderRadius: "0 0 15px 15px" }}
        >
          <button
            type="reset"
            className="btn-md discard border-0 px-3 rounded-5"
          >
            Discard
          </button>
          <button
            type="submit"
            className="border-0 member btn-md"
            disabled={loading}
          >
            Add asset class
          </button>
        </div>
      </form>
      <ToastContainer />
    </>
  );
};

export default AddAssetClass;
