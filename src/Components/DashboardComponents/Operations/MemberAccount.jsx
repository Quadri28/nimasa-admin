import React, { useContext } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { UserContext } from "../../AuthContext";
import ScrollContainer from "react-indiana-drag-scroll";

const MemberAccount = () => {
  const { pathname } = useLocation();

  const data = [
    {
      menuName: "Account Creation",
      menuId: "36",
      url: "/admin-dashboard/member-management/member-account",
    },
    {
      menuName: "Close Account",
      menuId: "85",
      url: "/admin-dashboard/member-management/member-account/close-account",
    },
    {
      menuName: "Account Reactivation",
      menuId: "111",
      url: "/admin-dashboard/member-management/member-account/account-reactivation",
    },
  ];

  const { credentials } = useContext(UserContext);
  const permissions = credentials?.logInfo?.userRolesPermission;

  return (
    <>
      <ScrollContainer
        vertical={false}
        className="header-links mb-3 scroller"
        style={{ overflow: "scroll" }}
      >
        {data.map((config) => {
          const hasPermission = permissions.some(
            (p) => p.menuId === config.menuId
          );
          const isActive = pathname === config.url;

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
    </>
  );
};

export default MemberAccount;
