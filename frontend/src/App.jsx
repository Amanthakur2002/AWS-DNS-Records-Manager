import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Dashboard from "./Components/Dashboard";
axios.defaults.withCredentials = true;

export default function App() {
  return (    
    < div >
      <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <Home />
        }
      />

      <Route
        path="/records"
        element={
          // <UserPublic>
          <Dashboard />
          // </UserPublic>
        }
      />
    </Routes> 
      </BrowserRouter>
      </div >
      
  );
};
