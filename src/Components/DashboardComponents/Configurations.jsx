import React, { useState, useContext, useEffect } from "react";
import "./Configurations.css";
import { UserContext } from "../AuthContext";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import ScrollContainer from "react-indiana-drag-scroll";

const Configurations = () => {
  const configurations = [
    { menuName: "Cooperative settings", menuId: "10", url: "/admin-dashboard/configurations" },
    {
      menuName: "Product settings",
      menuId: "17",
      url: "/admin-dashboard/configurations/product-settings",
    },
    {
      menuName: "Manage bank account",
      menuId: "231",
      url: "/admin-dashboard/configurations/manage-bank-account",
    },
    {
      menuName: "Change password",
      menuId: "39",
      url: "/admin-dashboard/configurations/change-password",
    },
    {
      menuName: "Manage assets",
      menuId: "104",
      url: "/admin-dashboard/configurations/manage-assets",
    },
  ];
  const navigate = useNavigate()
  const { pathname } = useLocation();
  const { credentials } = useContext(UserContext);
  const permissions = credentials?.logInfo?.userRolesPermission;

  useEffect(() => {
  window.scrollTo(0, 0);

  const currentIsIndex = pathname === "/configurations";
  const hasIndexPermission = permissions?.some(
    (p) => p.menuId === "10"
  );

  if (currentIsIndex && !hasIndexPermission) {
    // find the first available tab the user has permission to access
    const firstAllowed = configurations.find((config) =>
      permissions?.some((p) => p.menuId === config.menuId)
    );

     if (firstAllowed && firstAllowed.url !== "/configurations") {
      navigate(firstAllowed.url, { replace: true });
    }
  }
}, [pathname, permissions, navigate]);


  return (
    <>
      <h4 className="fs-5">Configurations</h4>
      <ScrollContainer
        vertical={false}
        className="header-links mb-3 scroller"
        style={{ overflow: "scroll" }}
      >
        {configurations.map((config) => {
          const hasPermission = permissions.some(
            (p) => p.menuId === config.menuId
          );
          const isActive =
            config.url === "/admin-dashboard/configurations"
              ? pathname === "/admin-dashboard/configurations"
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
      <div className="pb-2">
        <Outlet />
      </div>
    </>
  );
};

export default Configurations;
