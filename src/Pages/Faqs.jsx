import React, { useEffect, useState } from "react";
import "./Faqs.css";
import {AiOutlinePlus, AiOutlineMinus} from 'react-icons/ai'
import portrait from '../assets/portrait.png'
import { Link } from "react-router-dom";

const Faqs = () => {
  const [Clicked, setClicked] = useState("");
    const [opened, setOpened] = useState(true)
useEffect(()=>{
  window.scrollTo(0, 0)
}, [])

  const faqs = [
    {
      id: 1,
      question: "Who can use UCP?",
      answer: "UCP is for everyday cooperative societies, individuals and companies who are tired of hassels in running cooperative processes. By automating your processes, you can effectively manage membership, savings, loan, accounting, and reporting through a single setup and click.",
    },
    {
      id: 2,
      question: "How can I access UCP?",
      answer: "With any internet enabled device, you can access UCP using your username and password from your browser for admins and members as well as mobile app",
    },
    {
        id: 3,
        question: "How secured is UCP?",
        answer: "Our platform uses world-class standard security and encryption technology to protect all data. When you provide us with information, be rest assured your privacy is protected.",
    },
    {   id:4,
        question:"How can members access their Savings & Contributions?",
        answer:"UCP is for everyday cooperative societies, individuals and companies who are tired of hassels in running cooperative processes. By automating your processes, you can effectively manage membership, savings, loan, accounting, and reporting through a single setup and click.",
    },
    {
      id: 5,
      question: "Does this software come with accounting modules that cover all transactions?",
      answer: "This service is only available when you login as an Admin of your Cooperative Society"
    },
   
    {
      id: 6,
      question: "Can We Control who has access to Cooperative Information?",
      answer: "Your loan balance is displayed on the members dashboard. To view more details, select Loan on the menu tab and navigate between the options.",
    },
  ];

  const loans=[
    {id:'1l',
     question:'How to check loan status?',
     answer:"Your loan balance is displayed on the members dashboard. To view more details, select Loan on the menu tab and navigate between the options.",
    },
    {
      id:'2l',
      question:'How can I access loan on UCP?',
      answer:'On UCP, loan application is seamless. An application can be done by the admin on behalf of their members or members apply for the loan using the various channels'
    },
    {
        id:'3l',
        question:'How to check loan balance and maturity date?',
        answer:'Click on Loans on the menu tab to view your loan status and select the option'
      },
      {
        id:'4l',
        question:'Can I apply for additional loan?',
        answer:'This depends on the policies of your Cooperative Society. If in doubt, pls contact your cooperative Admin for clarification.'
      },
  ]

  return (
    <>
    <div className="py-5 px-3" style={{backgroundColor:''}} id="faqs">
      <div className="d-flex justify-content-center wrapper mx-auto">
        <span> Frequently asked questions</span>
      </div>
      <div className="faq">
        {/* <h2 className="text-center ">Frequently asked questions</h2> */}
      </div>
      <div className="mt-3  faqs">
        <h4 className="mb-3">General Questions</h4>
        {faqs.map((faq) => (
        <div style={{
            backgroundColor:'#FAFAFA',
              borderRadius:'1rem',
              cursor:'pointer'
              }} key={faq.id}>
          <div
            onClick={() => {
              setClicked(faq.id)
              setOpened(!opened)
                        }
                }
            style={{
              display: "flex",
              alignItems: "center",
              padding: "13px 10px",
              justifyContent:'space-between',
              fontWeight:'bold'
            }}
          >
            <div>Q. {faq.question}</div>
            {Clicked === faq.id && !opened  ? 
                <p><AiOutlineMinus onClick={()=>setOpened(!opened)} /></p> : <p><AiOutlinePlus onClick={()=>setOpened(!opened)}/> </p>}
          </div>
          <div 
             className={Clicked === faq.id && !opened ? "Clicked" : "notClicked"}
             style={{
                
                 alignItems: "center",
                paddingLeft: "10px",
            }}
          >
            <p>{faq.answer}</p>
          </div>
          </div>
        ))}
      </div>

            {/* FAQS ABOUT LOANS */}

      <div className="mt-5  faqs">
        <h4 className="mb-3">Loan</h4>
        {loans.map((faq) => (
        <div style={{backgroundColor:'#fafafa', borderRadius:'1rem', cursor:'pointer'}} key={faq.id}>
          <div
            id={faq.id}
            onClick={() => {
              setClicked(faq.id)
              setOpened(!opened)
            }}
            className="d-flex justify-content-between align-items-center"
            style={{
              padding: "13px 10px",
              fontWeight:'bold',
            }}
          >
            <div>Q. {faq.question}</div>
            {Clicked === faq.id && !opened  ? 
            <p><AiOutlineMinus onClick={()=>setOpened(!opened)}/> </p> : <p> <AiOutlinePlus onClick={()=>setOpened(!opened)}/> </p>}
          </div>
          <div 
             className={Clicked === faq.id && !opened ? "Clicked" : "notClicked"}
             style={{
                alignItems: "center",
                paddingLeft: "10px",
            }}
          >
            <p>{faq.answer}</p>
          </div>
          </div>
        ))}
      </div>
    </div>
    <div className="more-faq text-center">
            <img src={portrait} alt="faq-portrait" className="img-fluid my-2 " />
            <h2>Got more questions or peculiar needs?</h2>
            <Link to='/contact-us'>
            <button className="btn btn-medium"> Get in touch</button>
            </Link>
    </div>
    </>
  );
};

export default Faqs;
