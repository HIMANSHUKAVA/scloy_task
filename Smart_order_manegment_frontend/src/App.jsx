import React from 'react'
import GetOrder from './Component/GetOrder'
import Ragister from './Component/Ragister'
import Login from "./Component/Login"
import {BrowserRouter,  Route, Routes} from "react-router-dom"
import Welcome from "./Component/Welcome"
import Home from './Pages/Home'
import About from './Pages/About'
import Contect from "./Pages/Contect"
import Pagenotfound from "./Pages/Pagenotfound"
export default function App() {
  return (
    <>
  
     <BrowserRouter>
     <Routes>
      <Route element={<Login/>} path='/'/>
      <Route element={<Ragister/>} path='/ragister'/>
      <Route element={<Welcome/>} path='/welcome'/>
      <Route element={<Home/>} path='/home'/>
      <Route element={<About/>} path='/about'/>
      <Route element={<Contect/>} path='/contect'/>
      <Route element={<Pagenotfound/>} path='*'/>
     </Routes>
     </BrowserRouter>
    </>
  )
}
