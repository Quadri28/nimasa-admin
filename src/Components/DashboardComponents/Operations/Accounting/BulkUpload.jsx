import React, { useMemo, useState, useContext, useEffect } from "react";
import upload from "../../../../assets/directbox-send.svg";
import { UserContext } from "../../../AuthContext";
import axios from "../../../axios";
import "./Accounting.css";
import { FileUploader } from "react-drag-drop-files";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import { toast, ToastContainer } from "react-toastify";

const BulkUpload = () => {
  const { credentials } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [batchNumber, setBatchNumber] = useState({});
  const [amount, setAmount] = useState(0);
  const [data, setData] = useState([]);

  const handleChange = (file) => {
    setFile(file);
    const payload = new FormData();
    payload.append("file", file);
    axios
      .post(
        `Acounting/bulk-upload?batchNo=${batchNumber.batchNumber}&currencyCode=001`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${credentials.token}`,
          },
        }
      )
      .then((resp) => {
        setAmount(resp?.data?.data.totalAmount);
        if (resp.data.data.bulkPostDetails) {
          setData(resp?.data?.data?.bulkPostDetails);
        }
      })
      .catch((error) => console.log(error));
  };

  const getTemplate = () => {
    setLoading(true);
    axios("Acounting/bulk-upload-template", {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((blob) => {
      const url = window.URL.createObjectURL(new Blob([blob.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `BulkUploadTemplate${new Date().toLocaleTimeString()}.xlsx`);
      link.click();
      window.URL.revokeObjectURL(url);
      setLoading(false);
      toast("Download was successful", { type: "success", autoClose: 2000 });
    });
  };
const resetForm = () => {
  setFile(null);
  setAmount(0);
  setData([]);
  setIsLoading(false);
  fetchBatchNo();
};

  const fetchBatchNo = () => {
    axios("Acounting/fetch-batch-no", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setBatchNumber(resp.data.data));
  };

  useEffect(() => {
    fetchBatchNo();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true)
    const payload = {
      batchNo: String(batchNumber.batchNumber),
      trackingId: String(batchNumber.batchNumber),
    };
    axios
      .post("Acounting/upload-bulk", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) =>{
        toast(resp.data.message, {
          type: "success",
          autoClose: 5000,
          pauseOnHover: true,
        })
    setIsLoading(false)
    resetForm()
      }
      )
      .catch((error) => {
        toast(error.response.data.message, {
          type: "error",
          pauseOnHover: true,
          autoClose: 5000,
        });
        setIsLoading(false)
      });
  };

  // Displaying Table
  const column = [
    { Header: "Dr Account", accessor: "drAccount" },
    { Header: "Cr Account", accessor: "crAccount" },
    { Header: "Amount", accessor: "amount", Cell:(({value})=>{
      return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
    })},
    { Header: "Value Date", accessor: "valueDate" },
    { Header: "Narration", accessor: "narration" },
  ];
  const columns = useMemo(() => column, []);

  const tableInstance = useTable(
    {
      columns: columns,
      data: data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    page,
    prepareRow,
    headerGroups,
    state,
    setGlobalFilter,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
  } = tableInstance;
  const { globalFilter, pageIndex } = state;
  return (
    <div className="card p-4 bg-white border-0 rounded-4 mt-3">
      <div className="d-flex justify-content-between flex-wrap gap-3">
        <span className="active-selector">Bulk Upload</span>
        <button className="border-0 member" onClick={() => getTemplate()} disabled={loading}>
          {loading ? 'Downloading...' : 'Download template'}
        </button>
      </div>
      <>
        <div
          className="bg-white mt-4"
          style={{
            borderRadius: "15px",
            border: "solid .5px #fafafa",
            borderBlock: "0",
          }}
        >
          <div
            style={{
              backgroundColor: "#f4fAfd",
              borderRadius: "15px 15px 0 0",
            }}
            className="p-3"
          >
            <h5 style={{ fontSize: "16px", color: "#333" }}>Upload Batch</h5>
          </div>
          <form onSubmit={onSubmit}>
            <div className="admin-task-forms g-2 px-3">
              <div className="d-flex flex-column gap-1">
                <label htmlFor="">Total Transaction Amount:</label>
                <input
                  name="transactionAmount"
                  value={amount}
                  readOnly
                  className="w-100 rounded-4 py-3 px-2"
                />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="">Batch No:</label>
                <input
                  name={batchNumber}
                  value={batchNumber.batchNumber}
                  readOnly
                  className="w-100 py-3 px-2 rounded-4"
                />
              </div>
            </div>
            <div
              className="my-5 d-flex flex-column text-center
             justify-content-center align-items-center rounded-4 px-3 mx-3"
              style={{ border: "2px dashed #ddd", height: "max-content" }}
            >
              <div style={{ margin: "2rem" }}>
                <img className="img-fluid mb-2" src={upload} />
                <FileUploader
                  name="file"
                  handleChange={handleChange}
                  maxSize="5mb"
                  label="Drag and drop or upload a file, maximum size of 5000kb"
                />
                <p>
                  {file ? `File name: ${file.name}` : "no files uploaded yet"}
                </p>
              </div>
            </div>
            <div className="table-responsive px-3">
              {data.length > 0 ? (
                <table {...getTableProps()} id="customers" className="table">
                  <thead>
                    {headerGroups.map((headerGroup) => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        <th>S/N</th>
                        {headerGroup.headers.map((column) => (
                          <th
                            {...column.getHeaderProps(
                              column.getSortByToggleProps()
                            )}
                          >
                            {column.render("Header")}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {page.map((row, index) => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()}>
                          <td>{index + 1}</td>
                          {row.cells.map((cell) => {
                            return (
                              <td {...cell.getCellProps()}>
                                {cell.render("Cell")}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : null}
            </div>
            <div
              style={{
                backgroundColor: "#f2f2f2",
                borderRadius: "0 0 15px 15px",
              }}
              className="d-flex justify-content-end gap-3 p-3"
            >
              <button
                type="reset"
                className="btn btn-sm rounded-5"
                style={{ backgroundColor: "#f7f7f7" }}
              >
                Discard
              </button>
              <button type="submit" className="border-0 btn-md member" disabled={isLoading}>
                {isLoading ? "Loading..." : "Post"}
              </button>
            </div>
          </form>
        </div>
      </>
      <ToastContainer />
    </div>
  );
};

export default BulkUpload;
