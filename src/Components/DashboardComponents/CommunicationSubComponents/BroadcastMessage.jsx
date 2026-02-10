// import React, { useState, useEffect, useContext } from "react";
// import * as Yup from "yup";
// import { Multiselect } from "react-widgets";
// import { ErrorMessage, Field, Formik, Form } from "formik";
// import ErrorText from "../ErrorText";
// import axios from "../../axios";
// import { UserContext } from "../../AuthContext";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import { BsArrowLeft } from "react-icons/bs";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const BroadcastMessage = () => {
//   const [channels, setChannels] = useState([]);
//   const [receiverTypes, setReceiverTypes] = useState([]);
//   const [receiverType, setReceiverType] = useState(null);
//   const [customers, setCustomers] = useState([]);
//   const [admins, setAdmins] = useState([]);
//   const [customerIDs, setCustomerIDs] = useState([]);
//   const [content, setContent] = useState("");
//   const [loading, setLoading] = useState(false)

//   const { credentials } = useContext(UserContext);
//   const navigate = useNavigate();

//   /* ---------------- FETCHES ---------------- */

//   useEffect(() => {
//     axios("Communication/message-channels", {
//       headers: { Authorization: `Bearer ${credentials.token}` },
//     }).then((resp) => setChannels(resp.data));

//     axios("Communication/receiver-type", {
//       headers: { Authorization: `Bearer ${credentials.token}` },
//     }).then((resp) => setReceiverTypes(resp.data));

//     axios("MemberManagement/account-enquiry-select", {
//       headers: { Authorization: `Bearer ${credentials.token}` },
//     }).then((resp) => setCustomers(resp.data.data));

//     axios("Communication/admins", {
//       headers: { Authorization: `Bearer ${credentials.token}` },
//     }).then((resp) => setAdmins(resp.data));
//   }, []);

//   /* ---------------- FORM CONFIG ---------------- */

//   const initialValues = {
//     title: "",
//     messageChannels: [], // 👈 ARRAY
//     scheduleMessage: false,
//     scheduleDate: "",
//   };

//   const validationSchema = Yup.object({
//     title: Yup.string().required("Title is required"),
//     messageChannels: Yup.array()
//       .min(1, "Select at least one channel")
//       .required(),
//   });


//   const onSubmit = (values) => {
//     const payload = {
//       title: values.title,
//       description: content,
//       scheduleMessage: values.scheduleMessage,
//       scheduleDate: values.scheduleDate ? values.scheduleDate : null,
//       messageChanels: values.messageChannels, 
//       receiver: Number(receiverType),
//       employeeIds: customerIDs,
//     };
//     setLoading(true)
//     axios
//       .post("Communication/broad-cast", payload, {
//         headers: { Authorization: `Bearer ${credentials.token}` },
//       })
//       .then((resp) => {
//         toast(resp.data.message, { type: "success", autoClose: 5000 });
//     setLoading(false)
//         setTimeout(() => navigate(-1), 2000);
//       })
//       .catch((error) =>{
//         toast(error.response?.data?.message || "Error", {
//           type: "error",
//           autoClose: false,
//         })
//         setLoading(false)}
//       );
//   };


//   return (
//     <>
//       <Formik
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         onSubmit={onSubmit}
//       >
//         {({ values, setFieldValue }) => (
//           <Form>
//             <div
//               className="bg-white mt-4"
//               style={{ border: "1px solid #f2f2f2", borderRadius: "15px" }}
//             >
//               <div
//                 className="p-3 d-flex align-items-center gap-2"
//                 style={{
//                   backgroundColor: "#F5F9FF",
//                   borderRadius: "15px 15px 0 0",
//                   cursor: "pointer",
//                 }}
//                 onClick={() => navigate(-1)}
//               >
//                 <BsArrowLeft />
//                 <span style={{ fontSize: "14px", color: "#4D4D4D" }}>
//                   Create broadcast
//                 </span>
//               </div>

//               <div className="admin-task-forms px-3">
//                 <div className="d-flex gap-1 flex-column">
//                   <label>Title</label>
//                   <Field name="title" />
//                   <ErrorMessage name="title" component={ErrorText} />
//                 </div>

//                 <div className="d-flex gap-1 flex-column">
//                   <label>Channels</label>
//                   <Multiselect
//                     data={channels}
//                     dataKey="value"
//                     textField="name"
//                     value={channels.filter((c) =>
//                       values.messageChannels.includes(c.value)
//                     )}
//                     onChange={(selected) =>
//                       setFieldValue(
//                         "messageChannels",
//                         selected.map((c) => c.value)
//                       )
//                     }
//                     placeholder="Select channel(s)"
//                   />
//                   <ErrorMessage
//                     name="messageChannels"
//                     component={ErrorText}
//                   />
//                 </div>

