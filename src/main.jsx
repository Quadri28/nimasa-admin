import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import React from 'react'
import axios from './Components/axios.js'
import { BrowserRouter } from 'react-router-dom'

axios.interceptors.request.use(request=>{
  return request
})

axios.interceptors.response.use(response=>{
  return response
})
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </React.StrictMode>,
)
