import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GeneratePage from "./pages/GeneratePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GeneratePage />} />
      </Routes>
    </Router>
  );
}