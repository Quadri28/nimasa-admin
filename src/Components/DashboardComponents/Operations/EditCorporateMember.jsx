import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { BsArrowLeft } from "react-icons/bs";
import DatePicker from "react-datepicker";

const EditCorporateMember = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  const { credentials } = useContext(UserContext);
  const [memberTypes, setMemberTypes] = useState([]);
  const [residentStates, setResidentStates] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [towns, setTowns] = useState([]);
  const [file, setFile] = useState("");
  const [products, setProducts] = useState([]);

  const fetchDetail = async () => {
    await axios(`MemberManagement/get-member-by-unique-id?uniqueId=${id}`, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setDetail(resp.data.data));
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const changeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setDetail({ ...detail, [name]: value });
  };

  const getGuidNo = async () => {
    await axios("Common/get-member-signatory-number", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setGuidNo(resp.data.batchNo));
  };

  const getIdTypes = () => {
    axios("MemberManagement/get-identity-card-types", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setIdTypes(resp.data.data));
  };
  const getSectors = () => {
    axios("MemberManagement/get-sector", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setSectors(resp.data.data));
  };
  const getResidentStates = () => {
    axios("MemberManagement/get-states", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setResidentStates(resp.data.data));
  };
  const getTowns = () => {
    axios(`Common/get-town-by-state-code?StateCode=${detail?.residentState}`, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setTowns(resp.data));
  };


  const getMemberTypes = () => {
    axios("MemberManagement/member-type", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => {
      setMemberTypes(resp.data);
    });
  };
  const getProducts = () => {
    axios("MemberManagement/get-products", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setProducts(resp.data.data));
  };
  useEffect(() => {
    getMemberTypes();
    getSectors();
    getResidentStates();
    getProducts();
    getIdTypes();
    getGuidNo();
  }, []);
  useEffect(() => {
    getTowns();
  }, [detail?.residentState]);

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = new FormData()
    payload.append('CorporateName', detail.lastName)
    payload.append('RegisterNumber', detail.registrationNumber)
    payload.append('DateOfRegistration', detail.dateJoined)
    payload.append('State', detail.residentState)
    payload.append('Town', detail.town)
    payload.append('ContactAddress', detail.residentAddress)
   payload.append('Sector', detail.sector)
    payload.append('BusinessObjective', detail.businessObjective)
    payload.append('SourceOfFunding', detail.fundSource)
   payload.append('MemberStrength', Number(detail.memberStrength))
    payload.append('BVN', detail.bvn)
    payload.append('PhoneNumber', detail.mobilePhone1)
    payload.append('Email', detail.emailAddress)
    payload.append('MonthlyContribution', Number(detail.monthlyContribution))
    payload.append('AccountNumber', detail.accountNumber)
    payload.append('PaymentBank', detail.bank)
    payload.append('Picture', file)
    payload.append('Amount', Number(detail.amount))
    payload.append('TellerNumber', detail.tellerNumber)
    payload.append('UniqueId', detail.memberId)
    axios
      .post("MemberManagement/update-cooperate-member-registration", payload, {
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
      })
      .catch((error) =>
        toast(error.response.data.message, { type: "error", autoClose: false })
      );
  };
