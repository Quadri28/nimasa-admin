import React, { Suspense } from "react";
import "./About.css";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import "@splidejs/splide/dist/css/splide.min.css";
import Eleven from "../assets/image-eleven.png";
import One from '../assets/image-one.png'
import Two from '../assets/image-two.png'
import Three from '../assets/image-three.png'
import Four from '../assets/image-four.png'
import Five from '../assets/image-five.png'
import Six from '../assets/image-six.png'
import Seven from '../assets/image-seven.png'
import Eight from '../assets/image-eight.png'
import Nine from '../assets/image-nine.png'
import Ten from '../assets/image-ten.png'
import bams from '../assets/bams.png'
import { Link } from "react-router-dom";

const About = () => {
  return (
    <>
      <div className="about-hero py-4" style={{fontFamily:'General Sans'}}>
      <div className="why-us mx-auto mt-2">
       <span>Why Us</span>
         </div>
      <div className="row text-center container mx-auto">
      <h2 className="about-promise-header ">Why UCP?</h2>
      <p className="about-para mt-2">
              In Nigeria alone, more than 40 million individuals engage in saving
              and borrowing activities outside formal financial institutions.
              This typically involves common saving methods like Savings Groups,
              collectors, and community/trade associations. These cooperatives
              frequently operate independently from the traditional banking
              system, resulting in limited access to finance.{" "}
            </p>
            <p className="about-para mt-2">
              We built a dynamic system designed to streamline and simplify the
              management of cooperatives such as member management, loan
              applications, contribution management, reporting and investments.
              Our solution offers a more efficient way to run your cooperative,
              eliminating bulkiness and time-consuming tasks.
            </p>
            <div className="my-3">
          <Link to='privacy-policy' className="border-0 btn-md community-btn my-2 py-2 px-4" style={{textDecoration:'none'}}>
          Privacy policy
        </Link>
          <Link to='delete-account' className="border-0 btn btn-primary-outline my-2 py-2 px-4"
          style={{textDecoration:'none'}}>
          Delete account
        </Link>
        </div>
            </div>
            <div className="img-scroll container">
            <Splide
          options={{
            type: "loop",
            gap: "10px",
            drag: "free",
            arrows: false,
            pagination: false,
            perPage: 3,
            autoScroll: {
              pauseOnHover: false,
              pauseOnFocus: false,
              rewind: false,
              speed: 1,
            },
          }}
          extensions={{ AutoScroll }}
        >
          <SplideSlide className="slide">
            <Suspense fallback={ <div>Image loading...</div> }>
            <img
              src={Eleven}
              alt="slide-image"
              loading="lazy"
              className="img-fluid about-slide-images"
            />
            </Suspense>
          </SplideSlide>
          <SplideSlide className="slide">
          <Suspense fallback={ <div>Image loading...</div> }>
            <img
              src={One}
              alt="slide-image"
              className="img-fluid about-slide-images"
              loading="lazy"
            />
            </Suspense>
          </SplideSlide>
          <SplideSlide className="slide">
          <Suspense fallback={ <div>Image loading...</div> }>
            <img
              src={Two}
              alt="slide-image"
              loading="lazy"
              className="img-fluid about-slide-images"
            />
            </Suspense>
          </SplideSlide>
          <SplideSlide>
          <Suspense fallback={ <div>Image loading...</div> }>
          <img
              src={Three}
              alt="slide-image"
              className="img-fluid about-slide-images"
              loading="lazy"
            />
            </Suspense>
          </SplideSlide>
          <SplideSlide>
          <Suspense fallback={ <div>Image loading...</div> }>
          <img
              src={Four}
              alt="slide-image"
              className="img-fluid about-slide-images"
              loading="lazy"
            />
            </Suspense>
          </SplideSlide>
          <SplideSlide>
          <Suspense fallback={ <div>Image loading...</div> }>
          <img
              src={Five}
              alt="slide-image"
              className="img-fluid about-slide-images"
              loading="lazy"
            />
            </Suspense>
          </SplideSlide>
          <SplideSlide>
          <Suspense fallback={ <div>Image loading...</div> }>
          <img
              src={Six}
              alt="slide-image"
              className="img-fluid about-slide-images"
              loading="lazy"
            />
            </Suspense>
          </SplideSlide>
          <SplideSlide>
          <Suspense fallback={ <div>Image loading...</div> }>
          <img
              src={Seven}
              alt="slide-image"
              className="img-fluid about-slide-images"
              loading="lazy"
            />
            </Suspense>
          </SplideSlide>
          <SplideSlide>
          <Suspense fallback={ <div>Image loading...</div> }>
          <img
              src={Eight}
              alt="slide-image"
              className="img-fluid about-slide-images"
              loading="lazy"
            />
            </Suspense>
          </SplideSlide>
          <SplideSlide>
          <Suspense fallback={ <div>Image loading...</div> }>
          <img
              src={Nine}
              alt="slide-image"
              className="img-fluid about-slide-images"
              loading="lazy"
            />
            </Suspense>
          </SplideSlide>
          <SplideSlide>
          <Suspense fallback={ <div>Image loading...</div> }>
          <img
              src={Ten}
              alt="slide-image"
              className="img-fluid about-slide-images"
              loading="lazy"
            />
            </Suspense>
          </SplideSlide>
          <SplideSlide className="slide">
          <Suspense fallback={ <div>Image loading...</div> }>
            <img
              src={bams}
              alt="slide-image"
              loading="lazy"
              className="img-fluid about-slide-images"
            />
            </Suspense>
          </SplideSlide>
        </Splide>
      </div> 
      </div>
      <div className="about-promise py-4" style={{fontFamily:'General Sans'}}>
        <div className="row justify-content-center mt-4 container g-3 mx-auto align-items-start">
        <div className="col-lg-4 col-md-5">
            <div className="wrapper">
              <span>Our Promises to you</span>
            </div>
            <p className="">
            We understand the unique challenges faced by cooperatives, therefore,
             we have dedicated our time to  meeting these needs for operational success.
            </p>
          </div>
          <div className="col-lg-4 col-md-5">
            <div className="wrapper">
              <span>Our Mission</span>
            </div>
            <p className="">
              To provide the industry standard solution that improves
              co-operative societies’ accountability, productivity and linkage
              to financial ecosystem in Nigeria while offering globally accepted
              best practices in front office service activities.
            </p>
          </div>
          <div className="col-lg-4 col-md-5">
            <div className="wrapper">
              <span>Our Vision</span>
            </div>
            <p className="">
              To provide the industry standard solution that improves
              co-operative societies’ accountability, productivity and linkage
              to financial ecosystem in Nigeria while offering globally accepted
              best practices in front office service activities.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
