import React, { useEffect, useState, useContext } from "react";
import CooperativeInfo from "./CooperativeInfo";
import AccountInfo from "./AccountInfo";
import { UserContext } from "../../AuthContext";
import axios from "../../axios";
import ScrollContainer from "react-indiana-drag-scroll";
import Modal from 'react-modal'
import {toast, ToastContainer} from 'react-toastify'


const CooperativeSettings = () => {
    const [isOpen, setIsOpen]= useState(false)
    const [modalOpen, setModalOpen]= useState(false)
     const [logo, setLogo] = useState("");
      const [byLaw, setByLaw] = useState("");
    const [activated, setActivated] = useState("cooperative-information");
    const [details, setDetails] =useState({
      acctOpenSms:0,
      address:"",
      bankCode:"",
      bankFax:"",
      bankName:"",
      cashAccount:"",
      cooperativeCategory:0,
      cooperativeType:0,
      currencyCode:0,
      documentPathID:"",
      email:"",
      expenseAccount:"",
      incomeAccount:"",
      lastFinancialYear:"",
      logoPathId:"",
      multiacct:0,
      nextFinancialYear:"",
      pAndLAccount:"",
      payableAccount:"",
      phone:"",
      priorpandlacct:"",
      regFee:0,
      regFeeAccount:"",
      regFeeMode:0,
      serverName:"",
      slogan:"",
      smsreq:0,
      state:""
    });
  // Get Auth token
    const {credentials}= useContext(UserContext)

    const getProfile = async () => {
      await axios("SetUp/general-setup", {
       headers: {
         Authorization: `Bearer ${credentials?.token}`,
       },
     }).then((resp) => setDetails(resp?.data.data));
   };

   useEffect(() => {
    getProfile();
  }, []);

  //Function to open modal
  function openModal(){
    setIsOpen(true)
  }
  //Function to close modal
  function closeModal(){
    setIsOpen(false)
  }

  
  //Function to open modal for byeLaw uploading
  function handleOpenModal(){
    setModalOpen(true)
  }
  //Function to close modal for byeLaw uploading
  function handleCloseModal(){
    setModalOpen(false)
  }
// Logo Uploading

  const submitLogo = (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("LogoFile", logo);

    const toastOptions = {
      autoClose: 5000,
      pauseOnHover: true,
      type: "success",
    };
    if (logo) {
    axios
      .post("SetUp/update-cooperative-logo", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then(() => {
        toast("Logo uploaded successfully", toastOptions);
        getProfile()
        setTimeout(() => {
          closeModal()
        }, 5000);
        
      });
  }
  else{
    window.alert('Please select a file to upload')
  }
}

  const submitByLaw = (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("LogoFile", byLaw);

    const toastOptions = {
      autoClose: 5000,
      pauseOnHover: true,
      type: "success",
    };
    if (byLaw) {
      axios
        .post("SetUp/update-cooperative-bylaw-document", payload, {
          headers: {
            Authorization: `Bearer ${credentials.token}`,
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
            type: "formData",
          },
        })
        .then(() => {
          toast("ByLaw document uploaded successfully", toastOptions);
          setTimeout(() => {
            handleCloseModal()
          }, 5000);
        }).catch((error)=>{
          toast(error.message, {autoClose:5000, pauseOnHover:true, type:'error'})
        });
    } else {
      window.alert("No file chosen");
    }
  };
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setDetails({
      ...details,
      [name]: value,
    });
  };

const getSettings=()=>{
    if (activated === 'cooperative-information') {
        return <CooperativeInfo details={details} handleChange={handleChange}
        openModal={openModal} handleOpenModal={handleOpenModal} getProfile={getProfile}/>
    }
    else if (activated === 'account-information') {
        return <AccountInfo details={details} handleChange={handleChange} 
        handleOpenModal={handleOpenModal} openModal={openModal} getProfile={getProfile}/>
    }
}
 const permissions = credentials?.logInfo?.userRolesPermission;
  return (
    <>
  
    <div className="card px-3 py-3 border-0 rounded-4" style={{ marginTop: "1.7rem" }}>
        <ScrollContainer vertical={false} className="header-links mb-2 scroller" 
               style={{overflow:'scroll'}}>
        <span
          onClick={() => setActivated("cooperative-information")}
          className={
            activated === "cooperative-information" ? "active-selector" : null
          }
        >
          Cooperative information
        </span>
        <span
          onClick={() => setActivated("account-information")}
          className={
            activated === "account-information" ? "active-selector" : null
          }
        >
          Account information
        </span>
    </ScrollContainer>
        
        {/* Modal to upload logo */}
        <Modal 
        isOpen={isOpen}
        onRequestClose={closeModal}
        className='setting-modal'>
          <div className="p-3">
        <form onSubmit={submitLogo}>
                  <input
                    type="file"
                    name="LogoFile"
                    onChange={(e) => {
                      setLogo(e.target.files[0]);
                      console.log(logo);
                    }}
                  />
                  <div className="d-flex justify-content-center mt-2">
                    <button className="border-0 w-100 btn-md member" type="submit">
                      Upload
                    </button>
                  </div>
                </form>
                </div>
              </Modal>

          <Modal 
          isOpen={modalOpen}
          onRequestClose={handleCloseModal}
          className='setting-modal'>
            <div className="p-3">
          <form onSubmit={submitByLaw}>
                  <input
                    type="file"
                    name="ByLawFile"
                    onChange={(e) => {
                      setByLaw(e.target.files[0]);
                      console.log(logo);
                    }}
                  />
                  <div className="d-flex justify-content-center mt-2">
                    <button className="border-0 w-100 btn-md member">Upload</button>
                  </div>
                </form>
                </div>
          </Modal>
    {getSettings()}

    </div>
  
    {/* <div className="card p-3">
      <h2 className="text-center mx-auto" style={{width:'50%', fontSize:'14px'}}>
        You are not permitted to view the index page, navigate to available menu</h2>
    </div>  */}
    </>
  );
};

export default CooperativeSettings;
