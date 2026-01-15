import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/newlogo.jpeg";

const Navbar = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-5 flex justify-between items-center">
      <Link to="/dashboard" className="flex items-center">
        <div className="w-12 h-12 mr-3">
          <img src={logo} alt="Logo" className="w-full h-full object-contain bg-white" />
        </div>
        <span className="text-xl md:text-2xl font-semibold font-montserrat uppercase tracking-wider text-gray-800">
  Spend X
</span>

      </Link>
      <em className="text-xs font-medium text-gray-500 hidden md:block">Track. Manage. Grow your money!!</em>
    </div>
  );
};

export default Navbar;
