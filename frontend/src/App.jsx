import Warning from "./components/Warning";
import ReportingForm from "./components/ReportingForm";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ReportingForm />} />
      <Route path="/warning" element={<Warning />} />
    </Routes>
  );
}

export default App;
