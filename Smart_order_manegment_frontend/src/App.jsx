import React from 'react'
import GetOrder from './Component/GetOrder'
import Ragister from './Component/Ragister'
import Login from "./Component/Login"
import {BrowserRouter,  Route, Routes} from "react-router-dom"
import Welcome from "./Component/Welcome"
export default function App() {
  return (
    <>
  
     <BrowserRouter>
     <Routes>
      <Route element={<Login/>} path='/'/>
      <Route element={<Ragister/>} path='/ragister'/>
      <Route element={<Welcome/>} path='/welcome'/>
     </Routes>
     </BrowserRouter>
    </>
  )
}
