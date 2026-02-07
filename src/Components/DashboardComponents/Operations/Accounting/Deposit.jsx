import React,{useContext, useEffect, useState} from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup'
import axios from '../../../../Components/axios'
import ErrorText from '../../ErrorText'
import { UserContext } from '../../../AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import { Combobox } from 'react-widgets/cjs';

const Deposit = () => {
  const [options, setOptions] = useState([])
  const [modes, setModes] = useState([])
  const [debitOption, setDebitOption] = useState('')
  const [creditOption, setCreditOption] = useState('')
  const [creditAccount, setCreditAccount] = useState('')
  const [debitAccount, setDebitAccount] = useState('')
  const [batchNo, setBatchNo] = useState('')
  const [loading, setLoading]= useState(false)
  const [debitEnquiries, setDebitEnquiries] = useState([])
  const [creditEnquiries, setCreditEnquiries] = useState([])
  const [debitDetails, setDebitDetails] = useState({})
  const [creditDetails, setCreditDetails] = useState({})
  const {credentials} = useContext(UserContext)


  const getVoucherNo = () => {
    axios("MemberManagement/get-batch-no", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setBatchNo(resp.data.message));
  };


  const fetchOptions=()=>{
    axios('Acounting/general-Ledger-search-option', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setOptions(resp.data))
  }

  const fetchDebitAccountDetails=()=>{
    axios(`Acounting/account-number-text-changed?DebitAccountNumber=${debitAccount}`, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }})
    .then(resp=>setDebitDetails(resp.data.data.accountDetails))
  }

  const fetchCreditAccountDetails=()=>{
    axios(`Acounting/account-number-text-changed?DebitAccountNumber=${creditAccount}`, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }})
    .then(resp=>{
      setCreditDetails(resp.data.data.accountDetails)
    })
  }
  const fetchDebitCustomerEnquiries=()=>{
    axios(`Acounting/general-ledger-customer-enquiry?SearchOption=${debitOption}`, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setDebitEnquiries(resp.data.data))
  }
  const fetchCreditCustomerEnquiries=()=>{
    axios(`Acounting/general-ledger-customer-enquiry?SearchOption=${creditOption}`, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setCreditEnquiries(resp.data.data))
  }
  const getModes=()=>{
    axios('Acounting/deposit-payment-mode', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=> setModes(resp.data))
  }

  useEffect(()=>{
    fetchOptions()
    getModes()
    getVoucherNo()
  },[])

  useEffect(()=>{
   fetchDebitCustomerEnquiries()
  },[debitOption])

  useEffect(()=>{
   fetchDebitAccountDetails()
  }, [debitAccount])
  useEffect(()=>{
    fetchCreditAccountDetails()
   }, [creditAccount])
  useEffect(()=>{
    fetchCreditCustomerEnquiries()
   },[creditOption])

  const initialValues ={
    depositMode:'',
    paymentDescription:'',
    paymentAmount:'',
    valueDate:''
  }
  const validationSchema = Yup.object({
    depositMode: Yup.string().required(),
    paymentDescription: Yup.string(),
    paymentAmount: Yup.string(),
    valueDate: Yup.string()
  })

    const formattedEnquiries = debitEnquiries.map((e) => ({
  ...e,
  label: `${e.acctName} >> ${e.product}`,
}));

   const formattedCreditEnquiries = creditEnquiries.map((e) => ({
  ...e,
  label: `${e.acctName} >> ${e.product}`,
}));
  const onSubmit=(values, {resetForm})=>{
    setLoading(true)
    const payload ={
      modeOfPayment: values.depositMode,
      debitAccountNumber: debitAccount,
      creditAccountNumber: creditAccount,
      valueDate: values.valueDate,
      payAmount: values.paymentAmount,
      voucherNumber: batchNo,
      // paymentEvidence: '',
      paymentDescription: values.paymentDescription,
      currencyCode: '001',
      isReversa: false
    }
    axios.post('Acounting/deposit', payload,{headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      toast(resp.data.message, 
      {type:'success', autoClose:5000, pauseOnHover:true})
      setLoading(false)
      resetForm()
      setDebitOption('')
      setDebitAccount('')
      setCreditOption('')
      setCreditAccount('')
    })
      .catch(error=>{
      setLoading(false)
        toast(error.response.data.message,
         {type:'error', autoClose:false, pauseOnHover:true})})
  }
  return (
      <div className="mt-4">
         <div className="bg-white"
              style={{
                borderRadius: "15px",
                border: "solid .5px #fafafa",
              }}>
        <div
          style={{
            backgroundColor: "#f4fAfd",
            borderRadius: "15px 15px 0 0",
          }}
          className="p-3"
        >
          <h5 style={{fontSize:'16px', color:'#333'}}>Deposit</h5>
        </div>
        <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}>
          <Form>
              <div className="admin-task-forms px-3" style={{overflow:'hidden'}}>
              <div className='d-flex flex-column gap-1'>
                <label htmlFor="debitOptions">Select payment mode for debit account</label>
                <select name={debitOption} value={debitOption} onChange={(e)=>setDebitOption(e.target.value)} required>
                  <option value="">Select option</option>
                  {
                    options.map((option)=>(
                      <option value={option.value} key={option.name}>{option.name}</option>
                    ))
                  }
                  </select>
              </div>
            
                  <div className='d-flex flex-column gap-1 '>
                    <label htmlFor="debitAccount">Debit account number:</label>
                     <Combobox
                      data={formattedEnquiries}
                      value={debitAccount}
                      onChange={(val) => setDebitAccount(val.accountNumber)}
                      valueField="accountNumber"
                      textField="label"
                      filter="contains"
                       />
                  </div>
                  <div className='d-flex flex-column gap-1 '>
                <label htmlFor="creditOption">Select payment mode for credit account</label>
                <select name={creditOption} value={creditOption} onChange={(e)=>setCreditOption(e.target.value)} required>
                  <option value="">Select option</option>
                  {
                    options.map((option)=>(
                      <option value={option.value} key={option.name}>{option.name}</option>
                    ))
                  }
                  </select>
              </div>
                  <div className='d-flex flex-column gap-1'>
                    <label htmlFor="creditAccount">Credit account number:</label>
                       <Combobox
                      data={formattedCreditEnquiries}
                      value={creditAccount}
                      onChange={(val) => setCreditAccount(val.accountNumber)}
                      valueField="accountNumber"
                      textField="label"
                      filter="contains"
                       />
                  </div>
                  <div className='d-flex flex-column gap-1 '>
              <label htmlFor='depositMode'>Select deposit mode:</label>
                <Field name='depositMode' as='select'>
                  <option value="">Select</option>
                  {
                    modes.map((mode)=>(
                      <option value={mode.value} key={mode.value}>{mode.name}</option>
                    ))
                  }
                </Field>
              </div>
                  <div className='d-flex flex-column gap-1 '>
                    <label htmlFor="debitAccount">Enter payment amount:</label>
                    <Field name='paymentAmount' />
                    <ErrorMessage name='paymentAmount' component={<ErrorText/>}/>
                  </div>
                  <div className='d-flex flex-column gap-1'>
                    <label htmlFor="payVoucher">Enter pay voucher/instrument number:</label>
                    <input name='payVoucher'value={batchNo} readOnly />
                  </div>
                  <div className='d-flex flex-column gap-1'>
                    <label htmlFor="creditAccount">Value date:</label>
                    <Field name='valueDate' type='date'/>
                  </div>
                  <div className='d-flex flex-column gap-1'>
                    <label htmlFor="paymentDescription">Payment description:</label>
                    <Field name='paymentDescription' as='textarea' className='rounded-3' required/>
                    <ErrorMessage name='paymentDescription' component={<ErrorText/>}/>
                  </div>
              </div>
              <hr className='mx-4'/>
              <div className='admin-task-forms mt-4 mx-4'>
                <div className="" style={{boxShadow:'3px 3px 3px 3px #ddd',  borderRadius:'1rem 1rem 0 0'}}>
                  <div style={{backgroundColor:'#EDF4FF', padding:'10px 15px 2px',  borderRadius:'1rem 1rem 0 0'}}>
                  <p style={{fontSize:'14px'}}>Debit Account Info</p>
                  </div>
                 <div className="px-4 d-flex flex-column gap-2 py-2" style={{fontSize:'14px'}}>
                  <div className='d-flex gap-3 discourse' >
                    <span>Account Name:</span>
                    <p>{debitDetails?.accountTitle}</p>
                  </div>
                  <div className='d-flex gap-3 discourse' >
                    <span>Product Name:</span>
                    <p>{debitDetails?.prodName}</p>
                  </div>
                  <div className='d-flex gap-3 discourse' >
                    <span>Branch:</span>
                    <p>{debitDetails?.branch}</p>
                  </div>
                  <div className='d-flex gap-3 discourse' >
                    <span>Book Balance:</span>
                    <p>{debitDetails?.bkbal}</p>
                  </div>
                  <div className='d-flex gap-3 discourse' >
                    <span>Effective Balance:</span>
                    <p>{debitDetails?.effbal}</p>
                  </div>
                  <div className='d-flex gap-3 discourse' >
                    <span>Usable Balance:</span>
                    <p>{debitDetails?.usebal}</p>
                  </div>
                  <div className='d-flex gap-3 discourse' >
                    <span>Source Type:</span>
                    <p>{debitDetails?.acctty}</p>
                  </div>
                  <div className='d-flex gap-3 discourse' >
                    <span>Source:</span>
                    <p>{debitDetails?.source}</p>
                  </div>
                  <div className='d-flex gap-3 discourse' >
                    <span>Account Status:</span>
                    <p>{debitDetails?.acctStatus}</p>
                  </div>
                  <div className='d-flex gap-3 discourse' >
                    <span>Total Charge:</span>
                    <p>{debitDetails?.totalCharge}</p>
                  </div>
                </div>
                </div>
                <div className="d-flex flex-column gap-2 p-0" style={{boxShadow:'3px 3px 3px 3px #ddd', borderRadius:'10px 10px 0 0'}}>
                  <div style={{backgroundColor:'#FEF3E6', paddingTop:'10px', paddingInline:'15px',  borderRadius:'10px 10px 0 0'}}>
                <p style={{fontSize:'14px'}}>Credit Account Info</p>
                </div>
                <div className="px-4 d-flex flex-column gap-2 py-2">
                    <div className='d-flex gap-3 discourse discourse' >
                    <span>Account Name:</span>
                    <p>{creditDetails?.accountTitle}</p>
                  </div>
                  <div className='d-flex gap-3 discourse' >
                    <span>Product Name:</span>
                    <p>{creditDetails?.prodName}</p>
                  </div>
                  <div className='d-flex gap-3 discourse' >
                    <span>Branch:</span>
                    <p>{creditDetails?.branch}</p>
                  </div>
                  <div className='d-flex gap-3 discourse' >
                    <span>Book Balance:</span>
                    <p>{creditDetails?.bkbal}</p>
                  </div>
                  <div className='d-flex gap-3 discourse' >
                    <span>Effective Balance:</span>
                    <p>{creditDetails?.effbal}</p>
                  </div>
                  <div className='d-flex gap-3 discourse' >
                    <span>Usable Balance:</span>
                    <p>{creditDetails?.usebal}</p>
                  </div>
                  <div className='d-flex gap-3 discourse' >
                    <span>Source Type:</span>
                    <p>{creditDetails?.acctty}</p>
                  </div>
                  <div className='d-flex gap-3 discourse' >
                    <span>Source:</span>
                    <p>{creditDetails?.source}</p>
                  </div>
                  <div className='d-flex gap-3 discourse' >
                    <span>Account Status:</span>
                    <p>{creditDetails?.acctStatus}</p>
                  </div>
                  <div className='d-flex gap-3 discourse' >
                    <span>Total Charge:</span>
                    <p>{creditDetails?.totalCharge}</p>
                  </div>
                </div>
              </div>
              </div>
            <div
              style={{ backgroundColor: "#f2f2f2", borderRadius:'0 0 15px 15px' }}
              className="d-flex justify-content-end gap-3 p-3 my-3"
            >
              <button type="reset" className="btn btn-sm rounded-5" style={{backgroundColor:'#f7f7f7'}}>Discard</button>
              <button type="submit" className="border-0 btn-md member"
              disabled={loading}
              >{loading ? 'Posting...' : 'Post'}</button>
            </div>
          </Form>
        </Formik>
        <ToastContainer/>
      </div>
      </div>
  );
};

export default Deposit
