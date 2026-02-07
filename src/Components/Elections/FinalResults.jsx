import React, { useContext, useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import axios from "../axios";
import { UserContext } from "../AuthContext";
import "./styles.css";
import crown from "../../assets/crown.png";
const FinalResults = () => {
  const [reports, setReports] = useState([]);
  const [elections, setElections] = useState([]);
  const [id, setId] = useState(null);
  const { credentials } = useContext(UserContext);
  const [active, setActive] = useState(null);

  const getElections = () => {
    axios("Election/get-elections-slim", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => {
      const electionReport = resp.data.data;
      setElections(electionReport);
      if (electionReport.length > 0) {
        setActive(electionReport[0].title);
        setId(electionReport[0].id);
      }
    });
  };
  useEffect(() => {
    getElections();
  }, []);
  const getElectionReport = () => {
    axios(`Election/get-election-report/${id}`, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => {
      setReports(resp.data.data.electionGeneralReport);
    });
  };
  useEffect(() => {
    getElectionReport();
  }, [id]);
  const colors = ["#0452C8", "#1985B3", "#F6911E", "#0F7234"];
  const baseColors = ["#9BC2FD", "#EEF8FD", "#FEF3E6", "#D8EDE0"];
  return (
    <div>
      <div className="d-flex align-items-center gap-4 flex-wrap">
        {elections.map((election, i) => (
          <span
            key={i}
            className={
              election.title === active
                ? "active-selector"
                : "election-selector"
            }
            onClick={() => {
              setActive(election.title);
              setId(election.id);
            }}
          >
            {election.title}
          </span>
        ))}
      </div>
      <p className="my-3" style={{ color: "#333333"}}>
        Showing results for <strong>{active} </strong>({ reports.length} positions)
      </p>
      {reports.map((report) => (
        <div key={report.postion} className="d-flex flex-column gap-3 mb-3">
          <div style={{ border: "solid 1px #fafafa" }} className="rounded-4">
            <div
              className="py-3 px-4 justify-content-between align-items-center d-flex"
              style={{
                backgroundColor: "#f4fAfd",
                borderRadius: "10px 10px 0 0",
              }}
            >
              <h5
                className="mb-3"
                style={{ fontSize: "18px", fontWeight: "500" }}
              >
                {report.postion}
              </h5>
            </div>
            <div className="d-flex flex-column gap-3 mt-3 px-3">
              {report?.votesReport.map((candidate, idx) => (
                <div
                  style={{
                    backgroundColor: candidate?.isWinner
                      ? "#E6F0FF"
                      : "#FAFAFA",
                    borderRadius: "20px",
                    padding: "25px 20px",
                    marginBlock: "1rem",
                  }}
                >
                  {candidate.isWinner && (
                    <div className="mb-4">
                      {" "}
                      <img src={crown} alt="crown-image" />
                      <span style={{fontWeight:'500'}}> Winner of election</span> <img src={crown} alt="crown-image" />
                    </div>
                  )}
                  <div className="d-flex justify-content-between flex-wrap mb-4">
                    <div className="d-flex gap-3">
                      <img
                        src={`data:image/png;base64, ${candidate.contestantProfileImage}`}
                        alt="image"
                        style={{
                          width: "35px",
                          height: "35px",
                          borderRadius: "50%",
                        }}
                      />
                      <div className="d-flex flex-column ">
                        <span>{candidate?.contestantName}</span>
                        <span>{candidate.positionName}</span>
                      </div>
                    </div>
                    <div className="d-flex gap-3">
                      <span>{candidate.votersCount} votes</span>
                      <span>{candidate.percentage}%</span>
                    </div>
                  </div>
                  <ProgressBar
                    completed={candidate.percentage}
                    borderRadius="15px"
                    bgColor={
                      !candidate.isWinner
                        ? "#1985B3"
                        : colors[idx % colors.length]
                    }
                    baseBgColor={
                      !candidate.isWinner
                        ? "#9BC2FD"
                        : baseColors[idx % colors.length]
                    }
                    labelAlignment="center"
                    labelClassName="label"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FinalResults;
