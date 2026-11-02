import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ErrorText from "./agentForms/ErrorText";

const InTouch = () => {
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  };
  const phoneRegex =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    phone: Yup.string().min(11, 'Invalid phone number')
      .matches(phoneRegex, "Invalid phone number").required("Required"),
    message: Yup.string().required("Required"),
  });

  
  const onSubmit = (values) => {
   console.log(values)
  };

  return (
    <>
      <div className="text-center in-touch">
        <h2>Get in touch with us.</h2>
        <p>
          Members contribute equitably to, and democratically control, the
          capital of their Cooperative.{" "}
        </p>
      </div>
      <div className="mx-auto p-4 form-container">
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={onSubmit}
        >
          {({ values }) => (
            <Form>
              <div className="justify-content-center initial-input">
                <div style={{ width: "100%" }}>
                  <label htmlFor="firstName">First Name</label> <br />
                  <Field
                    type="text"
                    required
                    name="firstName"
                    placeholder="Enter first name"
                    style={{ width: "100%" }}
                  />
                  <ErrorMessage name="firstName" component={ErrorText} />
                </div>
                <div style={{ width: "100%" }}>
                  <label htmlFor="lastName">Last Name</label> <br />
                  <Field
                    required
                    name="lastName"
                    placeholder="Enter last name"
                    style={{ width: "100%" }}
                  />
                  <ErrorMessage name="lastName" component={ErrorText} />
                </div>
              </div>
              <div className="d-flex flex-column gap-2 justify-content-center mt-2">
                <div style={{ width: "100%" }}>
                  <label htmlFor="email">Email</label>
                  <br />
                  <Field
                    type="text"
                    required
                    name="email"
                    placeholder="Enter email address"
                    style={{ width: "100%" }}
                  />
                  <ErrorMessage name="email" component={ErrorText} />
                </div>
                <div style={{ width: "100%" }}>
                  <label htmlFor="phone">Phone Number</label>
                  <Field
                    required
                    name="phone"
                    placeholder="Enter phone number"
                    style={{ width: "100%" }}
                  />
                  <ErrorMessage name="phone" component={ErrorText} />
                </div>
                <div style={{ width: "100%" }}>
                  <label htmlFor="message">Message</label>
                  <Field
                    as="textarea"
                    required
                    name="message"
                    id=""
                    placeholder="Your message"
                    style={{ width: "100%" }}
                  />
                  <ErrorMessage name="message" component={ErrorText} />
                </div>
              </div>
              <div className="text-center d-flex">
                <a
                  className="border-0 btn-md mt-3 in-touch-btn p-2 rounded-3"
                  href={`mailto:ucpsupport@cwg-plc.com?subject=Getting in touch&body=Hello Fifthlab.%0D%0A %0D%0A
               My name is ${values.firstName} ${values.lastName}.My phone number is ${values.phone} and my email is ${values.email}. %0D%0A ${values.message}
               %0D%0A %0D%0A Kind Regards, %0D%0A ${values.firstName} ${values.lastName}`}
                style={{textDecoration:'none'}}>
                  Get in touch
                </a>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default InTouch;
