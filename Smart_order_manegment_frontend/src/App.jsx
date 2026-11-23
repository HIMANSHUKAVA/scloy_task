import React from "react";

import Ragister from "./Component/Ragister";
import Login from "./Component/Login";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./Pages/Home";
import About from "./Pages/About";
import Contect from "./Pages/Contect";

import ProtectedRoute from "./Component/ProtectedRoute";
import AdminHome from "./Admin/AdminHome"
import Edituserbyadmin from "./Admin/Edituserbyadmin";
import Addproduct from "./Admin/Addproduct"
import Viewproduct from "./Admin/Viewproduct"
import Editproduct from "./Admin/Editproduct"
import ViewProduct from "./Pages/ViewProduct";
import Drawers1 from "./Component/Drawers1";
import Singleview from "./Admin/Singleview";
import AdminDrawer from "./Admin/AdminDrawer"
import SingleViewByUser from "./Pages/SingleViewByUser"
import Myorder from "./Pages/Myorder"
import Wishlist from "./Pages/Wishlist";
import ViewOrder from "./Admin/ViewOrder";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/ragister" element={<Ragister />} />
        <Route path="/drawer" element={<Drawers1/>}/>
        <Route path="/admindrawer" element={<AdminDrawer/>}/>

        {/* User Protected Routes */}
        <Route element={<ProtectedRoute allowedRole="User" />}>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contect" element={<Contect />} />
          <Route path="/view-product" element={<ViewProduct/>}/>
          <Route path="/view-single/:id" element={<SingleViewByUser/>}/>
          <Route path="/user/myorder" element={<Myorder/>}/>
          <Route path="/wishlist" element={<Wishlist/>}/>
          
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRole="Admin" />}>
          <Route path="/admin/home" element={<AdminHome/>} />
          <Route path="/admin/edit/:id" element={<Edituserbyadmin/>}/>
          <Route path="/admin/add-product" element={<Addproduct/>} />
          <Route path="/admin/view-product" element={<Viewproduct/>}/>
          <Route path="/admin/edit-product/:id" element={<Editproduct/>}/>
          <Route path="/admin/single/view/:id" element={<Singleview/>}/>
          <Route path="/admin/vieworder" element={<ViewOrder/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
