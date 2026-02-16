import React, { useContext, lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardTemplate from "./DashboardTemplate";
import Dashboard from "../../Components/DashboardComponents/Dashboard";
import Configurations from "../../Components/DashboardComponents/Configurations";
import NotFound from "../NotFound";
import CooperativeSignIn from "../../Components/CooperativeSignIn";
import AdminTasks from "../../Components/DashboardComponents/AdminTasks";
import ConfirmAccount from "../../Components/ConfirmAccount";
import MemberManagement from "../../Components/DashboardComponents/Operations/MemberManagement";
import MemberDeduction from "../../Components/DashboardComponents/Operations/MemberDeduction";
import Members from "../../Components/DashboardComponents/Operations/Members";
import ViewLoanProduct from "../../Components/DashboardComponents/ConfigurationsSubComponents/ViewLoanProduct";
import EditLoanProduct from "../../Components/DashboardComponents/ConfigurationsSubComponents/EditLoanProduct";
import ViewAssetCategory from "../../Components/DashboardComponents/ConfigurationsSubComponents/ManageAssetsComponents/ViewAssetCategory";
import EditAssetCategory from "../../Components/DashboardComponents/ConfigurationsSubComponents/ManageAssetsComponents/EditAssetCategory";
import ViewSavings from "../../Components/DashboardComponents/ConfigurationsSubComponents/ViewSavings";
import EditSavings from "../../Components/DashboardComponents/ConfigurationsSubComponents/EditSavings";
import ViewAssetClass from "../../Components/DashboardComponents/ConfigurationsSubComponents/ManageAssetsComponents/ViewAssetClass";
import EditAssetClass from "../../Components/DashboardComponents/ConfigurationsSubComponents/ManageAssetsComponents/EditAssetClass";
import ViewInvestment from "../../Components/DashboardComponents/ConfigurationsSubComponents/ViewInvestment";
import EditInvestment from "../../Components/DashboardComponents/ConfigurationsSubComponents/EditInvestment";
import Communications from "../../Components/DashboardComponents/Communications";
import ManageSMS from "../../Components/DashboardComponents/CommunicationSubComponents/ManageSMS";
import BuySMS from "../../Components/DashboardComponents/CommunicationSubComponents/BuySMS";
import SMSReports from "../../Components/DashboardComponents/CommunicationSubComponents/SMSReports";
import BroadCast from "../../Components/DashboardComponents/CommunicationSubComponents/BroadCast";
import CooperativeSettings from "../../Components/DashboardComponents/ConfigurationsSubComponents/CooperativeSettings";
import ManageBankAccount from "../../Components/DashboardComponents/ConfigurationsSubComponents/ManageBankAccount";
import ChangePassword from "../../Components/DashboardComponents/ConfigurationsSubComponents/ChangePassword";
import ManageAssets from "../../Components/DashboardComponents/ConfigurationsSubComponents/ManageAssets";
import Accounting from "../../Components/DashboardComponents/Operations/Accounting/Accounting";
import BulkUpload from "../../Components/DashboardComponents/Operations/Accounting/BulkUpload";
import Deduction from "../../Components/DashboardComponents/Operations/Accounting/Deduction";
import Withdrawal from "../../Components/DashboardComponents/Operations/Accounting/Withdrawal";
import Deposit from "../../Components/DashboardComponents/Operations/Accounting/Deposit";
import Election from "../../Components/Elections/Election";
import ApplicationApproval from "../../Components/Elections/ApplicationApproval";
import Candidates from "../../Components/Elections/Candidates";
import ElectionReport from "../../Components/Elections/ElectionReport";
import PositionEligibility from "../../Components/Elections/PositionEligibility";
import Elections from "../../Components/Elections/Elections";
import Report from "../../Components/DashboardComponents/Reports/Report";
import LoanReport from "../../Components/DashboardComponents/Reports/LoanReport";
import MemberReport from "../../Components/DashboardComponents/Reports/MemberReport";
import MemberGrowth from "../../Components/DashboardComponents/Reports/MemberGrowth";
import ShareReport from "../../Components/DashboardComponents/Reports/ShareReport";
import Products from "../../Components/DashboardComponents/Reports/Products";
import Request from "../../Components/DashboardComponents/Requests/Request";
import Inventory from "../../Components/DashboardComponents/InventoryManagement/Inventory";
import Vendor from "../../Components/DashboardComponents/InventoryManagement/Vendor";
import Product from "../../Components/DashboardComponents/InventoryManagement/Product";
import Investment from "../../Components/DashboardComponents/Investments/Investment";
import LoanManagement from "../../Components/DashboardComponents/LoanManagement/LoanManagement";
import LoanApplication from "../../Components/DashboardComponents/LoanManagement/LoanApplication";
import BulkLoanCreation from "../../Components/DashboardComponents/LoanManagement/BulkLoanCreation";
import Disbursement from "../../Components/DashboardComponents/LoanManagement/Disbursement";
import Status from "../../Components/DashboardComponents/LoanManagement/Status";
import LoanDesave from "../../Components/DashboardComponents/LoanManagement/LoanDesave";
import PartialDesave from "../../Components/DashboardComponents/LoanManagement/PartialDesave";
import Repayment from "../../Components/DashboardComponents/LoanManagement/Repayment";
import Skipping from "../../Components/DashboardComponents/LoanManagement/Skipping";
import Restructure from "../../Components/DashboardComponents/LoanManagement/Restructure";
import SharesManagement from "../../Components/DashboardComponents/SharesManagement/SharesManagement";
import Configuration from "../../Components/DashboardComponents/SharesManagement/Configuration";
import SharesRegister from "../../Components/DashboardComponents/SharesManagement/SharesRegister";
import SharesReport from "../../Components/DashboardComponents/SharesManagement/SharesReport";
import AddShares from "../../Components/DashboardComponents/SharesManagement/AddShares";
import AddMembers from "../../Components/DashboardComponents/Operations/AddMembers";
import EditMember from "../../Components/DashboardComponents/Operations/EditMember";
import MemberIndex from "../../Components/DashboardComponents/Operations/Member";
import MemberAccount from "../../Components/DashboardComponents/Operations/MemberAccount";
import AccountCreation from "../../Components/DashboardComponents/Operations/AccountCreation";
import CloseAccount from "../../Components/DashboardComponents/Operations/CloseAccount";
import AccountReactivation from "../../Components/DashboardComponents/Operations/AccountReactivation";
import BroadcastMessage from "../../Components/DashboardComponents/CommunicationSubComponents/BroadcastMessage";
import Transfer from "../../Components/DashboardComponents/Operations/Accounting/Transfer";
import LoanSkipping from "../../Components/DashboardComponents/Reports/LoanSkipping";
import LoanDisbursed from "../../Components/DashboardComponents/Reports/LoanDisbursed";
import TransactionReports from "../../Components/DashboardComponents/Reports/TransactionReports";
import LoanRepayment from "../../Components/DashboardComponents/Reports/LoanRepayment";
import LoanMemberBalance from "../../Components/DashboardComponents/Reports/LoanMemberBalance";
import LoanReports from "../../Components/DashboardComponents/Reports/LoanReports";
import MemberReports from "../../Components/DashboardComponents/Reports/MemberReports";
import NewMember from "../../Components/DashboardComponents/Reports/NewMember";
import UserReports from "../../Components/DashboardComponents/Reports/UserReports";
import StatutoryReports from "../../Components/DashboardComponents/Reports/StatutoryReports";
import LoanRepaymentDue from "../../Components/DashboardComponents/Reports/LoanRepaymentDue";
import GeneralMemberBalance from "../../Components/DashboardComponents/Reports/GeneralMemberBalance";
import MemberRequestReport from "../../Components/DashboardComponents/Reports/MemberRequestReport";
import MemberBalanceByDate from "../../Components/DashboardComponents/Reports/MemberBalanceByDate";
import MemberLedger from "../../Components/DashboardComponents/Reports/MemberLedger";
import FinancialReports from "../../Components/DashboardComponents/Reports/FinancialReports";
import PostingJournal from "../../Components/DashboardComponents/Reports/PostingJournal";
import FixedAssetRegister from "../../Components/DashboardComponents/Reports/FixedAssetRegister";
import TrialBalanceByDate from "../../Components/DashboardComponents/Reports/TrialBalanceByDate";
import TrialBalanceCurrent from "../../Components/DashboardComponents/Reports/TrialBalanceCurrent";
import FinancialDetail from "../../Components/DashboardComponents/Reports/FinancialDetail";
import TransactionDetail from "../../Components/DashboardComponents/Reports/TransactionDetail";
import TenantReport from "../../Components/DashboardComponents/Reports/TenantReport";
import ItemRequest from "../../Components/DashboardComponents/Requests/ItemRequest";
import SMSRequests from "../../Components/DashboardComponents/Requests/SMSRequests";
import DepositRequest from "../../Components/DashboardComponents/Requests/DepositRequest";
import LoanRepaymentRequest from "../../Components/DashboardComponents/Requests/LoanRepaymentRequest";
import SavingAccountRequest from "../../Components/DashboardComponents/Requests/SavingAccountRequest";
import WithdrawalRequest from "../../Components/DashboardComponents/Requests/WithdrawalRequest";
import RegistrationRequest from "../../Components/DashboardComponents/Requests/RegistrationRequest";
import RescheduleSaving from "../../Components/DashboardComponents/Requests/RescheduleSaving";
import LoanRequest from "../../Components/DashboardComponents/Requests/LoanRequest";
import RetirementRequestPosting from "../../Components/DashboardComponents/Requests/RetirementRequestPosting";
import ServicesRequest from "../../Components/DashboardComponents/Requests/ServicesRequest";
import AccountManagementRequest from "../../Components/DashboardComponents/Requests/AccountManagementRequest";
import FinancialRequest from "../../Components/DashboardComponents/Requests/FinancialRequest";
import RetirementRequest from "../../Components/DashboardComponents/Requests/RetirementRequest";
import Retirement from "../../Components/DashboardComponents/Requests/Retirement";
import RegisterItem from "../../Components/DashboardComponents/InventoryManagement/RegisterItem";
import ViewLoanApplications from "../../Components/DashboardComponents/LoanManagement/ViewLoanApplications";
import ViewApplication from "../../Components/DashboardComponents/LoanManagement/ViewApplication";
import DisburseLoanRequest from "../../Components/DashboardComponents/Requests/DisburseLoanRequest";
import ManageUsers from "../../Components/DashboardComponents/AdminTasksSubComponents/ManageUsers";
import ManageRoles from "../../Components/DashboardComponents/AdminTasksSubComponents/ManageRoles";
import ManageGLAccount from "../../Components/DashboardComponents/AdminTasksSubComponents/ManageGLAccount";
import OutstandingSubscription from "../../Components/DashboardComponents/AdminTasksSubComponents/OutstandingSubscription";
import MapStatutory from "../../Components/DashboardComponents/AdminTasksSubComponents/MapStatutory";
import FinancialYearClosure from "../../Components/DashboardComponents/AdminTasksSubComponents/FinancialYearClosure";
import SettlementAccount from "../../Components/DashboardComponents/AdminTasksSubComponents/SettlementAccount";
import ResetUser from "../../Components/DashboardComponents/AdminTasksSubComponents/ResetUser";
import EditUser from "../../Components/DashboardComponents/AdminTasksSubComponents/EditUser";
import ResetPassword from "../../Components/ResetPassword";
import AddSettlementAccount from "../../Components/DashboardComponents/AdminTasksSubComponents/AddSettlementAccount";
import SettlementAccountIndex from "../../Components/DashboardComponents/AdminTasksSubComponents/SettlementAccountIndex";
import AddNewRole from "../../Components/DashboardComponents/AdminTasksSubComponents/AddNewRole";
import ManageRoleIndex from "../../Components/DashboardComponents/AdminTasksSubComponents/ManageRoleIndex";
import EditRole from "../../Components/DashboardComponents/AdminTasksSubComponents/EditRole";
import PaymentDetails from "../../Components/DashboardComponents/AdminTasksSubComponents/PaymentDetails";
import OutstandingIndex from "../../Components/DashboardComponents/AdminTasksSubComponents/OutstandingIndex";
import AddInvestment from "../../Components/DashboardComponents/Investments/AddInvestment";
import Investments from "../../Components/DashboardComponents/Investments/Investments";
import AddLiquidation from "../../Components/DashboardComponents/Investments/AddLiquidation";
import InvestmentPartialPay from "../../Components/DashboardComponents/Investments/InvestmentPartialPay";
import InvestmentReport from "../../Components/DashboardComponents/Investments/InvestmentReport";
import InvestmentStatus from "../../Components/DashboardComponents/Investments/InvestmentStatus";
import AddNewGlAccount from "../../Components/DashboardComponents/AdminTasksSubComponents/AddNewGlAccount";
import AddNewShareType from "../../Components/DashboardComponents/SharesManagement/AddNewShare";
import UpdateShareType from "../../Components/DashboardComponents/SharesManagement/UpdateShareType";
import EditElection from "../../Components/Elections/EditElection";
import ViewElection from "../../Components/Elections/ViewElection";
import CreateElection from "../../Components/Elections/CreateElection";
import AddContestant from "../../Components/Elections/AddContestant";
import UpdateCandidate from "../../Components/Elections/UpdateCandidate";
import CandidateIndex from "../../Components/Elections/CandidateIndex";
import IdleTimer from "../../Components/IdleTimer";
import { RequiredAuth } from "../../Components/RequiredAuth";
import AgreementFile from "../../Components/CooperativeRegForms/AgreementFile";
import VerificationPayment from "../../Components/VerificationPayment";
import RegCallbackVerification from "../../Components/RegCallbackVerification";
import ProductSetting from "../../Components/DashboardComponents/ConfigurationsSubComponents/ProductSettingComponent/ProductSetting";
import Savings from "../../Components/DashboardComponents/ConfigurationsSubComponents/ProductSettingComponent/Savings";
import Loan from "../../Components/DashboardComponents/ConfigurationsSubComponents/ProductSettingComponent/Loan";
import InvestmentProduct from "../../Components/DashboardComponents/ConfigurationsSubComponents/ProductSettingComponent/InvestmentProduct";
import AddNewSavings from "../../Components/DashboardComponents/ConfigurationsSubComponents/ProductSettingComponent/AddNewSavings";
import LoanIndex from "../../Components/DashboardComponents/ConfigurationsSubComponents/ProductSettingComponent/LoanIndex";
import AddNewLoan from "../../Components/DashboardComponents/ConfigurationsSubComponents/ProductSettingComponent/AddNewLoan";
import InvestmentIndex from "../../Components/DashboardComponents/ConfigurationsSubComponents/ProductSettingComponent/InvestmentIndex";
import AddNewInvestment from "../../Components/DashboardComponents/ConfigurationsSubComponents/ProductSettingComponent/AddNewInvestment";
import ManageAssetCategory from "../../Components/DashboardComponents/ConfigurationsSubComponents/ManageAssetsComponents/ManageAssetCategory";
import ManageAssetClass from "../../Components/DashboardComponents/ConfigurationsSubComponents/ManageAssetsComponents/ManageAssetClass";
import ManageAssetClassIndex from "../../Components/DashboardComponents/ConfigurationsSubComponents/ManageAssetsComponents/ManageAssetClassIndex";
import ManageDisposalAssets from "../../Components/DashboardComponents/ConfigurationsSubComponents/ManageAssetsComponents/ManageDisposalAssets";
import AddAssetCategory from "../../Components/DashboardComponents/ConfigurationsSubComponents/ManageAssetsComponents/AddAssetCategory";
import AddAssetClass from "../../Components/DashboardComponents/ConfigurationsSubComponents/ManageAssetsComponents/AddAssetClass";
import EditCorporateMember from "../../Components/DashboardComponents/Operations/EditCorporateMember";
import OutStandingSubPaymentConfrm from "../../Components/DashboardComponents/AdminTasksSubComponents/OutStandingSubPaymentConfrm";
import EditGLAccount from "../../Components/DashboardComponents/AdminTasksSubComponents/EditGLAccount";
import Notifications from "../../Components/Notifications";
import WithdrawShares from "../../Components/DashboardComponents/SharesManagement/WithdrawShares";
import SharesRequest from "../../Components/DashboardComponents/Requests/SharesRequest";
import SupportIndex from "../../Components/DashboardComponents/Support/SupportIndex";
import ContactUs from "../../Components/DashboardComponents/Support/ContactUs";
import EmailSupport from "../../Components/DashboardComponents/Support/EmailSupport";
import SupportFaqs from "../../Components/DashboardComponents/Support/Faqs";
import RequestReport from "../../Components/DashboardComponents/Reports/RequestReports/RequestReport";
import AppRegistration from "../../Components/DashboardComponents/Reports/RequestReports/AppRegistration";
import AppReschedule from "../../Components/DashboardComponents/Reports/RequestReports/AppReschedule";
import AppDeposit from "../../Components/DashboardComponents/Reports/RequestReports/AppDeposit";
import AppWithdrawal from "../../Components/DashboardComponents/Reports/RequestReports/AppWithdrawal";
import AppItemRequest from "../../Components/DashboardComponents/Reports/RequestReports/AppItemRequest";
import DeductionUpload from "../../Components/DashboardComponents/Reports/DeductionUploadReports/DeductionUpload";
import ViewDeduction from "../../Components/DashboardComponents/Reports/DeductionUploadReports/ViewDeduction";
import DeductionUploadIndex from "../../Components/DashboardComponents/Reports/DeductionUploadReports/DeductionUploadIndex";
import AppLoanRepaymentRequest from "../../Components/DashboardComponents/Reports/RequestReports/AppLoanRepaymentRequest";
import AppLoanRequest from "../../Components/DashboardComponents/Reports/RequestReports/AppLoanRequest";
import { UserContext } from "../../Components/AuthContext";
import LoanRestructure from "../../Components/DashboardComponents/LoanManagement/LoanRestructure";
import PrivacyPolicy from "../PrivacyPolicy";
import GLAccountStatement from "../../Components/DashboardComponents/Reports/GLAccountStatement";
import SubscriptionRenewal from "../../Components/SubscriptionRenewal";
import BulkLoginAccess from "../../Components/DashboardComponents/Operations/BulkLoginAccess";
import MemberContributionHistory from "../../Components/DashboardComponents/Reports/MemberContributionHistory";
import MemberContributionDetails from "../../Components/DashboardComponents/Reports/MemberContributionDetails";
import Signatory from "../../Components/DashboardComponents/Operations/Signatory";
import CookieConsentModal from "../../Components/DashboardComponents/CookieModal";
import AdminResetPassword from "../../Components/AdminResetPassword";
import AddNewUser from "../../Components/DashboardComponents/AdminTasksSubComponents/AddNewUser";
import AdminLogin from "../../Components/AdminLogin";
import GlobalAdminTemplate from "./GlobalAdminTemplate";
import GeneralOverview from "../../Components/GlobalAdminComponents/GeneralOverview/GeneralOverview";
import ExpiredSubscriptions from "../../Components/GlobalAdminComponents/GeneralOverview/ExpiredSubscriptions";
import OutstandingSubscriptions from "../../Components/GlobalAdminComponents/GeneralOverview/OutstandingSubscriptions";
import ExpiringSoon from "../../Components/GlobalAdminComponents/GeneralOverview/ExpiringSoon";
import Setup from "../../Components/GlobalAdminComponents/Setup/Setup";
import ManageCooperative from "../../Components/GlobalAdminComponents/Setup/ManageCooperative";
import ManageBank from "../../Components/GlobalAdminComponents/Setup/ManageBank";
import GlobalAdminTasks from "../../Components/GlobalAdminComponents/GlobalAdminTasks/GlobalAdminTasks";
import OperationLockStatus from "../../Components/GlobalAdminComponents/GlobalAdminTasks/OperationLockStatus";
import CooperativeApprovalIndex from "../../Components/GlobalAdminComponents/GlobalAdminTasks/CooperativeApprovalIndex";
import CooperativeApproval from "../../Components/GlobalAdminComponents/GlobalAdminTasks/CooperativeApproval";
import ViewRequest from "../../Components/GlobalAdminComponents/GlobalAdminTasks/ViewRequest";
import GlobalUserReset from "../../Components/GlobalAdminComponents/GlobalAdminTasks/GlobalUserReset";
import GlobalRoleConfigIndex from "../../Components/GlobalAdminComponents/GlobalAdminTasks/GlobalRoleConfigIndex";
import GlobalRoleConfig from "../../Components/GlobalAdminComponents/GlobalAdminTasks/GlobalRoleConfig";
import EditGlobalRole from "../../Components/GlobalAdminComponents/GlobalAdminTasks/EditGlobalRole";
import AddNewTenant from "../../Components/GlobalAdminComponents/GlobalAdminTasks/AddNewTenant";
import ManageTenant from "../../Components/GlobalAdminComponents/GlobalAdminTasks/ManageTenant";
import CoopSubInfo from "../../Components/GlobalAdminComponents/GlobalAdminTasks/CoopSubInfo";
import PostCoopSettlement from "../../Components/GlobalAdminComponents/GlobalAdminTasks/PostCoopSettlement";
import GlobalReports from "../../Components/GlobalAdminComponents/GlobalReports";
import LoginStatus from "../../Components/GlobalAdminComponents/GlobalAdminTasks/LoginStatus";
import Supports from "../../Components/GlobalAdminComponents/Support/Supports";
import Support from "../../Components/GlobalAdminComponents/Support/Support";
import CreateFaqs from "../../Components/GlobalAdminComponents/Support/CreateFaqs";
import EditFaqs from "../../Components/GlobalAdminComponents/Support/EditFaq";
import FaqSections from "../../Components/GlobalAdminComponents/Support/FaqSections";
import FaqSection from "../../Components/GlobalAdminComponents/Support/FaqSection";
import CreateFaqSection from "../../Components/GlobalAdminComponents/Support/CreateFaqSection";
import EditFaqSection from "../../Components/GlobalAdminComponents/Support/EditFaqSection";

const Layout = () => {
  const { credentials } = useContext(UserContext);
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowConsent(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setShowConsent(false);
  };
  return (
    <>
      {credentials?.token && <IdleTimer />}
      <Suspense fallback={<div>Loading page...</div>}>
        {showConsent && (
          <CookieConsentModal onAccept={handleAccept} onReject={handleReject} />
        )}
        <Routes>
          <Route path="/" element={<CooperativeSignIn />} />
          <Route path="/global-admin-signin" element={<AdminLogin />} />
          <Route
            path="/subscription-renewal"
            element={<SubscriptionRenewal />}
          />
          <Route
            path="/admin-reset-password"
            element={<AdminResetPassword />}
          />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/agreement" element={<AgreementFile />} />
          <Route
            path="/verification-payment"
            element={<VerificationPayment />}
          />
          <Route
            path="/registration-verification"
            element={<RegCallbackVerification />}
          />
          <Route
            path="/outstanding-subscription-confirmation"
            element={<OutStandingSubPaymentConfrm />}
          />

          {/* Dashboard Pages */}
          <Route
            path="/admin-dashboard"
            element={
              <RequiredAuth>
                <DashboardTemplate />{" "}
              </RequiredAuth>
            }
          >
            <Route index element={<Dashboard />} />
            {/* Configurations */}
            <Route path="configurations" element={<Configurations />}>
              <Route index element={<CooperativeSettings />} />
              <Route
                path="cooperative-settings"
                element={<CooperativeSettings />}
              />
              <Route
                path="manage-bank-account"
                element={<ManageBankAccount />}
              />
              <Route path="change-password" element={<ChangePassword />} />
              {/* Product Settings */}
              <Route path="product-settings" element={<ProductSetting />}>
                {/* Savings Product */}
                <Route index element={<Savings />} />
                <Route
                  path="view-savings/:savingCode"
                  element={<ViewSavings />}
                />
                <Route
                  path="edit-savings/:savingCode"
                  element={<EditSavings />}
                />
                <Route path="add-new-saving" element={<AddNewSavings />} />
                {/* Loan Product */}
                <Route path="loan" element={<LoanIndex />}>
                  <Route index element={<Loan />} />
                  <Route path="add-new-loan" element={<AddNewLoan />} />
                  <Route
                    path="view-loan/:productCode"
                    element={<ViewLoanProduct />}
                  />
                  <Route
                    path="edit-loan/:productCode"
                    element={<EditLoanProduct />}
                  />
                </Route>
                {/* Investment Product */}
                <Route path="investments" element={<InvestmentIndex />}>
                  <Route index element={<InvestmentProduct />} />
                  <Route
                    path="add-new-investment"
                    element={<AddNewInvestment />}
                  />
                  <Route
                    path="view-investment/:id"
                    element={<ViewInvestment />}
                  />
                  <Route
                    path="edit-investment/:id"
                    element={<EditInvestment />}
                  />
                </Route>
              </Route>
              {/* Assets Management */}
              <Route path="manage-assets" element={<ManageAssets />}>
                <Route index element={<ManageAssetCategory />} />
                <Route
                  path="view-asset-category/:id"
                  element={<ViewAssetCategory />}
                />
                <Route
                  path="edit-asset-category/:id"
                  element={<EditAssetCategory />}
                />
                <Route
                  path="add-asset-category"
                  element={<AddAssetCategory />}
                />
                <Route
                  path="manage-asset-class"
                  element={<ManageAssetClassIndex />}
                >
                  <Route index element={<ManageAssetClass />} />
                  <Route path="add-asset-class" element={<AddAssetClass />} />
                  <Route
                    path="view-asset-class/:id"
                    element={<ViewAssetClass />}
                  />
                  <Route
                    path="edit-asset-class/:id"
                    element={<EditAssetClass />}
                  />
                </Route>
                <Route
                  path="manage-asset-disposal"
                  element={<ManageDisposalAssets />}
                />
              </Route>
            </Route>

            {/* Communication Components */}
            <Route path="communications" element={<Communications />}>
              <Route index element={<BroadCast />} />
              <Route path="manage-sms" element={<ManageSMS />} />
              <Route path="buy-sms" element={<BuySMS />} />
              <Route path="sms-reports" element={<SMSReports />} />
              <Route path="broadcast" element={<BroadCast />} />
              <Route path="broadcast-message" element={<BroadcastMessage />} />
            </Route>
            {/* Accounting Components */}
            <Route path="accounting" element={<Accounting />}>
              <Route index element={<BulkUpload />} />
              <Route path="bulk-upload" element={<BulkUpload />} />
              <Route path="deduction-upload" element={<Deduction />} />
              <Route path="withdrawal" element={<Withdrawal />} />
              <Route path="deposit" element={<Deposit />} />
              <Route path="transfer" element={<Transfer />} />
            </Route>
            {/* Election Components */}
            <Route path="elections" element={<Elections />}>
              <Route index element={<Election />} />
              <Route path="approval" element={<ApplicationApproval />} />
              <Route path="candidates" element={<CandidateIndex />}>
                <Route index element={<Candidates />} />
                <Route
                  path="update-candidate/:id"
                  element={<UpdateCandidate />}
                />
              </Route>
              <Route path="election-reports" element={<ElectionReport />} />
              <Route path="edit-election/:id" element={<EditElection />} />
              <Route path="view-election/:id" element={<ViewElection />} />
              <Route path="create-election/" element={<CreateElection />} />
              <Route path="edit-election/:id" element={<EditElection />} />
              <Route path="add-contestant/:id" element={<AddContestant />} />
              <Route
                path="positions-eligibility"
                element={<PositionEligibility />}
              />
            </Route>
            {/* Admin Tasks Components */}
            <Route path="admin-tasks" element={<AdminTasks />}>
              <Route index element={<ManageGLAccount />} />
              <Route path="manage-users" element={<ManageUsers />} />
              <Route path="add-gl-account" element={<AddNewGlAccount />} />
              <Route path="edit-gl-account/:id" element={<EditGLAccount />} />
              <Route
                path="manage-users/reset-user/:id"
                element={<ResetUser />}
              />
              <Route path="manage-users/add-user" element={<AddNewUser />} />
              <Route path="manage-users/edit-user/:id" element={<EditUser />} />
              <Route path="manage-roles" element={<ManageRoles />}>
                <Route index element={<ManageRoleIndex />} />
                <Route path="add-new-role" element={<AddNewRole />} />
                <Route path="edit-role/:id" element={<EditRole />} />
              </Route>
              <Route
                path="manage-gl-account"
                element={<ManageGLAccount />}
              ></Route>
              <Route
                path="outstanding-subscription"
                element={<OutstandingIndex />}
              >
                <Route index element={<OutstandingSubscription />} />
                <Route path="payment-details" element={<PaymentDetails />} />
              </Route>
              <Route path="map-statutory" element={<MapStatutory />} />
              <Route
                path="financial-year-closure"
                element={<FinancialYearClosure />}
              />
              <Route path="settlement-account" element={<SettlementAccount />}>
                <Route index element={<SettlementAccountIndex />} />
                <Route
                  path="add-settlement-account"
                  element={<AddSettlementAccount />}
                />
              </Route>
              {/* <Route path="manage-status" element={<ManageStatus />} />
              <Route path="global-user-setting" element={<GlobalUserSetting />}/>
              <Route  path="subscription-info" element={<CooperationSubscriptionInfo />}/> */}
            </Route>

            {/* Member Management */}
            <Route path="member-management" element={<MemberManagement />}>
              <Route path="member-deduction" element={<MemberDeduction />} />
              <Route path="member-account" element={<MemberAccount />}>
                <Route index element={<AccountCreation />} />
                <Route path="close-account" element={<CloseAccount />} />
                <Route
                  path="account-reactivation"
                  element={<AccountReactivation />}
                />
              </Route>
              <Route path="" element={<Members />}>
                <Route index element={<MemberIndex />} />
                <Route path="add-members" element={<AddMembers />} />
                <Route path="bulk-login-access" element={<BulkLoginAccess />} />
                <Route path="edit-member/:id" element={<EditMember />} />
                <Route
                  path="edit-corporate-member/:id"
                  element={<EditCorporateMember />}
                />
                <Route path="signatory/:id" element={<Signatory />} />
              </Route>
            </Route>

            {/* Reports Components */}
            <Route path="report" element={<Report />}>
              <Route index element={<TransactionReports />} />
              <Route path="financial-reports" element={<FinancialReports />}>
                <Route index element={<Products />} />
                <Route path="posting-journal" element={<PostingJournal />} />
                <Route
                  path="fixed-asset-register"
                  element={<FixedAssetRegister />}
                />
                <Route
                  path="gl-account-statement"
                  element={<GLAccountStatement />}
                />

                <Route
                  path="trial-balance-by-date"
                  element={<TrialBalanceByDate />}
                />
                <Route
                  path="trial-balance-current"
                  element={<TrialBalanceCurrent />}
                />
                <Route path="details/:id" element={<FinancialDetail />} />
              </Route>
              <Route path="transaction/:id" element={<TransactionDetail />} />
              <Route path="loan-report" element={<LoanReports />}>
                <Route index element={<LoanReport />} />
                <Route path="loan-skipping" element={<LoanSkipping />} />
                <Route path="disbursed-loan" element={<LoanDisbursed />} />
                <Route
                  path="loan-member-balance"
                  element={<LoanMemberBalance />}
                />
                <Route path="loan-repayment-paid" element={<LoanRepayment />} />
                <Route
                  path="loan-repayment-due"
                  element={<LoanRepaymentDue />}
                />
              </Route>
              <Route path="member-report" element={<MemberReports />}>
                <Route index element={<MemberReport />} />
                <Route path="new-member" element={<NewMember />} />
                <Route
                  path="member-request"
                  element={<MemberRequestReport />}
                />
                <Route
                  path="member-balance-by-date"
                  element={<MemberBalanceByDate />}
                />
                <Route path="member-growth" element={<MemberGrowth />} />
                <Route path="member-ledger" element={<MemberLedger />} />
                <Route
                  path="general-member-balance"
                  element={<GeneralMemberBalance />}
                />
                <Route
                  path="contribution-history"
                  element={<MemberContributionHistory />}
                />
                <Route
                  path="contribution-history/:id"
                  element={<MemberContributionDetails />}
                />
              </Route>
              <Route path="request-reports" element={<RequestReport />}>
                <Route index element={<AppDeposit />} />
                <Route path="app-registration" element={<AppRegistration />} />
                <Route path="app-reschedule" element={<AppReschedule />} />
                <Route path="app-withdrawal" element={<AppWithdrawal />} />
                <Route path="app-item-request" element={<AppItemRequest />} />
                <Route
                  path="app-loan-repayment-request"
                  element={<AppLoanRepaymentRequest />}
                />
                <Route path="app-loan-request" element={<AppLoanRequest />} />
              </Route>
              <Route
                path="deduction-upload-reports"
                element={<DeductionUploadIndex />}
              >
                <Route index element={<DeductionUpload />} />
                <Route
                  path="view-deduction-upload/:id"
                  element={<ViewDeduction />}
                />
              </Route>
              <Route path="user-reports" element={<UserReports />} />
              <Route path="statutory-reports" element={<StatutoryReports />} />
              <Route path="tenant-reports" element={<TenantReport />} />
              <Route path="share-report" element={<ShareReport />} />
            </Route>
            {/* Request Components */}
            <Route path="request" element={<Request />}>
              <Route path="" element={<ServicesRequest />}>
                <Route index element={<ItemRequest />} />
                <Route path="sms-request" element={<SMSRequests />} />
              </Route>
              <Route
                path="account-management"
                element={<AccountManagementRequest />}
              >
                <Route index element={<RegistrationRequest />} />
                <Route
                  path="saving-account-request"
                  element={<SavingAccountRequest />}
                />
                <Route
                  path="reschedule-saving-request"
                  element={<RescheduleSaving />}
                />
              </Route>
              <Route path="financial-request" element={<FinancialRequest />}>
                <Route index element={<DepositRequest />} />
                <Route
                  path="loan-repayment-request"
                  element={<LoanRepaymentRequest />}
                />
                <Route path="loan-request" element={<LoanRequest />} />
                <Route
                  path="loan-request/:id"
                  element={<DisburseLoanRequest />}
                />
                <Route
                  path="withdrawal-request"
                  element={<WithdrawalRequest />}
                />
                <Route path="shares-request" element={<SharesRequest />} />
              </Route>
              <Route path="retirement-requests" element={<Retirement />}>
                <Route index element={<RetirementRequest />} />
                <Route
                  path="retirement-request-posting"
                  element={<RetirementRequestPosting />}
                />
              </Route>
            </Route>
            {/* Inventory Management */}
            <Route path="inventory-management" element={<Inventory />}>
              <Route index element={<Product />} />
              <Route path="vendor" element={<Vendor />} />
              <Route path="register-item" element={<RegisterItem />} />
            </Route>
            {/* Loan mananagement Components */}
            <Route path="loan-management" element={<LoanManagement />}>
              <Route index element={<LoanApplication />} />
              <Route
                path="view-loan-application"
                element={<ViewLoanApplications />}
              />
              <Route
                path="loan-management/view-loan-application/view-application/:id"
                element={<ViewApplication />}
              />
              <Route path="bulk-loan" element={<BulkLoanCreation />} />
              <Route path="disbursement" element={<Disbursement />} />
              <Route path="status" element={<Status />} />
              <Route path="loan-desave" element={<LoanDesave />} />
              <Route path="top-up" element={<Restructure />} />
              <Route path="repayment" element={<Repayment />} />
              <Route path="skipping" element={<Skipping />} />
              <Route path="partial-desave" element={<PartialDesave />} />
              <Route path="restructure" element={<LoanRestructure />} />
            </Route>

            {/* Investment */}
            <Route path="investments" element={<Investments />}>
              <Route index element={<Investment />} />
              <Route path="add-investment" element={<AddInvestment />} />
              <Route path="liquidate-investment" element={<AddLiquidation />} />
              <Route path="partial-pay" element={<InvestmentPartialPay />} />
              <Route path="investment-report" element={<InvestmentReport />} />
              <Route path="investment-status" element={<InvestmentStatus />} />
            </Route>

            {/* Shares Management */}
            <Route path="shares-management" element={<SharesManagement />}>
              <Route index element={<Configuration />} />
              <Route path="add-new-type" element={<AddNewShareType />} />
              <Route path="update-share/:id" element={<UpdateShareType />} />
              <Route path="shares-register" element={<SharesRegister />}>
                <Route index element={<AddShares />} />
                <Route path="withdraw-shares" element={<WithdrawShares />} />
              </Route>
              <Route path="shares-report" element={<SharesReport />} />
            </Route>
            {/* Support */}
            <Route path="support" element={<SupportIndex />}>
              <Route index element={<ContactUs />} />
              <Route path="faqs" element={<SupportFaqs />} />
              <Route path="email-support" element={<EmailSupport />} />
            </Route>
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* Global Admin Dashboard */}

          <Route
            path="/global-admin-dashboard"
            element={<GlobalAdminTemplate />}
          >
            <Route index element={<GeneralOverview />} />
            <Route
              path="expired-subscriptions"
              element={<ExpiredSubscriptions />}
            />
            <Route
              path="outstanding-subscriptions"
              element={<OutstandingSubscriptions />}
            />
            <Route path="expiring-soon" element={<ExpiringSoon />} />
            <Route path="set-up" element={<Setup />}>
              <Route index element={<ManageCooperative />} />
              <Route path="manage-bank-account" element={<ManageBank />} />
            </Route>
            <Route path="admin-tasks" element={<GlobalAdminTasks />}>
              <Route index element={<ManageUsers />} />
              <Route
                path="operation-lock-status"
                element={<OperationLockStatus />}
              />
              <Route path="manage-roles" element={<ManageRoleIndex />} />
              <Route path="add-user" element={<AddNewUser />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route
                path="cooperative-approval"
                element={<CooperativeApprovalIndex />}
              >
                <Route index element={<CooperativeApproval />} />
                <Route path="view-request/:id" element={<ViewRequest />} />
              </Route>
              <Route path="global-user-reset" element={<GlobalUserReset />} />

              <Route
                path="global-role-configuration"
                element={<GlobalRoleConfigIndex />}
              >
                <Route index element={<GlobalRoleConfig />} />
                <Route path="edit-role/:id" element={<EditGlobalRole />} />
                <Route path="add-new-tenant" element={<AddNewTenant />} />
              </Route>

              <Route path="manage-tenants" element={<ManageTenant />} />
              <Route
                path="cooperative-subscription-info"
                element={<CoopSubInfo />}
              />
              <Route
                path="post-coop-settlement"
                element={<PostCoopSettlement />}
              />
              <Route path="reset-user/:id" element={<ResetUser />} />
              <Route
                path="/global-admin-dashboard/admin-tasks/manage-roles/add-new-role"
                element={<AddNewRole />}
              />
              <Route
                path="/global-admin-dashboard/admin-tasks/manage-roles/edit-role/:id"
                element={<EditRole />}
              />
              <Route path="edit-user/:id" element={<EditUser />} />
              <Route
                path="outstanding-subscription"
                element={<OutstandingSubscription />}
              />
            </Route>
            <Route path="reports" element={<GlobalReports />}>
              <Route index element={<TenantReport />} />
              <Route path="user-details" element={<UserReports />} />
              <Route path="login-status" element={<LoginStatus />} />
            </Route>
            <Route path="support" element={<Supports />}>
              <Route index element={<Support />} />
              <Route path="create-faqs" element={<CreateFaqs />} />
              <Route path="edit-faq/:id" element={<EditFaqs />} />
              <Route path="faq-section" element={<FaqSections />}>
                <Route index element={<FaqSection />} />
                <Route
                  path="create-faq-section"
                  element={<CreateFaqSection />}
                />
                <Route
                  path="edit-faq-section/:id"
                  element={<EditFaqSection />}
                />
              </Route>
              <Route path="edit-faqs" element={<EditFaqs />} />
            </Route>
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default Layout;
