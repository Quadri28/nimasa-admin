import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import Pagination from "./Pagination";
import { exportToExcel } from "./ExportMemberLedgerToExcel";
import MemberLedgerPDF from "./ExportMemberLedgerToPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Combobox from "react-widgets/Combobox";

const GLAccountStatement = () => {
 const [reports, setReports] = useState([]);
   const [startDate, setStartDate] = useState("");
   const [option, setOption] = useState(null);
   const [endDate, setEndDate] = useState("");
   const [account, setAccount] = useState("");
   const [enquiries, setEnquiries] = useState([]);
   const [details, setDetails] = useState({});
   const { credentials } = useContext(UserContext);
 
 
   // Manual Pagination handling
   const [currentPage, setCurrentPage] = useState(1);
   const [recordsPerPage] = useState(1);
 
   const indexOfLastRecord = currentPage * recordsPerPage;
   const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
   const currentRecord = reports.slice(indexOfFirstRecord, indexOfLastRecord);
 
   const fetchCustomerEnquiries = () => {
     axios(`Acounting/general-ledger-customer-enquiry?SearchOption=1`, {
       headers: {
         Authorization: `Bearer ${credentials.token}`,
       },
     }).then((resp) => setEnquiries(resp.data.data));
   };
 
   useEffect(() => {
     fetchCustomerEnquiries();
   }, []);
 
   const getReports = async () => {
     try {
       const resp = await axios.get(
         `Reports/member-ledger-report?AccountNumber=${account}&StartDate=${startDate}&EndDate=${endDate}&ReportOption=${option}`,
         {
           headers: {
             Authorization: `Bearer ${credentials.token}`,
           },
         }
       );
 
       if (resp.data.data.memberLedgerReport) {
         const fetchedReports = resp.data.data.memberLedgerReport;
         setReports(fetchedReports);
       }
     } catch (error) {
       console.error("Error fetching reports:", error);
     }
   };
 
   useEffect(() => {
     getReports();
   }, [account, startDate, endDate, option]);
 
   useEffect(() => {
     if (currentRecord.length > 0) {
       setDetails((prevDetails) => {
         // Only update if the new details are different
         if (JSON.stringify(prevDetails) !== JSON.stringify(currentRecord[0])) {
           return currentRecord[0];
         }
         return prevDetails; // Prevents unnecessary re-renders
       });
     }
   }, [currentRecord]);
 
   const formattedEnquiries = enquiries.map((e) => ({
   ...e,
   label: `${e.acctName} >> ${e.accountNumber}`,
 }));
  
   return (
     <div className="card mt-3 p-3  rounded-4">
       <div className="admin-task-forms">
         <div className="d-flex flex-column gap-1">
           <label htmlFor="startDate">
             Start Date<sup className="text-danger">*</sup>
           </label>
           <input
             type="date"
             name={startDate}
             onChange={(e) => setStartDate(e.target.value)}
           />
         </div>
         <div className="d-flex flex-column gap-1">
           <label htmlFor="startDate">
             End Date<sup className="text-danger">*</sup>
           </label>
           <input
             type="date"
             name={endDate}
             onChange={(e) => setEndDate(e.target.value)}
           />
         </div>
         <div className="d-flex flex-column gap-1">
           <label htmlFor="startDate">
             Select date type<sup className="text-danger">*</sup>
           </label>
           <select name={option} onChange={(e) => setOption(e.target.value)}>
             <option value="">Select</option>
             <option value="1">By Posting Date</option>
             <option value="2">By Value Date</option>
           </select>
         </div>
         <div className="d-flex flex-column gap-1">
           <label htmlFor="account">
             Select Account<sup className="text-danger">*</sup>
           </label>
           <Combobox
           data={formattedEnquiries}
           value={account}
           onChange={(val) => setAccount(val.accountNumber)}
           valueField="accountNumber"
           textField="label"
           filter="contains"
         />
         </div>
       </div>
       <div className="admin-task-forms">
         <div
           className=""
           style={{
             boxShadow: "3px 3px 3px 3px #f2f2f2",
             borderRadius: "1rem 1rem 0 0",
           }}
         >
           <div
             style={{
               backgroundColor: "#EDF4FF",
               padding: "10px 15px 2px",
               borderRadius: "1rem 1rem 0 0",
             }}
           >
             <p style={{ fontSize: "14px" }}>Account Details</p>
           </div>
           <div
             className="px-4 d-flex flex-column gap-2 py-2"
             style={{ fontSize: "14px" }}
           >
             <div className="d-flex gap-3">
               <span>Cooperative Name:</span>
               <p>{details?.branchAddress}</p>
             </div>
             <div className="d-flex gap-3 discourse">
               <span>Account Name:</span>
               <p>{details?.accountName}</p>
             </div>
             <div className="d-flex gap-3 discourse">
               <span>Account Number:</span>
               <p>{details?.accountNumber}</p>
             </div>
           </div>
         </div>
         <div
           className=""
           style={{
             boxShadow: "3px 3px 3px 3px #f2f2f2",
             borderRadius: "1rem 1rem 0 0",
           }}
         >
           <div
             style={{
               backgroundColor: "#FEF3E6",
               padding: "10px 15px 2px",
               borderRadius: "1rem 1rem 0 0",
             }}
           >
             <p>Summary Detail</p>
           </div>
           <div className="d-flex flex-column gap-2 py-2 px-3">
             <div className="d-flex gap-3 discourse">
               <span>Branch:</span>
               <p>{details?.branchName}</p>
             </div>
             <div className="d-flex gap-3 discourse">
               <span>Opening Balance:</span>
               <p>
                 {new Intl.NumberFormat("en-US", {
                   minimumFractionDigits: 2,
                 }).format(details?.openingBalance)}
               </p>
             </div>
             <div className="d-flex gap-3 discourse">
               <span>Closing Balance:</span>
               <p>
                 {new Intl.NumberFormat("en-US", {
                   minimumFractionDigits: 2,
                 }).format(details?.closingBalance)}
               </p>
             </div>
             <div className="d-flex gap-3 discourse">
               <span>Product Name:</span>
               <p>{details?.productName}</p>
             </div>
           </div>
         </div>
       </div>
       <div className="d-flex justify-content-end mt-3 gap-3">
       <PDFDownloadLink
         document={<MemberLedgerPDF currentRecord={currentRecord} />}
         fileName={`Member_Ledger_${currentRecord[0]?.accountNumber}.pdf`}
         style={{
           padding: "10px 15px",
           backgroundColor: "#007bff",
           color: "#fff",
           borderRadius: "20px",
           textDecoration: "none",
           fontSize: "14px",
           fontWeight: "bold",
         }}
       >
         {({ loading }) => (loading ? "Generating PDF..." : "Export to PDF")}
       </PDFDownloadLink>
         <button className="member btn-md border-0" onClick={() => exportToExcel(currentRecord, "MemberLedgerStatement")}>
            Export to Excel
         </button>
       </div>
       <div className="table-responsive mt-4" id="customers">
         <table className="table table-bordered">
           <thead>
             <tr>
               <th>Date</th>
               <th>Transaction Details</th>
               <th>Reference</th>
               <th>Value Date</th>
               <th>Dr</th>
               <th>Cr</th>
               <th>Balance</th>
             </tr>
           </thead>
           <tbody>
             {currentRecord.map((ledger, i) => {
               return (
                 <>
                   {ledger?.memberLedgers?.map((led, i) => (
                     <tr key={i}>
                       <td>{new Date(led?.date).toLocaleDateString()} </td>
                       <td>{led.transactionDetail}</td>
                       <td>{led.reference}</td>
                       <td>{new Date(led?.valueDate).toLocaleDateString() } {new Date(led?.valueDate).toLocaleTimeString() }</td>
                       <td>
                         {new Intl.NumberFormat("en-US", {
                           minimumFractionDigits: 2,
                         }).format(led.dr)}
                       </td>
                       <td>
                         {new Intl.NumberFormat("en-US", {
                           minimumFractionDigits: 2,
                         }).format(led.cr)}
                       </td>
                       <td>
                         {new Intl.NumberFormat("en-US", {
                           minimumFractionDigits: 2,
                         }).format(led.balance)}
                       </td>
                     </tr>
                   ))}
                 </>
               );
             })}
           </tbody>
         </table>
         {reports.length > 1 && (
           <Pagination
             currentPage={currentPage}
             setCurrentPage={setCurrentPage}
             indexOfFirstRecord={indexOfFirstRecord}
             indexOfLastRecord={indexOfLastRecord}
             reports={reports}
           />
         )}
       </div>
     </div>
   );
 };
 

export default GLAccountStatement
