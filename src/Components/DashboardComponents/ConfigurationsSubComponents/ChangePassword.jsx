import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../AuthContext'
import axios from '../../axios'
import { toast, ToastContainer } from 'react-toastify'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import ErrorText from '../ErrorText'


const ChangePassword = () => {
  const [error, setError] = useState('')
  const [roles, setRoles] = useState([])
  const [departments, setDepartments] = useState([])
  const [branches, setBranches] = useState([])
const [data, setData]= useState({
  username: '',
  roleId: '',
  fullname: '',
  departmentCode: '',
  securityCode: '',
})

const {credentials} = useContext(UserContext)


const getRoles=async ()=>{
  await axios('Common/get-roles', {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then((resp)=>setRoles(resp.data))
}
const getBranches=async ()=>{
  await axios('Common/get-branches', {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then((resp)=>setBranches(resp.data))
}
const getDepartments=async ()=>{
  await axios('Common/get-departments', {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then((resp)=>setDepartments(resp.data))
}

useEffect(()=>{
  getRoles()
  getBranches()
  getDepartments()
}, [])
const initialValues ={
  oldPassword:'',
  newPassword:'',
  confirmNewPassword:'',
}
// .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
 //  'Must be at least 8 characters, a special character, a capital letter and small letter').

const validationSchema =Yup.object({
  oldPassword: Yup.string().required('Required'),
  newPassword: Yup.string().required('Required'),
  confirmNewPassword:  Yup.string()
  .oneOf([Yup.ref('newPassword'), null], 'Confirm password must match with the new password'),
})

const getPasswordData=()=>{
  axios('/Account/get-change-password', {headers:{
    Authorization: `Bearer ${credentials?.token}`
  }})
  .then((resp)=>setData(resp.data))
}

useEffect(()=>{
  getPasswordData()
}, [])

const submitHandler=(values)=>{
  const payload={
  username: data.username,
  roleId: data.roleId,
  fullname: data.fullname,
  departmentCode: data.departmentCode,
  securityCode: data.securityCode,
  oldPassword: values.oldPassword,
  newPassword: values.newPassword,
  confirmNewPassword: values.confirmNewPassword
  }
  const toastOptions={
    autoClose: 5000,
    pauseOnHover:true,
    type: 'success'
  }
  axios.post('Account/change-password', payload, {headers:{
    Authorization: `Bearer ${credentials?.token}`
  }})
  .then(()=>toast('Account password updated successfully', toastOptions))
  .catch((error)=>{
    toast(error.message, {autoClose:5000, pauseOnHover:true, type:'error'})
    console.log(error)
  })
}
  

  return (
    <div className="bg-white px-2 py-4 border-0 rounded-4">
      <div className='active-selector mb-4' style={{width:'fit-content'}}>
        Change password
      </div>
    <div className="rounded-4" style={{border:'solid 1px #f7f4f7'}}>
    <div
      className="py-3 px-3 form-header"
      style={{ backgroundColor: '#f4fAfd', borderRadius:'15px 15px 0 0' }}
    >
      <div style={{fontSize:'16px', fontWeight:'500', color:'#4D4D4D'}}>
        Change password
      </div>
    </div>
    { error? <p className='text-danger text-center mt-2'>{error}</p> : null}
    <div style={{paddingInline:'15px'}}>
    <Formik 
    onSubmit={submitHandler}
     initialValues={initialValues}
     validationSchema={validationSchema}>
      <Form >
        <div className="admin-task-forms">
          <div className="d-flex flex-column gap-1">
            <label htmlFor="fullname" style={{ fontWeight: "500" }}>
              Full Name:
            </label>
            <Field name="fullname" id="fullname" value={data?.fullname} readOnly/>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="oldPassword" style={{ fontWeight: "500" }}>
              Old Password:
            </label>
            <Field name="oldPassword" id="oldPassword" type='password'
             autoComplete={false}/>
             <ErrorMessage name='oldPassword' component={ErrorText}/>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="newPassword" style={{ fontWeight: "500" }}>
              New Password:
            </label>
            <Field name="newPassword" id="newPassword" type="password" 
             autoComplete={false}/>
             <ErrorMessage name='newPassword' component={ErrorText}/>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="confirmNewPassword" style={{ fontWeight: "500" }}>
              Confirm Password:
            </label>
            <Field name="confirmNewPassword" id="confirmNewPassword" type='password'
             />
             <ErrorMessage name='confirmNewPassword' component={ErrorText}/>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="departmentCode" style={{ fontWeight: "500" }}>
              Department Code:
            </label>
            <Field as='select' name="departmentCode" id="departmentCode" 
            value={data?.departmentCode} readOnly>
              {
                departments.map((department)=>(
                  <option value={department.departmentId} key={department.departmentId}>
                    {department.departmentName}</option>
                ))
              }
              </Field>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="roleId" style={{ fontWeight: "500" }}>
              Role:
            </label>
            <Field as='select' name="roleId" id="roleId"  value={data?.roleId} readOnly>
            {
              roles.map((role)=>(
                <option value={role.roleId} key={role.roleId}>{role.roleName}</option>
              ))
            }
            </Field>
          </div>
        </div>
        <div
          className="d-flex justify-content-end gap-3 mt-3 p-3"
          style={{ backgroundColor: "#FAFAFA", fontSize:'14px', borderRadius:'0 0 15px 15px' }}
        >
          <button className="btn-md border-0 px-3 py-2 rounded-5" type="reset">
            Discard changes
          </button>
          <button
            className='btn btn-sm member'
            type="submit"
          >
            Save changes
          </button>
        </div>
      </Form>
      </Formik>
      </div>
      <ToastContainer/>
  </div>
  </div>
  )
}

export default ChangePassword
