import Warning from "./components/Warning";
import ReportingForm from "./components/ReportingForm";
import { Routes, Route } from "react-router-dom";
import Scanner from "./components/Scanner";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ReportingForm />} />
      <Route path="/warning" element={<Warning />} />
      <Route path="/scan" element={<Scanner />} />
    </Routes>
  );
}

export default App;
