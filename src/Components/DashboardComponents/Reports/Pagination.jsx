import {IoChevronBackSharp, IoChevronForwardSharp} from 'react-icons/io5'

const Pagination = ({  setCurrentPage, currentPage, indexOfLastRecord, indexOfFirstRecord, reports}) => {
    const reportLength = reports.length
  return (
    <>
    <nav aria-label="Page navigation example">
  <ul className="pagination d-flex justify-content-center align-items-center gap-3">
    Page {indexOfLastRecord} of {reportLength}
    <li className="page-item btn-sm">
      <button className="page-link text-dark" style={{borderRadius:'10px'}} aria-label="Previous" 
      onClick={()=>setCurrentPage(currentPage -1)} disabled={indexOfFirstRecord === 0}>
     <IoChevronBackSharp/>
      </button>
    </li>
   
    <li className="page-item btn-sm">
      <button className="page-link text-dark" style={{borderRadius:'10px'}} aria-label="Next"  
      onClick={()=>setCurrentPage(currentPage + 1)} disabled={indexOfLastRecord === reportLength}>
        <IoChevronForwardSharp/>
      </button>
    </li>
  </ul>
</nav>
    </>
  )
}

export default Pagination