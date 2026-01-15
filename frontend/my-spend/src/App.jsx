import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import Bank from "./pages/Dashboard/Bank";
import FinancialHealth from "./pages/Dashboard/FinancialHealth";
import UserProvider from "./context/UserContext";
import FinancialProvider from "./context/FinancialContext";


const App = () => {
  return (
    <UserProvider>
      <FinancialProvider>
        <div>
          <Router>
            <Routes>
              <Route path="/" element={<Root />} />
              <Route path="/login"  exact element={<Login />} />
              <Route path="/signup" exact element={<SignUp />} />
              <Route path="/dashboard" exact element={<Home />} />
              <Route path="/income" exact element={<Income />} />
              <Route path="/expense" exact element={<Expense />} />
              <Route path="/bank" exact element={<Bank />} />
              <Route path="/financial-health" exact element={<FinancialHealth />} />
            </Routes>
          </Router>
        </div>
      </FinancialProvider>
    </UserProvider>
  );
};

export default App;

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};