//                 <div className="d-flex gap-1 flex-column">
//                   <label>Receiver Type</label>
//                   <select
//                     value={receiverType ?? ""}
//                     onChange={(e) => {
//                       setReceiverType(e.target.value);
//                       setCustomerIDs([]);
//                     }}
//                   >
//                     <option value="">Select</option>
//                     {receiverTypes.map((r) => (
//                       <option key={r.value} value={r.value}>
//                         {r.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="my-2 px-3">
//                 <label>
//                   {receiverType === "0" ? "Admins" : "Members"}
//                 </label>
//                 {/* <Multiselect
//                   data={receiverType === "0" ? admins : customers}
//                   dataKey={
//                     receiverType === "0" ? "employeeId" : "customerId"
//                   }
//                   textField={
//                     receiverType === "0"
//                       ? "employeeFullName"
//                       : "customerInfomation"
//                   }
//                   onChange={(list) =>
//                     setCustomerIDs(
//                       list.map((i) =>
//                         receiverType === "0"
//                           ? i.employeeId
//                           : i.customerId
//                       )
//                     )
//                   }
//                   placeholder="Select receivers"
//                 /> */}

//                 <div className="my-2 px-3">
//   <div className="d-flex justify-content-between align-items-center">
//     <label>{receiverType === "0" ? "Admins" : "Members"}</label>
//     {receiverType && (
//       <button
//         type="button"
//         className="btn btn-sm btn-light"
//         onClick={() => {
//           const allIds =
//             receiverType === "0"
//               ? admins.map((a) => a.employeeId)
//               : customers.map((c) => c.customerId);
//           setCustomerIDs(allIds);
//         }}
//       >
//         Select All
//       </button>
//     )}
//   </div>

//   <Multiselect
//     data={receiverType === "0" ? admins : customers}
//     dataKey={receiverType === "0" ? "employeeId" : "customerId"}
//     textField={receiverType === "0" ? "employeeFullName" : "customerInfomation"}
//     value={
//       receiverType === "0"
//         ? admins.filter((a) => customerIDs.includes(a.employeeId))
//         : customers.filter((c) => customerIDs.includes(c.customerId))
//     }
//     onChange={(list) =>
//       setCustomerIDs(
//         list.map((i) =>
//           receiverType === "0" ? i.employeeId : i.customerId
//         )
//       )
//     }
//     placeholder="Select receivers"
//   />
// </div>

//               </div>

//               <div className="my-2 px-3">
//                 <label>Description</label>
//                 <ReactQuill value={content} onChange={setContent} />
//               </div>

//               <div className="px-4 mb-3">
//                 <div className="d-flex gap-2 align-items-center">
//                   Schedule message
//                   <Field name="scheduleMessage" type="checkbox" />
//                 </div>

//                 {values.scheduleMessage && (
//                   <div className="d-flex flex-column gap-2">
//                     <label>Schedule Date</label>
//                     <Field type="date" name="scheduleDate" />
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* FOOTER */}
//             <div className="d-flex justify-content-end gap-2 mt-3 p-3">
//               <button type="reset" className="btn btn-md">
//                 Discard
//               </button>
//               <button
//                 type="submit"
//                 className="btn btn-md"
//                 style={{
//                   backgroundColor: "var(--custom-color)",
//                   color: "#fff",
//                   borderRadius: "1.2rem",
//                 }}
//               disabled={loading}
//               >
//                {!loading ? 'Proceed' : 'Loading...'}
//               </button>
//             </div>
//           </Form>
//         )}
//       </Formik>

//       <ToastContainer />
//     </>
//   );
// };

// export default BroadcastMessage;

