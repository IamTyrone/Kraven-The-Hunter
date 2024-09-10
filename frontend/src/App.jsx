import Warning from "./components/Warning";
import ReportingForm from "./components/ReportingForm";
import { Routes, Route } from "react-router-dom";
import Scanner from "./components/Scanner";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<ReportingForm />} />
        <Route path="/warning" element={<Warning />} />
        <Route path="/scan" element={<Scanner />} />
      </Routes>
    </>
  );
}

export default App;
