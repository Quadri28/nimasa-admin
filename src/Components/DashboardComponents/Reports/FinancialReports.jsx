import { useContext } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { Link, Outlet, useLocation } from "react-router-dom";
import { UserContext } from "../../AuthContext";

const FinancialReports = () => {
  const components = [
    {
      menuName: "Product Summary",
      menuId: "74",
      url: "/admin-dashboard/report/financial-reports",
    },
    {
      menuName: "Fixed Asset Register",
      menuId: "216",
      url: "/admin-dashboard/report/financial-reports/fixed-asset-register",
    },
    {
      menuName: "Trial Balance Current",
      menuId: "204",
      url: "/admin-dashboard/report/financial-reports/trial-balance-current",
    },
    {
      menuName: "Trial Balance by Date",
      menuId: "205",
      url: "/admin-dashboard/report/financial-reports/trial-balance-by-date",
    },
    {
      menuName: "Posting Journal ",
      menuId: "74",
      url: "/admin-dashboard/report/financial-reports/posting-journal",
    },
    {
      menuName: "GL Account Statement",
      menuId: "197",
      url: "/admin-dashboard/report/financial-reports/gl-account-statement",
    },
  ];
  const { pathname } = useLocation();
  const { credentials } = useContext(UserContext);
  const permissions = credentials?.logInfo?.userRolesPermission;
  return (
    <div>
      <ScrollContainer
        vertical={false}
        className="header-links mb-2 scroller"
        style={{ overflow: "scroll" }}
      >
        {components.map((config) => {
          const hasPermission = permissions.some(
            (p) => p.menuId === config.menuId
          );

          const isProductSummary =
            config.url === "/admin-dashboard/report/financial-reports";

          const isActive = isProductSummary
            ? pathname === "/admin-dashboard/report/financial-reports" ||
              pathname.includes("/admin-dashboard/report/financial-reports/details")
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
      {<Outlet />}
    </div>
  );
};

export default FinancialReports;
