import Warning from "./components/Warning";
import ReportingForm from "./components/ReportingForm";
import { Routes, Route } from "react-router-dom";
import Scanner from "./components/Scanner";
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="min-h-screen grid-bg relative">
      <div className="fixed inset-0 bg-gradient-to-br from-kraven-950/20 via-dark-950 to-dark-950 pointer-events-none" />
      <div className="relative z-10">
        <Navbar />
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/scan" element={<Scanner />} />
            <Route path="/report" element={<ReportingForm />} />
            <Route path="/warning" element={<Warning />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
