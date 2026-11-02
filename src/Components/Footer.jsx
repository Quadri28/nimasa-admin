import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { BsGithub, BsInstagram, BsTwitter, BsTelephone } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
import { CiMail, CiLocationOn } from "react-icons/ci";

const Footer = () => {
  return (
      <div className="footer" style={{fontFamily:'General Sans'}}>
    <div className="container mx-auto w-100 row justify-content-between align-items-start g-3">
      <div className="col-lg-4 col-md-5">
        <h3>Unified Cooperative Platform.</h3>
        <p>
        At UCP (Unified Cooperative Platform), we are dedicated to empowering cooperatives to thrive
         in today's dynamic landscape. Through our cutting-edge technology and collaborative approach, 
         we aim to build and streamline cooperative societies, enhancing their operational efficiency,
          transparency, and member engagement. Our platform is the result of a collaborative effort with 
          cooperative bodies, designed to redefine and standardize the operations of cooperatives,
         and foster a more sustainable and resilient cooperative ecosystem
        </p>
        <div className="d-flex  align-items-center gap-4 g-2">
          <BsTwitter /> <FaFacebookF /> <BsInstagram /> <BsGithub />
        </div>
      </div>
      <div className="col-lg-2 col-md-5 menus">
        <ul>
          <h3>Menus</h3>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/agents">Agents</Link>
          </li>
          <li>
            <Link to="/faqs">Faqs</Link>
          </li>
          <li>
            <Link to="/contact-us">Contact Us</Link>
          </li>
        </ul>
      </div>
       <ul className="col-lg-1 col-md-5 d-flex flex-column gap-3 sign-in">
       <li>
            <Link to='/cooperative-signin' >Cooperative</Link>
         </li>
          <li>
        <Link to='/member-signin' >Member</Link>
        </li>
       </ul>
      <div className="col-lg-4 col-md-5">
        <div className="row footer-contact">
          <h3>Reach us</h3>
          <p>
            <BsTelephone /> <a href="tel:+234(0)8038913480">+234(0)8038913480</a> |  <a href="tel:+234(0)8067822133">+234(0)8067822133</a>
          </p>
          <p>
            <CiMail /> <a href="mailto:ucp.support@cwg-plc.com">
              ucp.support@cwg-plc.com | 
            </a> <a href="mailto:contact@cfan.coop">contact@cfan.coop</a>
          </p>
          <p>
            <CiLocationOn /> Block 54A, Plot 10, Off Rufus Giwa Street, Off
            Adebayo Doherty Road, Off Admiralty Way, Lekki Phase 1, Lagos,
            Nigeria
          </p>
        </div>
      </div>
    <p className="text-center">© {new Date().getFullYear()} Unified Co-operative Platform. All Rights Reserved.</p>
    </div>
    </div>
  );
};

export default Footer;
