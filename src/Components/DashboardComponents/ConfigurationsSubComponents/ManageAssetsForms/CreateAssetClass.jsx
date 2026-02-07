import React,{useState, useEffect, useContext} from 'react'
import { Formik, Form } from 'formik'
import AssetsClassForm from './AssetsClassForm'
import * as Yup from 'yup'
import axios from '../../../axios'
import { UserContext } from '../../../AuthContext'
import { ToastContainer, toast } from 'react-toastify'

const CreateAssetClass = ({getClasses}) => {

  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState({});
  const [code, setCode] = useState("");
  const [tag, setTag] = useState({});
  const [netBook, setNetBook] = useState({});

const {credentials} = useContext(UserContext)
    const getForm=(props)=>{
        return <AssetsClassForm props={props} 
        categories={categories}
        setCategories={setCategories}
        branches={branches}
        setBranches={setBranches}
        departments={departments}
        setDepartments={setDepartments}
        accounts={accounts}
        setAccounts={setAccounts}
        netBook={netBook}
        setNetBook={setNetBook}
        code={code}
        setCode={setCode}
        tag={tag}
        setTag={setTag}/>
    }
    const initialValues={
        netBookValue:'',
        categorySelection:'',
        monthlyDepreciationValue:'',
        assetClassName:'',
        debitAccount:'',
        purchaseDate:'',
        creditAccount:'',
        branchLocation:'',
        lastDepreciationDate:'',
        departmentLocation:'',
        nextDepreciationDate:'',
        totalCost:'',
        tagNumber:'',
        accumulatedDepreciation:''
    }
    const validationSchema= Yup.object({
        netBookValue: Yup.string(),
        categorySelection: Yup.string().required('Required'),
        monthlyDepreciationValue: Yup.string(),
        assetClassName: Yup.string().required('Required'),
        debitAccount: Yup.string(),
        purchaseDate: Yup.string().required('Required'),
        creditAccount: Yup.string(),
        branchLocation: Yup.string().required('Required'),
        lastDepreciationDate: Yup.string().required('Required'),
        departmentLocation: Yup.string().required('Required'),
        nextDepreciationDate: Yup.string().required('Required'),
        totalCost: Yup.string().required('Required'),
        tagNumber: Yup.string(),
        accumulatedDepreciation: Yup.string().required('Required')
    })
    const onSubmit=(values)=>{
      const toastOptions={
        pauseOnHover: true,
        autoClose:5000,
        type:'success',
      }
      const errorToastOptions={
        autoClose:false,
        type: 'error'
      }
        const payload ={
        amortisationClassCode: code,
        netBookValue: String(netBook.netBookValue),
        categorySelection: values.categorySelection,
        monthlyDepreciationValue: netBook.monthlyDepreciationValue,
        amortisationClassName: values.assetClassName,
        debitAccount: accounts.dr,
        purchaseDate: values.purchaseDate,
        creditAccount: accounts.cr,
        branchLocation: values.branchLocation,
        lastDepreciationDate: values.lastDepreciationDate,
        departmentLocation: values.departmentLocation,
        nextDepreciationDate: values.nextDepreciationDate,
        totalCost: Number(values.totalCost),
        tagNumber: tag.tagNumber,
        accumulatedDepreciation: Number(values.accumulatedDepreciation),
        }
        axios.post('AssetsClass/create-assets-class', payload, {
          headers:{
            Authorization: `Bearer ${credentials?.token}`
          }
        }).then(()=>
        { getClasses()
          toast('Assets class created successfully', toastOptions)
      }).catch((error)=>{
      toast(error.response.data.errorMessage, errorToastOptions)
    })
    }
 
  return (
    <>
    <Formik 
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={onSubmit}
    >
{ (props)=>
    <Form>
        {getForm(props)}
</Form>
}
    </Formik>
    <ToastContainer/>
    </>
  )
}

export default CreateAssetClass
