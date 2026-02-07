import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Voters from './Voters';
import FinalResults from './FinalResults';

const ElectionReport = () => {
  const [clicked, setClicked] = useState('voters')

  const getComponents=()=>{
    if (clicked === 'voters') {
      return <Voters/>
    }else {
      return <FinalResults/>
    }
  }

return (

<div className='card p-3 border-0 rounded-4'>
<div className='d-sm-flex gap-4 align-items-center my-3'>
    <span className={clicked === 'voters' ? "active-selector" : 'text-dark'} 
    onClick={()=>setClicked('voters')}     style={{cursor:'pointer'}} >
        Voters
    </span>
    <span className={clicked === 'final-results' ? "active-selector" : 'text-dark'}
     style={{cursor:'pointer'}} onClick={()=>setClicked('final-results')}>
        Final Results
    </span>
</div>
  <div>
    { getComponents()}
  </div>
 </div>    
)
}

export default ElectionReport
