import AuthContext from './Components/AuthContext'
import Layout from './Pages/Templates/Layout'
import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import './App.css'

function App() { 
  
  return (
    <AuthContext>
    <Layout/>
    </AuthContext>
  )
}

export default App
