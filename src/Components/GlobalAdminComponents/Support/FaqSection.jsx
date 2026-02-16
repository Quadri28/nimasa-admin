import React, { useState, useMemo, useContext } from 'react'
import Table from '../../DashboardComponents/CommunicationSubComponents/Table'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../../axios'
import { UserContext } from '../../AuthContext'
import { BsArrowLeft } from 'react-icons/bs'
import { MdOutlineModeEdit } from 'react-icons/md'

const FaqSection = () => {
  const [data, setData]= useState([])
  const [loading, setLoading]= useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const fetchIdRef = React.useRef(0);
  const {credentials} = useContext(UserContext)

  const fetchData = React.useCallback(() => {
      const fetchId = ++fetchIdRef.current;
      setLoading(true);
      setTimeout(() => {
        if (fetchId === fetchIdRef.current) {
          axios
            .get(
              `FaqSection/get-all-faq-question-sections?PageSize=${pageSize}&PageNumber=${pageNumber}`,
              {
                headers: {
                  Authorization: `Bearer ${credentials.token}`,
                },}
            )
            .then((resp) => {
              if (resp.data.data.modelResult) {
                setData(resp.data.data.modelResult);
                setPageCount(
                  Math.ceil(resp.data.data.totalCount / pageSize)
                );
              }
            });
          setLoading(false);
        }
      })
    }, []);
  
  
    const column = [
      { Header: "S/N", accessor: "", Cell:(({cell})=>{
        return <span>{1 + cell.row.index}</span>
      }) },
      { Header: "Section Name", accessor: "sectionName"},
      { Header: "Description", accessor: "description"},
      { Header:'Actions', accessor:'', Cell:(({cell})=>{
        const id = cell.row.original.id
        return <div className="d-flex gap-1 align-items-center justify-content-center">
             <Link to={`edit-faq-section/${id}`} className='text-dark'> <MdOutlineModeEdit style={{cursor:'pointer'}} size={20}/></Link>

             </div>
    })},
    
    ];
  
    const columns = useMemo(() => column, []);
  const navigate = useNavigate()
  return (
    <>
    <div className="d-flex justify-content-between">
      <span>
      <BsArrowLeft style={{cursor:'pointer'}} onClick={()=>navigate(-1)}/> Faq section
      </span>
      <Link to='create-faq-section' className='border-0 btn-md px-3 member'
       style={{fontSize:'14px', textDecoration:'none'}}>Create faq section</Link>
      </div>
  <Table
   data={data}
   loading={loading}
   fetchData={fetchData}
   columns={columns}
   pageNumber={pageNumber}
   setPageNumber={setPageNumber}
   />
    </>
  )
}

export default FaqSection
