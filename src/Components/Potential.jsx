import React, { Suspense, useEffect, useState } from "react";
import "./Potential.css";
import iPhone from "../assets/Email.png";
import flowAdmin from "../assets/ucp-admin.png";
import Design from "../assets/Tablet.png";
import { Link } from "react-router-dom";
import FeatureOne from "./FeatureOne";
import FeatureTwo from "./FeatureTwo";
import FeatureThree from "./FeatureThree";
import FeatureFour from "./FeatureFour";
import FeatureFive from "./FeatureFive";
import FeatureSix from "./FeatureSix";
import status from "../assets/status-up.png";
import share from "../assets/share.png";
import receipt from "../assets/receipt-item.png";
import discount from "../assets/receipt-discount.png";
import wallet from "../assets/wallet.png";
import element from "../assets/element-plus.png";
import Google from "../assets/GooglePlay.png";
import appleLogo from "../assets/appleLogo.png";
import mobile from "../assets/Email.png";
import member from "../assets/member-rep.png";

const Potential = () => {
  const [feature, setFeature] = useState(0);

  const features = [
    <FeatureOne />,
    <FeatureTwo />,
    <FeatureThree />,
    <FeatureFour />,
    <FeatureFive />,
    <FeatureSix />,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFeature((prevIndex) => (prevIndex + 1) % features.length);
    }, 5000); // 5 seconds

    return () => clearInterval(interval); // clean up on unmount
  }, []);

  const getPictures = () => {
    switch (feature) {
      case 0:
        return <FeatureOne />;
      case 1:
        return <FeatureTwo />;
      case 2:
        return <FeatureThree />;
      case 3:
        return <FeatureFour />;
      case 4:
        return <FeatureFive />;
      case 5:
        return <FeatureSix />;
    }
  };

  const getTexts = () => {
    switch (feature) {
      case 0:
        return (
          <div className="my-4 card border-0 py-3 rounded-4">
            <h4>
              {" "}
              <img src={discount} alt="" />
              Accounting
            </h4>
            <p className="mt-3">
              Streamline your finances with our accounting tools, designed to
              help you manage and track your income, expenses, and financial
              transactions effortlessly.
            </p>
          </div>
        );
      case 1:
        return (
          <div className="mt-4 card border-0 py-3 rounded-4">
            <h4>
              {" "}
              <img src={share} alt="" />
              Member Management
            </h4>
            <p className="mt-3">
              Efficiently handle your cooperative members; add or remove
              members, manage member information and requests ensuring smooth
              and responsive engagement.
            </p>
          </div>
        );
      case 2:
        return (
          <div className="my-4 card border-0 py-3 rounded-4">
            <h4>
              {" "}
              <img src={receipt} alt="" />
              Report & Analysis
            </h4>
            <p className="mt-3">
              Make informed decisions through powerful analytics. Automatically
              generated reports are available for every activity logged on to
              the platform, supporting data-driven strategies.
            </p>
          </div>
        );
      case 3:
        return (
          <div className="my-4 card border-0 py-3 rounded-4">
            <h4>
              {" "}
              <img src={wallet} alt="" />
              Loan Mngt
            </h4>
            <p className="mt-3">
              Simplify loan procedures for quick approvals while maintaining
              advanced control over loan terms, rates, duration, and options for
              full or partial liquidation.
            </p>
          </div>
        );
      case 4:
        return (
          <div className="my-4 card border-0 py-3 rounded-4">
            <h4>
              {" "}
              <img src={element} alt="" />
              Inventory Management
            </h4>
            <p className="mt-3">
              Cooperatives can effectively monitor all owned items and assets,
              including the ability to sell products to members, ensuring
              efficient inventory management.
            </p>
          </div>
        );
      case 5:
        return (
          <div className="mt-4 card border-0 py-3 rounded-4">
            <h4>
              {" "}
              <img src={status} alt="" />
              Inventory Management
            </h4>
            <p className="mt-3">
              Cooperatives can effectively monitor all owned items and assets,
              including the ability to sell products to members, ensuring
              efficient inventory management.
            </p>
          </div>
        );
    }
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "#FAFAFA",
          padding: "1rem 0",
          marginTop: "3rem",
        }}
      >
        <div className="container mx-auto feature-layout">
          <div style={{ alignSelf: "center" }}>
            <h1 style={{fontSize:'42px', fontWeight:'600'}}>Power up your cooperative with <br /> UCP’s all-in-one features</h1>
            <p className="mt-3">
              UCP is a comprehensive solution tailored for cooperatives,
              empowering you to manage your organization with greater efficiency
              and effectiveness.
            </p>
            <div className="d-flex justify-content-between flex-wrap feature-title-wrapper mt-5 bg-white">
              <span
                className={feature === 0 ? "acting" : 'not-acting'}
                onClick={() => setFeature(0)}
              >
                Accounting
              </span>
              <span
                className={feature === 1 ? "acting" : 'not-acting'}
                onClick={() => setFeature(1)}
              >
                Member Mngt
              </span>
              <span
                className={feature === 2 ? "acting" : 'not-acting'}
                onClick={() => setFeature(2)}
              >
                Report Analysis
              </span>
              <span
                className={feature === 3 ? "acting" : 'not-acting'}
                onClick={() => setFeature(3)}
              >
                Loan Mngt
              </span>
              <span
                className={feature === 4 ? "acting" : 'not-acting'}
                onClick={() => setFeature(4)}
              >
                Inventory Mngt
              </span>
              <span
                className={feature === 5 ? "acting" : 'not-acting'}
                onClick={() => setFeature(5)}
              >
                Investment
              </span>
            </div>
            {getTexts()}
          </div>
          <div>{getPictures()}</div>
        </div>
      </div>
      <div className="container">
        <div className="feature-cards-container">
          <h2 className="text-center fw-bold">UCP Channels</h2>
          <div className="">
            <div className="card-feature-two justify-content-between align-items-center">
              <div>
                <div className="card-title">
                  <span className="text-capitalize">UCP Admin web portal</span>
                </div>
                <h3>
                  Streamlined Control for <br /> Cooperative Admins.
                </h3>
                <p className="my-4">
                  Elevate administrative efficiency with the Unified Cooperative
                  Admin web.
                </p>
                <p className="mt-3 mb-5">
                  Experience seamless control over cooperative operations,
                  empowering corporate admins to navigate, manage, and optimize
                  with precision and ease.
                </p>
              </div>
              <div>
                <Suspense fallback={<div>Image loading</div>}>
                  <img
                    src={flowAdmin}
                    alt="Admin dashboard shot"
                    className="img-fluid"
                    loading="lazy"
                  />
                </Suspense>
              </div>
            </div>
            {/* Mobile Channels */}
            <div className="card-feature-one justify-content-between align-items-center">
              <Suspense fallback={<div>Image loading</div>}>
                <img
                  src={mobile}
                  alt="Admin portal pic"
                  className="img-fluid mx-auto"
                  loading="lazy"
                />
              </Suspense>
              <div>
                <div className="card-title">
                  <span className="text-capitalize">UCP member mobile App</span>
                </div>
                <h3>
                  Empowering Unity: <br />
                  Your Cooperative, Your App.
                </h3>
                <p className="my-4">
                  Explore efficiency and convenience at your fingertips with the
                  Unified Cooperative app.
                </p>
                <p className="my-3">
                  Designed exclusively for valued members, it connects you to
                  the heart of your cooperative experience, managing accounts
                  and delivering essential updates.
                </p>
                <div className="social-btns">
                  <Link
                    className="app-btn blu flex px-2"
                    to="https://play.google.com/store/apps/details?id=com.cwg.ucpmobile&hl=en"
                    target="_blank"
                  >
                    <img src={Google} alt="google-icon" className="img-fluid" />
                    <p>
                      Get it on <br />{" "}
                      <span className="big-txt">Google Store</span>
                    </p>
                  </Link>
                  <Link
                    className="app-btn blu flex border-1"
                    to="https://apps.apple.com/au/app/ucp-coop/id1473274707"
                    target="_blank"
                  >
                    <img
                      src={appleLogo}
                      alt="iphone-pic"
                      className="img-fluid"
                    />
                    <p>
                      Download on <br />{" "}
                      <span className="big-txt">App Store</span>
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="card-feature-three justify-content-between align-items-center">
            <div>
              <div className="card-title">
                <span className="text-capitalize">UCP member web portal</span>
              </div>
              <h3>
                Streamlined Connectivity <br /> for Cooperative Members.
              </h3>
              <p className="my-4">
                Experience seamless integration with our Unified Cooperative
                Member Web Portal.
              </p>
              <p className="mt-3 mb-5">
                Tailored for corporate members, it ensures effortless access to
                essential tools, empowering efficient collaboration and informed
                decision-making.
              </p>
            </div>
             <Suspense fallback={<div>Image loading</div>}>
                <img
                  src={member}
                  alt="Admin portal pic"
                  className="img-fluid"
                  loading="lazy"
                />
              </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default Potential;
