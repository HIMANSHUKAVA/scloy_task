import React from "react";

import Ragister from "./Component/Ragister";
import Login from "./Component/Login";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./Pages/Home";
import About from "./Pages/About";
import Contect from "./Pages/Contect";

import ProtectedRoute from "./Component/ProtectedRoute";
import AdminDashboard from "./Admin/AdminDashboard ";
import AdminHome from "./Admin/AdminHome"
import GetOrder from "./Component/GetOrder"
import Edituserbyadmin from "./Admin/Edituserbyadmin";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/ragister" element={<Ragister />} />

        {/* User Protected Routes */}
        <Route element={<ProtectedRoute allowedRole="User" />}>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contect" element={<Contect />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRole="Admin" />}>
          <Route path="/admin/home" element={<AdminHome/>} />
          <Route path="/admin/edit/:id" element={<Edituserbyadmin/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
