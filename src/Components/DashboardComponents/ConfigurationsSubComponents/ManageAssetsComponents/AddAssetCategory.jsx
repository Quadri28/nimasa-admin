import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import ErrorText from "../../ErrorText";
import * as Yup from "yup";
import axios from "../../../axios";
import { UserContext } from "../../../AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const AddAssetCategory = () => {
  const { credentials } = useContext(UserContext);
  const [accounts, setAccounts] = useState([]);
  const [code, setCode] = useState({});

  const fetchCategoryCode = () => {
    axios("AssetCategory/GetAssetsCategoryCode", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => {
      setCode(resp.data.data);
    });
  };
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
    fetchCategoryCode();
    fetchAccounts();
  }, []);

  const initialValues = {
    categoryCode: code.assetsCategoryCode,
    debitAccount: "",
    categoryName: "",
    creditAccount: "",
    depreciationRate: "",
    suspenseAccount: "",
    residualValue: "",
    disposalAccount: "",
    lifeSpan: "",
    assetAccount: "",
  };
  const validationSchema = Yup.object({
    categoryCode: Yup.string(),
    debitAccount: Yup.string().required("Required"),
    categoryName: Yup.string().required("Required"),
    creditAccount: Yup.string().required("Required"),
    depreciationRate: Yup.string().required("Required"),
    suspenseAccount: Yup.string().required("Required"),
    residualValue: Yup.string().required("Required"),
    disposalAccount: Yup.string().required("Required"),
    lifeSpan: Yup.string().required("Required"),
    assetAccount: Yup.string().required("Required"),
  });
  const onSubmit = (values) => {
    const toastOptions = {
      pauseOnHover: true,
      autoClose: 5000,
      type: "success",
    };
    const payload = {
      categoryCode: code.assetsCategoryCode,
      debitAccount: values.debitAccount,
      categoryName: values.categoryName,
      creditAccount: values.creditAccount,
      depreciationRate: values.depreciationRate,
      suspenseAcct: values.suspenseAccount,
      residualValue: values.residualValue,
      disposalAcct: values.disposalAccount,
      lifeSpan: values.lifeSpan,
      assetAccount: values.assetAccount,
    };
    axios
      .post("AssetCategory/create-fixed-assets-category", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then(() => {
        toast("Asset category created successfully", toastOptions);
        setTimeout(() => {
            navigate(-1)
        }, 5000);
      })
      .catch((error) => {
        const errorOptions = {
          type: "error",
          autoClose: 5000,
          pauseOnHover: true,
        };
        toast(error.response.data.errorMessage, errorOptions);
      });
  };
  const navigate = useNavigate();
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form style={{ border: "solid .5px #fafafa", borderRadius: "15px" }}>
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
              <BsArrowLeft />
              <span style={{ fontSize: "16px" }}>Add asset category </span>
            </div>
          </div>
          <div className="admin-task-forms px-3">
          <div className="row g-2">
              <label htmlFor="code" style={{ fontWeight: "500"}}>
                Category Code<sup className="text-danger">*</sup>:
              </label>
              <Field name="categoryCode" id="categoryCode" value={code.assetsCategoryCode}/>
            </div>
            <div className="row g-2">
              <label htmlFor="debitAccount" style={{ fontWeight: "500"}}>
                Debit Account <sup className="text-danger">*</sup>:
              </label>
              <Field name="debitAccount" id="debitAccount"  min={0} as='select'>
                <option value="">Select</option>
              {
                  accounts.map((account)=>(
                    <option value={account.accountNumber} key={account.accountNumber}>{account.accountName}</option>
                  ))
                }
                </Field>
              <ErrorMessage component={ErrorText} name="debitAccount" />
            </div>
            <div className="row g-2">
              <label htmlFor="categoryName" style={{ fontWeight: "500"}}>
                Category Name <sup className="text-danger">*</sup>
              </label>
              <Field name="categoryName" id="categoryName" />
              <ErrorMessage component={ErrorText} name="categoryName" />
            </div>
            <div className="row g-2">
              <label htmlFor="creditAccount" style={{ fontWeight: "500"}}>
                Credit Account <sup className="text-danger">*</sup>:
              </label>
              <Field name="creditAccount" id="creditAccount" min={0} as='select'>
              <option value="">Select</option>
              {
                  accounts.map((account)=>(
                    <option value={account.accountNumber} key={account.accountNumber}>{account.accountName}</option>
                  ))
                }
                </Field>
              <ErrorMessage component={ErrorText} name="creditAccount" />
            </div>
            <div className="row g-2">
              <label htmlFor="depreciationRate" style={{ fontWeight: "500"}}>
                Depreciation Rate <sup className="text-danger">*</sup>:
              </label>
              <Field name="depreciationRate" id="depreciationRate" type='number' min={0}/>
              <ErrorMessage component={ErrorText} name="depreciationRate" />
            </div>
            <div className="row g-2">
              <label htmlFor="suspenseAccount" style={{ fontWeight: "500"}}>
                Suspense Account <sup className="text-danger">*</sup>:
              </label>
              <Field name="suspenseAccount" id="suspenseAccount" min={0} as='select'>
              <option value="">Select</option>
              {
                  accounts.map((account)=>(
                    <option value={account.accountNumber} key={account.accountNumber}>{account.accountName}</option>
                  ))
                }
                </Field>
              <ErrorMessage component={ErrorText} name="suspenseAccount" />
            </div>
            <div className="row g-2">
              <label htmlFor="residualValue" style={{ fontWeight: "500"}}>
                Residual Value <sup className="text-danger">*</sup>:
              </label>
              <Field name="residualValue" id="residualValue"  type='number' min={0}/>
              <ErrorMessage component={ErrorText} name="residualValue" />
            </div>
            <div className="row g-2">
              <label htmlFor="disposalAccount" style={{ fontWeight: "500"}}>
                Disposal Account <sup className="text-danger">*</sup>:
              </label>
              <Field name="disposalAccount" id="disposalAccount" as='select'>
              <option value="">Select</option>
              {
                  accounts.map((account)=>(
                    <option value={account.accountNumber} key={account.accountNumber}>{account.accountName}</option>
                  ))
                }
                </Field>
              <ErrorMessage component={ErrorText} name="disposalAccount" />
            </div>
            <div className="row g-2">
              <label htmlFor="lifeSpan" style={{ fontWeight: "500"}}>
                Life Span (Months)<sup className="text-danger">*</sup>:
              </label>
              <Field name="lifeSpan" id="lifeSpan" min={0} type='number'/>
              <ErrorMessage component={ErrorText} name="lifeSpan" />
            </div>
            <div className="row g-2">
              <label htmlFor="assetAccount" style={{ fontWeight: "500"}}>
                Asset Account <sup className="text-danger">*</sup>:
              </label>
              <Field name="assetAccount" id="assetAccount" as='select'>
              <option value="">Select</option>
                {
                  accounts.map((account)=>(
                    <option value={account.accountNumber} key={account.accountNumber}>{account.accountName}</option>
                  ))
                }
                </Field>
              <ErrorMessage component={ErrorText} name="assetAccount" />
            </div>
          </div>
          <div className="d-flex justify-content-end my-3 px-3 gap-3">
            <button type="reset" className="btn-md discard border-0 px-3 rounded-5">
              Discard
            </button>
            <button
              type="submit"
              className="border-0 member btn-md"
            >
              Add category
            </button>
          </div>
        <ToastContainer/>
        </Form>
      </Formik>
    </>
  );
};

export default AddAssetCategory;
