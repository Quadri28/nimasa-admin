import React, { useState } from "react";
import "./Member.css";
import MemberSignUp from "../Components/MemberSignUp";
import MemberSignIn from "../Components/MemberSignIn";
import { useFormik } from "formik";

const Member = () => {
  const [active, setActive] = useState("sign-up");

  const initialValues = {
    username: "",
    cooperativeType: "",
    password: "",
  };

  const validate = (values) => {
    let errors = {};
    if (!values.username) {
      errors.username = "Required*";
    }
    if (!values.cooperativeType) {
      errors.cooperativeType = "Required*";
    }
    if (!values.password) {
      errors.password = "Required*";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i.test(
        values.password
      )
    ) {
      errors.password =
        "Password must contain minimum of eight characters, at least one uppercase letter, one lowercase letter, one number and one special character";
    }
    return errors;
  };
  const onSubmit = () => {};

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit,
  });

  const initialState={
    cooperative:'',
    cooperativeNumber:'',
    contributionAmount:'',
  }
  const validator =(values)=>{
    let errors={};
    if (!values.cooperative) {
        errors.cooperative = 'Required*'
    }
    if (!values.cooperativeNumber) {
        errors.cooperativeNumber = 'Required*'
    }
    if (!values.contributionAmount) {
        errors.contributionAmount = 'Required*'
    }
    return errors
  }
  const submitHandler =()=>{

  }

const formiks = useFormik({
    initialValues: initialState,
    validate: validator,
    onSubmit: submitHandler
})

  const getForm = () => {
    if (active === "sign-up") {
      return <MemberSignUp formiks={formiks} />;
    } else {
      return <MemberSignIn formik={formik} setActive={setActive}/>;
    }
  };
  return (
    <div className="py-5 cooperative-container px-3">
      <div className="d-sm-flex justify-content-center gap-3 mt-4 cooperative-choice">
        <p
          onClick={() => setActive("sign-up")}
          className={active === "sign-up" ? "activated" : null}
          style={{textAlign:'center'}}
        >
          Sign-up as a member
        </p>
        <p
          onClick={() => setActive("sign-in")}
          className={active === "sign-in" ? "activated" : null}
          style={{textAlign:'center'}}
        >
          Sign-in as a member
        </p>
      </div>
      {getForm()}
    </div>
  );
};

export default Member;
