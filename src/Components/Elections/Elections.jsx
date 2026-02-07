import React, { useContext, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./Elections.css";
import ScrollContainer from "react-indiana-drag-scroll";
import { UserContext } from "../AuthContext";

const Elections = () => {
  const location = useLocation();
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  const { pathname } = useLocation();
  const { credentials } = useContext(UserContext);
  const permissions = credentials?.logInfo?.userRolesPermission;

  const elections = [
    { menuName: "Election", menuId: "400", url: "/admin-dashboard/elections" },
    {
      menuName: "Position Setup",
      menuId: "402",
      url: "/admin-dashboard/elections/positions-eligibility",
    },
    {
      menuName: "Application Approval",
      menuId: "405",
      url: "/admin-dashboard/elections/approval",
    },
    { menuName: "Candidates", menuId: "402", url: "/admin-dashboard/elections/candidates" },
    {
      menuName: "Election Reports",
      menuId: "406",
      url: "/admin-dashboard/elections/election-reports",
    },
  ];
  return (
    <div>
      <h4 className="fs-5">Election</h4>
      <ScrollContainer
        vertical={false}
        className="header-links mb-3 scroller"
        style={{ overflow: "scroll" }}
      >
        {elections.map((config) => {
          const hasPermission = permissions.some(
            (p) => p.menuId === config.menuId
          );
          const isActive =
            config.url === "/admin-dashboard/elections"
              ? pathname === "/admin-dashboard/elections" || pathname.startsWith('/admin-dashboard/elections/edit-election')
              : pathname.startsWith(config.url);

          return hasPermission ? (
            <Link
              to={config.url}
              key={config.menuId}
              className={isActive ? "active-selector" : ""}
            >
              {config.menuName}
            </Link>
          ) : null;
        })}
      </ScrollContainer>
      <Outlet />
    </div>
  );
};

export default Elections;
