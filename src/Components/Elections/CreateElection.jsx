import React, { useContext, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import { UserContext } from "../AuthContext";
import { toast, ToastContainer } from "react-toastify";
import DatePicker from "react-datepicker";

const CreateElection = () => {
  const [input, setInput] = useState({
    electionName: "",
    startDate: "",
    startTime: null, 
    endDate: "",
    endTime: null, 
    SetUpStartDateAndTime: null, 
    SetUpEndDateAndTime: null,
    allowViewDetail: false,
    allowViewElection: false,
    isActive: false,
    description: ""
  });

  const [file, setFile] = useState("");
  const { credentials } = useContext(UserContext);
  const navigate = useNavigate();

  // Convert Date → "YYYY-MM-DDTHH:mm:ss"
  const formatDateTime = (dateObj) => {
    if (!dateObj || isNaN(dateObj.getTime())) return "";
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hour = String(dateObj.getHours()).padStart(2, "0");
    const minute = String(dateObj.getMinutes()).padStart(2, "0");
    const second = String(dateObj.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  };

  // Handles all inputs
  const handleChange = (e, name) => {
    if (name) {
      // TIME pickers (store Date object)
      if (name === "startTime" || name === "endTime") {
        setInput((prev) => ({
          ...prev,
          [name]: e, // store pure Date object
        }));
        return;
      }

      // DATETIME pickers
      setInput((prev) => ({
        ...prev,
        [name]: e,
      }));
      return;
    }

    const { type, value, checked, name: fieldName } = e.target;

    setInput((prev) => ({
      ...prev,
      [fieldName]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit
  const createElection = (e) => {
    e.preventDefault();

    // Combine date + time into full datetime
    const startDateTime = formatDateTime(
      new Date(`${input.startDate}T${formatDateTime(input.startTime).split("T")[1]}`)
    );

    const endDateTime = formatDateTime(
      new Date(`${input.endDate}T${formatDateTime(input.endTime).split("T")[1]}`)
    );

    const setupStartDateTime = formatDateTime(input.SetUpStartDateAndTime);
    const setupEndDateTime = formatDateTime(input.SetUpEndDateAndTime);

    const payload = new FormData();
    payload.append("Title", input.electionName);
    payload.append("IsActive", input.isActive);
    payload.append("StartDateAndTime", startDateTime);
    payload.append("EndDateAndTime", endDateTime);
    payload.append("SetUpStartDateAndTime", setupStartDateTime);
    payload.append("SetUpEndDateAndTime", setupEndDateTime);
    payload.append("Description", input.description);
    payload.append("ElectionGuideLine", file);
    payload.append("AllowMemberToViewElectionDetails", input.allowViewDetail);
    payload.append("AllowMemberToViewResult", input.allowViewElection);

    axios
      .post("Election/create-election", payload, {
        headers: { Authorization: `Bearer ${credentials.token}` },
      })
      .then((resp) => {
        toast(resp.data.message, { type: "success", autoClose: 5000 });
        setTimeout(() => navigate(-1), 5000);
      })
      .catch((err) =>
        toast(err.response?.data?.message || "Error", {
          type: "error",
          autoClose: false,
        })
      );
  };

  return (
    <div className="mt-4 bg-white px-3 py-3 rounded-3">
      <div className="mb-4 mt-2">
        <span className="active-selector">Create new election</span>
      </div>

      <div style={{ border: "solid 1px #fafafa" }} className="rounded-4">
        <div
          className="py-3 px-4 justify-content-between align-items-center d-flex"
          style={{ backgroundColor: "#f4fafd", borderRadius: "10px 10px 0 0" }}
        >
          <p style={{ fontWeight: "500", fontSize: "16px" }}>
            <BsArrowLeft onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />{" "}
            Create new election
          </p>
        </div>

        <form onSubmit={createElection}>
          <div className="admin-task-forms px-3">
            <div className="d-flex flex-column gap-1">
              <label>Election name *</label>
              <input type="text" name="electionName" required onChange={handleChange} />
            </div>

            <div className="d-flex flex-column gap-1">
              <label>Start date *</label>
              <input type="date" name="startDate" required onChange={handleChange} />
            </div>

            <div className="d-flex flex-column gap-1">
              <label>Start time *</label>
              <DatePicker
                selected={input.startTime}
                onChange={(date) => handleChange(date, "startTime")}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                dateFormat="h:mm aa"
                className="w-100"
                required
              />
            </div>

            <div className="d-flex flex-column gap-1">
              <label>End date *</label>
              <input type="date" name="endDate" required onChange={handleChange} />
            </div>

            <div className="d-flex flex-column gap-1">
              <label>End time *</label>
              <DatePicker
                selected={input.endTime}
                onChange={(date) => handleChange(date, "endTime")}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                dateFormat="h:mm aa"
                className="w-100"
                required
              />
            </div>

            <div className="d-flex flex-column gap-1">
              <label>Setup start date & time *</label>
              <DatePicker
                selected={input.SetUpStartDateAndTime}
                onChange={(date) => handleChange(date, "SetUpStartDateAndTime")}
                showTimeSelect
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-100"
                required
              />
            </div>

            <div className="d-flex flex-column gap-1">
              <label>Setup end date & time *</label>
              <DatePicker
                selected={input.SetUpEndDateAndTime}
                onChange={(date) => handleChange(date, "SetUpEndDateAndTime")}
                showTimeSelect
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-100"
                required
              />
            </div>
          </div>

          <div className="statutory-list px-3">
            <div className="d-flex flex-column gap-1">
              <label>Election guideline *</label>
              <input type="file" required onChange={(e) => setFile(e.target.files[0])} />
            </div>

            <div className="d-flex gap-1 align-items-center">
              <input type="checkbox" name="allowViewDetail" onChange={handleChange} />
              <label>Allow member view election details?</label>
            </div>

            <div className="d-flex gap-1 align-items-center">
              <input type="checkbox" name="allowViewElection" onChange={handleChange} />
              <label>Allow member view election results?</label>
            </div>

            <div className="d-flex gap-1 align-items-center">
              <input type="checkbox" name="isActive" onChange={handleChange} />
              <label>Is Active?</label>
            </div>
          </div>

          <div className="px-3 mb-3 d-flex flex-column gap-1">
            <label>Description</label>
            <textarea
              name="description"
              style={{
                backgroundColor: "#F7F7F7",
                borderRadius: "12px",
                border: "none",
                height: "5rem",
              }}
              onChange={handleChange}
            ></textarea>
          </div>

          <div
            className="d-flex justify-content-end gap-3 py-4 px-2"
            style={{ backgroundColor: "#FAFAFA", borderRadius: "0 0 10px 10px" }}
          >
            <button className="btn btn-md rounded-5 py-1 px-3" type="reset">
              Discard
            </button>

            <button
              className="btn btn-md text-white rounded-5"
              style={{ backgroundColor: "#0452C8" }}
              type="submit"
            >
              Create
            </button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default CreateElection;