import React, { useState, useEffect, useContext } from "react";
import * as Yup from "yup";
import { Multiselect } from "react-widgets";
import { ErrorMessage, Field, Formik, Form } from "formik";
import ErrorText from "../ErrorText";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { BsArrowLeft } from "react-icons/bs";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const BroadcastMessage = () => {
  const [channels, setChannels] = useState([]);
  const [receiverTypes, setReceiverTypes] = useState([]);
  const [receiverType, setReceiverType] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [customerIDs, setCustomerIDs] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const { credentials } = useContext(UserContext);
  const navigate = useNavigate();

  /* ---------------- FETCHES ---------------- */

  useEffect(() => {
    axios("Communication/message-channels", {
      headers: { Authorization: `Bearer ${credentials.token}` },
    }).then((resp) => setChannels(resp.data));

    axios("Communication/receiver-type", {
      headers: { Authorization: `Bearer ${credentials.token}` },
    }).then((resp) => setReceiverTypes(resp.data));

    axios("MemberManagement/account-enquiry-select", {
      headers: { Authorization: `Bearer ${credentials.token}` },
    }).then((resp) => setCustomers(resp.data.data));

    axios("Communication/admins", {
      headers: { Authorization: `Bearer ${credentials.token}` },
    }).then((resp) => setAdmins(resp.data));
  }, []);

  /* ---------------- FORM CONFIG ---------------- */

  const initialValues = {
    title: "",
    messageChannels: [],
    scheduleMessage: false,
    scheduleDate: "",
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    messageChannels: Yup.array()
      .min(1, "Select at least one channel")
      .required(),
  });

  const onSubmit = (values) => {
    const payload = {
      title: values.title,
      description: content, 
      scheduleMessage: values.scheduleMessage,
      scheduleDate: values.scheduleDate || null,
      messageChanels: values.messageChannels,
      receiver: Number(receiverType),
      employeeIds: customerIDs,
    };

    setLoading(true);
    axios
      .post("Communication/broad-cast", payload, {
        headers: { Authorization: `Bearer ${credentials.token}` },
      })
      .then((resp) => {
        toast(resp.data.message, { type: "success", autoClose: 5000 });
        setLoading(false);
        setTimeout(() => navigate(-1), 2000);
      })
      .catch((error) => {
        toast(error.response?.data?.message || "Error", {
          type: "error",
          autoClose: false,
        });
        setLoading(false);
      });
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div
              className="bg-white mt-4"
              style={{ border: "1px solid #f2f2f2", borderRadius: "15px" }}
            >
              {/* HEADER */}
              <div
                className="p-3 d-flex align-items-center gap-2"
                style={{
                  backgroundColor: "#F5F9FF",
                  borderRadius: "15px 15px 0 0",
                  cursor: "pointer",
                }}
                onClick={() => navigate(-1)}
              >
                <BsArrowLeft />
                <span style={{ fontSize: "14px", color: "#4D4D4D" }}>
                  Create broadcast
                </span>
              </div>

              {/* BODY */}
              <div className="admin-task-forms px-3">
                <div className="d-flex gap-1 flex-column">
                  <label>Title</label>
                  <Field name="title" />
                  <ErrorMessage name="title" component={ErrorText} />
                </div>

                <div className="d-flex gap-1 flex-column">
                  <label>Channels</label>
                  <Multiselect
                    data={channels}
                    dataKey="value"
                    textField="name"
                    value={channels.filter((c) =>
                      values.messageChannels.includes(c.value)
                    )}
                    onChange={(selected) =>
                      setFieldValue(
                        "messageChannels",
                        selected.map((c) => c.value)
                      )
                    }
                    placeholder="Select channel(s)"
                  />
                  <ErrorMessage name="messageChannels" component={ErrorText} />
                </div>

                <div className="d-flex gap-1 flex-column">
                  <label>Receiver Type</label>
                  <select
                    value={receiverType ?? ""}
                    onChange={(e) => {
                      setReceiverType(e.target.value);
                      setCustomerIDs([]);
                    }}
                  >
                    <option value="">Select</option>
                    {receiverTypes.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* RECEIVERS */}
              <div className="my-2 px-3">
                <div className="d-flex justify-content-between align-items-center">
                  <label>{receiverType === "0" ? "Admins" : "Members"}</label>
                  {receiverType && (
                    <button
                      type="button"
                      className="btn btn-sm btn-light"
                      onClick={() => {
                        const allIds =
                          receiverType === "0"
                            ? admins.map((a) => a.employeeId)
                            : customers.map((c) => c.customerId);
                        setCustomerIDs(allIds);
                      }}
                    >
                      Select All
                    </button>
                  )}
                </div>

                <Multiselect
                  data={receiverType === "0" ? admins : customers}
                  dataKey={
                    receiverType === "0" ? "employeeId" : "customerId"
                  }
                  textField={
                    receiverType === "0"
                      ? "employeeFullName"
                      : "customerInfomation"
                  }
                  value={
                    receiverType === "0"
                      ? admins.filter((a) =>
                          customerIDs.includes(a.employeeId)
                        )
                      : customers.filter((c) =>
                          customerIDs.includes(c.customerId)
                        )
                  }
                  onChange={(list) =>
                    setCustomerIDs(
                      list.map((i) =>
                        receiverType === "0"
                          ? i.employeeId
                          : i.customerId
                      )
                    )
                  }
                  placeholder="Select receivers"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="my-2 px-3">
                <label>Description</label>
                <CKEditor
                  editor={ClassicEditor}
                  data={content}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setContent(data);
                  }}
                />
              </div>

              {/* SCHEDULE */}
              <div className="px-4 mb-3">
                <div className="d-flex gap-2 align-items-center">
                  Schedule message
                  <Field name="scheduleMessage" type="checkbox" />
                </div>

                {values.scheduleMessage && (
                  <div className="d-flex flex-column gap-2">
                    <label>Schedule Date</label>
                    <Field type="date" name="scheduleDate" />
                  </div>
                )}
              </div>
            </div>

            {/* FOOTER */}
            <div className="d-flex justify-content-end gap-2 mt-3 p-3">
              <button type="reset" className="btn btn-md">
                Discard
              </button>
              <button
                type="submit"
                className="btn btn-md"
                style={{
                  backgroundColor: "var(--custom-color)",
                  color: "#fff",
                  borderRadius: "1.2rem",
                }}
                disabled={loading}
              >
                {!loading ? "Proceed" : "Loading..."}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <ToastContainer />
    </>
  );
};

export default BroadcastMessage;
