import { Link, Outlet } from "react-router-dom";

const Members = () => {

  return (
    <>
      <div className="d-sm-flex justify-content-between align-items-center mb-3">
        <h6> Member Management </h6>
      </div>
      <Outlet/>
    </>
  );
};

export default Members;
