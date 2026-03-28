import React, { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import "./NavBar.css";
import {FaBars, FaTimes } from "react-icons/fa";
import {FaArrowRight } from "react-icons/fa6";
import Logo from "../assets/Logo.png";
import { RxCaretUp, RxCaretDown } from "react-icons/rx";

const NavBar = () => {
  const [showNavbar, setShowNavbar] = useState(false);
  const [active, setActive] = useState("");
  const [coopActive, setCoopActive] = useState(false);
  const [membActive, setMembActive] = useState(false);
  const {pathname} = useLocation()

  

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  return (
    <nav className="navbar navbar-light" style={{fontFamily:'General Sans'}}>
      <div className="container">
        <Link to="/">
          <img src={Logo} alt="Logo" className="img-fluid" />
        </Link>
        <div className="menu-icon" onClick={handleShowNavbar}>
          {!showNavbar ? <FaBars /> : <FaTimes />}
        </div>
        <div className={`nav-elements  ${showNavbar && "active"}`}>
          <ul>
            <li>
              <NavLink
                to="/about-us"
                onClick={() => setActive("about")}
                className={
                  pathname === "about" ? `active ${"nav-links"}` : "nav-links"
                }
              >
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/faqs"
                onClick={() => setActive("faqs")}
                className={
                  pathname === "faqs" ? `active ${"nav-links"}` : "nav-links"
                }
              >
                FAQs
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact-us"
                onClick={() => setActive("contact")}
                className={
                  pathname === "contact" ? `active ${"nav-links"}` : "nav-links"
                }
              >
                Contact Us
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/agents"
                onClick={() => setActive("agent")}
                className={
                  pathname === "agent" ? `active ${"nav-links"}` : "nav-links"
                }
              >
                Agents
              </NavLink>
            </li>
            <div className="d-md-flex gap-3 align-items-center button-container">
              <li>
                <div className="dropdown">
                  <button className="cooperative btn-md dropbtn">
                    Cooperative
                  </button>
                  <div className="dropdown-content">
                    <NavLink to="/cooperative-signin">
                      Sign-in as cooperative <FaArrowRight />
                    </NavLink>
                    <NavLink to="/cooperative-signup">
                      Sign-up as cooperative <FaArrowRight />
                    </NavLink>
                  </div>
                </div>
              </li>
              <li>
                <div className="dropdown">
                  <button className="member btn-md dropbtn">Member</button>
                  <div className="dropdown-contents">
                    <Link to="https://solutions.cooplatform.com.ng/ucpmember/">
                      Sign-in as member <FaArrowRight />
                    </Link>
                    <Link to="https://solutions.cooplatform.com.ng/ucpmember/member-signup">
                      Sign-up as member <FaArrowRight />
                    </Link>
                  </div>
                </div>
              </li>
            </div>
            <div className="w-100 mobile-menu">
                <div
                  className="d-flex text-white justify-content-between align-items-center"
                  onClick={() => setCoopActive(!coopActive)} style={{cursor:'pointer'}}
                >
                  <span className=""> Cooperative</span>
                  {coopActive ? <RxCaretUp /> : <RxCaretDown />}
                </div>
                <ul
                  className={
                    coopActive
                      ? "d-flex flex-column gap-2 mt-3"
                      : "d-flex flex-column gap mt-3 coop-container"
                  }
                >
                  <NavLink
                    to="cooperative-signin" >
                    Sign-in as cooperative
                  </NavLink>
                  <NavLink
                    to="cooperative-signup">
                    Sign-up as cooperative
                  </NavLink>
                </ul>
              </div>
            <div className="w-100 mobile-menu">
                <div
                  className="d-flex text-white justify-content-between align-items-center"
                  onClick={() => setMembActive(!membActive)} style={{width:'100%', cursor:'pointer'}}
                >
                  <span> Member</span>
                  <span style={{marginLeft:'auto'}}>
                  {membActive ? <RxCaretUp /> : <RxCaretDown />}</span>
                </div>
                <ul
                  className={
                    membActive
                      ? "d-flex flex-column gap-2 mt-3"
                      : "d-flex flex-column gap-2 mt-3 coop-container"
                  }
                >
                  <NavLink
                    to="member-signin"
                  >
                    Sign-in as member
                  </NavLink>
                  <NavLink
                    to="member-signup"
                  >
                    Sign-up as member
                  </NavLink>
                </ul>
              </div>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