const navigate = useNavigate()
  return (
    <div style={{ border: "solid 1px #fafafa", borderRadius:'15px 15px 0 0', }}>
   <div className="d-flex gap-2 p-3 fs-6 align-items-center" 
          style={{backgroundColor:'#f4fAfd', borderRadius:'15px 15px 0 0', cursor:'pointer'}}>
          <span><BsArrowLeft onClick={()=>navigate(-1)}/> </span>
           <span>Edit Corporate Member Details:</span>
           </div>
        <form  onSubmit={onSubmit}>
            <div className="admin-task-forms px-4">
              <h6 style={{ fontSize: "18px" }}>Corporate Details</h6>
              <div></div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="memberType">
                  Member Type
                </label>
                <select name="memberType" as="select" disabled value={detail?.memberType}>
                  <option value="">Select</option>
                  {memberTypes?.map((type) => (
                    <option
                      value={type.value}
                      key={type.value}
                    >
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="middleName">
                  Corporate Name
                </label>
                <input name="lastName" onChange={changeHandler} value={detail?.lastName} />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="registrationNumber">
                  Registration No
                </label>
                <input name="registrationNumber" onChange={changeHandler} value={detail?.registrationNumber}/>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="regDate">
                  Date of Registration
                </label>
                <DatePicker
                           selected={
                             detail?.dateJoined &&
                             !isNaN(Date.parse(detail.dateJoined))
                               ? new Date(detail.dateJoined)
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
              <div className="d-flex flex-column gap-1">
                <label htmlFor="residentState">
                  State
                </label>
                <select
                  name="residentState"
                  value={detail?.residentState}
                  onChange={changeHandler}
                >
                  <option value="">Select</option>
                  {residentStates?.map((state) => (
                    <option value={state.stateCode} key={state.stateCode}>
                      {state.stateName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="residentTown">
                  Town
                </label>
                <select name="town" value={detail?.town} onChange={changeHandler}>
                  <option value="">Select</option>
                  {towns?.map((town) => (
                    <option value={town.townCode} key={town.townCode}>
                      {town.townName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="address">
                  Contact address
                </label>
                <textarea onChange={changeHandler} name="residentAddress" value={detail?.residentAddress} />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="businessObjective">Business objective</label>
                <textarea name="businessObjective" onChange={changeHandler} value={detail?.businessObjective}/>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="sector">
                  Sector
                </label>
                <select name="sector" onChange={changeHandler} value={detail?.sector}>
                  <option value="">Select</option>
                  {sectors?.map((sector) => (
                    <option value={sector.sectorcode} key={sector.sectorcode}>
                      {sector.sectorname}
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="sourcefunding">Source of funding</label>
                <input name="sourcefunding" onChange={changeHandler} value={detail?.sourcefunding}/>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="memberStrength">Member strength</label>
                <input name="memberStrength" type='number' min={0} onChange={changeHandler} value={detail?.memberStrength}/>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="mobilePhone1">Phone number</label>
                <input name="mobilePhone1"  onChange={changeHandler} value={detail?.mobilePhone1}/>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="bvn">B.V.N</label>
                <input name="bvn" onChange={changeHandler} value={detail?.bvn}/>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="email">
                  Email{" "}
                </label>
                <input name="emailAddress" onChange={changeHandler} value={detail?.emailAddress}/>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="picture">
                  Picture
                </label>
                <input name="file" type="file" onChange={(e)=>setFile(e.target.files[0])}/>
              </div>
             </div>
             

            <div className="admin-task-forms px-4">
              <h6 style={{ fontSize: "18px" }}>Account Creation Section</h6>
              <div></div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="acctBranch">
                  Account Branch
                </label>
                <select name="accountBranch" onChange={changeHandler} value={detail.accountBranch}>
                  <option value="">Select</option>
                  <option value="001">Head Office</option>
                </select>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="accountProduct">
                  Account Product
                </label>
                <select name="accountProduct" onChange={changeHandler} value={detail.accountProduct}>
                  <option value="">Select</option>
                  {products?.map((product) => (
                    <option
                      value={product.productCode}
                      key={product.productCode}
                    >
                      {product.productName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="acctDesc">
                  Account Description
                </label>
                <input name="accountDescription" onChange={changeHandler} value={detail?.accountDescription}/>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="contributionAmount">
                  Contribution Amount
                </label>
                <input
                  name="monthlyContribution"
                  onChange={changeHandler} value={detail?.monthlyContribution}
                  //   thousandSeparator={true} fixedDecimalScale={true} decimalScale={2}
                />
              </div>
            </div>

            <div className="admin-task-forms px-4">
              <h6 style={{ fontSize: "18px" }}>Reg. Fee Details</h6>
              <div></div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="accountNumber">Account Number</label>
                <input name="accountNumber" onChange={changeHandler} value={detail?.accountNumber} />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="paymentBank">Payment Bank</label>
                <input name="paymentBank" onChange={changeHandler} value={detail?.paymentBank}/>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="amount">Amount</label>
                <input
                  name="amount"
                  onChange={changeHandler} value={detail?.amount}
                  //    thousandSeparator={true} fixedDecimalScale decimalScale={2}
                />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="tellerNumber">Teller No</label>
                <input name="tellerNumber" onChange={changeHandler} value={detail?.tellerNumber}/>
              </div>
            </div>
          <div
            className="d-flex justify-content-end gap-3 p-3 mt-3"
            style={{
              backgroundColor: "#f2f2f2",
              borderRadius: "0 0 15px 15px",
            }}
          >
            <button type="reset" className="btn-md px-3 rounded-5 border-0">
              Discard
            </button>
            <button type="submit" className="border-0 member btn-md">
              Submit
            </button>
          </div>
        </form>
        <ToastContainer/>
    </div>
  );
};

export default EditCorporateMember;
