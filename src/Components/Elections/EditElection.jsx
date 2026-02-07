import React, { useContext, useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "../axios";
import { UserContext } from "../AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const EditElection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { credentials } = useContext(UserContext);

  const [file, setFile] = useState("");
  const [input, setInput] = useState({});

  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [setUpStartDateTime, setSetUpStartDateTime] = useState(null);
  const [setUpEndDateTime, setSetUpEndDateTime] = useState(null);

  // Convert backend dates safely
  const normalizeDate = (value) => {
    if (!value || value === "0001-01-01T00:00:00") return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  };

  // Format all dates like "2025-12-10T08:00:00"
  const formatToServer = (date) => {
    if (!date) return null;
    return format(date, "yyyy-MM-dd'T'HH:mm:ss");
  };

  const getElection = () => {
    axios(`Election/get-election?id=${id}`, {
      headers: { Authorization: `Bearer ${credentials.token}` },
    })
      .then((resp) => {
        const data = resp.data.data;
        setInput(data);

        setStartDateTime(normalizeDate(data.startDateAndTime));
        setEndDateTime(normalizeDate(data.endDateAndTime));
        setSetUpStartDateTime(normalizeDate(data.setUpStartDateAndTime));
        setSetUpEndDateTime(normalizeDate(data.setUpEndDateAndTime));
      })
      .catch((error) => console.error("Error fetching election:", error));
  };

  useEffect(() => {
    getElection();
  }, []);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateElection = (e) => {
    e.preventDefault();
    const payload = new FormData();

    payload.append("id", id);
    payload.append("title", input.title);
    payload.append("description", input.description);

    payload.append("startDateAndTime", formatToServer(startDateTime));
    payload.append("endDateAndTime", formatToServer(endDateTime));
    payload.append("setUpStartDateAndTime", formatToServer(setUpStartDateTime));
    payload.append("setUpEndDateAndTime", formatToServer(setUpEndDateTime));

    payload.append("electionGuideline", file || input.electionGuideLine);

    payload.append(
      "AllowMemberToViewElectionDetails",
      input.allowMemberToViewElectionDetails
    );
    payload.append("AllowMemberToViewResult", input.allowMemberToViewResult);
    payload.append("IsActive", input.isActive);

    axios
      .post("Election/update-election", payload, {
        headers: { Authorization: `Bearer ${credentials.token}` },
      })
      .then((resp) => {
        toast(resp.data.message, { type: "success", autoClose: 3000 });
        setTimeout(() => navigate(-1), 3000);
      })
      .catch((error) => {
        toast(error?.response?.data?.message || "Update failed", {
          type: "error",
        });
      });
  };

  return (
    <div className="mt-4 bg-white px-3 py-3 rounded-3">
      <div className="my-4">
        <span className="active-selector">Update Election Details</span>
      </div>

      <div style={{ border: "solid 1px #fafafa" }} className="rounded-4">
        <div
          className="py-3 px-4 justify-content-between align-items-center d-flex"
          style={{ backgroundColor: "#f4fAfd", borderRadius: "10px 10px 0 0" }}
        >
          <p style={{ fontWeight: 500, fontSize: "16px" }}>
            <BsArrowLeft onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />{" "}
            Update Election Details
          </p>
        </div>

        <form onSubmit={updateElection}>
          <div className="admin-task-forms px-3">

            {/* Title */}
            <div className="d-flex flex-column gap-1">
              <label>Election name:</label>
              <input
                type="text"
                name="title"
                onChange={handleChange}
                value={input?.title || ""}
              />
            </div>

            {/* Start Date */}
            <div className="d-flex flex-column gap-1">
              <label>Start date & time:</label>
              <DatePicker
                selected={startDateTime}
                onChange={setStartDateTime}
                showTimeSelect
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-100"
              />
            </div>

            {/* End Date */}
            <div className="d-flex flex-column gap-1">
              <label>End date & time:</label>
              <DatePicker
                selected={endDateTime}
                onChange={setEndDateTime}
                showTimeSelect
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-100"
              />
            </div>

            {/* Setup Start */}
            <div className="d-flex flex-column gap-1">
              <label>Setup start:</label>
              <DatePicker
                selected={setUpStartDateTime}
                onChange={setSetUpStartDateTime}
                showTimeSelect
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-100"
              />
            </div>

            {/* Setup End */}
            <div className="d-flex flex-column gap-1">
              <label>Setup end:</label>
              <DatePicker
                selected={setUpEndDateTime}
                onChange={setSetUpEndDateTime}
                showTimeSelect
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-100"
              />
            </div>

            {/* Guidelines */}
            <div className="d-flex flex-column gap-1">
              <label>Election guideline</label>
              <input
                type="file"
                name="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="statutory-list p-3">
            <label>
              <input
                type="checkbox"
                name="allowMemberToViewElectionDetails"
                checked={input?.allowMemberToViewElectionDetails || false}
                onChange={handleChange}
              />{" "}
              Allow member to view election details
            </label>

            <label>
              <input
                type="checkbox"
                name="allowMemberToViewResult"
                checked={input?.allowMemberToViewResult || false}
                onChange={handleChange}
              />{" "}
              Allow member to view results
            </label>

            <label>
              <input
                type="checkbox"
                name="isActive"
                checked={input?.isActive || false}
                onChange={handleChange}
              />{" "}
              Is Active?
            </label>
          </div>

          {/* Buttons */}
          <div
            className="d-flex justify-content-end gap-3 py-4 px-2"
            style={{
              backgroundColor: "#F5F5F5",
              borderRadius: "0 0 10px 10px",
            }}
          >
            <button className="btn btn-md rounded-5" type="reset">
              Discard
            </button>
            <button
              className="btn btn-md text-white rounded-5"
              style={{ backgroundColor: "var(--custom-color)" }}
              type="submit"
            >
              Update
            </button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default EditElection;
