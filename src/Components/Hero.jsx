import React,{Suspense} from "react";
import "./Hero.css";
import HeroImage from "../assets/ucp-admin.png";
import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import arrow from '../assets/arrow-pointer.png'
import mobile from '../assets/Email.png'
import partners from '../assets/partners.png'

const Hero = () => {
  return (
    <div className="hero" style={{ fontFamily: "General Sans" }}>
      <div className="text-center">
        <h2 className="text-center hero-heading">
          <span className="simplify">Simplify</span> your <br />
          Cooperative Operations.
        </h2>
        <p className="text-center mx-auto hero-para">
          UCP is a comprehensive solution tailored for cooperatives, empowering
          you to manage your organization with greater efficiency and
          effectiveness.
        </p>
        <Link to='/contact-us'>
        <button className="border-0 btn-md community-btn my-2 py-2 px-4">
          Request a Demo
        </button>
        </Link>

        <div className="d-flex gap-3 align-center justify-content-center mt-3" style={{height:'60px', marginLeft:'40px'}}>
          <img src={partners} alt="partners-images" className="img-fluid" style={{width:'152px'}}/>
          <img src={arrow} alt="arrow-pointer" className="img-fluid"/>
        </div>
        <div className="container px-5">
        <div className="d-sm-flex justify-content-center gap-3 mt-5">
          <Suspense fallBack={ <div className="d-flex.justify-content-center.align-items-center">
            Image loading...
          </div> }>
          <img
            src={HeroImage}
            loading="lazy"
            alt="Hero-Image"
            className="img-fluid mx-auto my-2"
            style={{width:'80%'}}
          />
          </Suspense>
           <Suspense fallBack={ <div className="d-flex.justify-content-center.align-items-center">
            Image loading...
          </div> }>
          <img
            src={mobile}
            loading="lazy"
            alt="Hero-Image"
            className="img-fluid w-75 mx-auto my-2"
          />
          </Suspense>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
