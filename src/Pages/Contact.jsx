import React,{useEffect, useState} from 'react'
import './Contact.css'
import InTouch from '../Components/InTouch'
import Demo from '../Components/Demo'

const Contact = () => {
    const [active, setActive] =useState('touch')
    useEffect(()=>{
    if (typeof window !== 'undefined') {
        window.scrollTo(0, 0)
    }
      }, [])
    const display =()=>{
        if (active === 'touch') {
            return <InTouch/>
        }else{
            return<Demo/>
        }
    }
  return (
    <div className='py-5 px-3' style={{fontFamily:'General Sans', backgroundColor:'#fafafa'}}>
        <div className="my-4 text-center d-flex justify-content-center gap-4">
            <div onClick={()=>setActive('touch')} className={active === 'touch' ? 'activated': null} 
            style={{cursor:'pointer'}}>
                Get in touch</div>
            <div onClick={()=>setActive('demo')} className={active === 'demo' ? 'activated': null}
             style={{cursor:'pointer'}}>Book A Demo</div>
        </div>
        <div>
        {
            display()
        }
        </div>
    </div>
  )
}

export default Contact
