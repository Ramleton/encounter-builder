import { Route, HashRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Editor from "./pages/Editor";
import EncounterLoadPage from "./pages/EncounterLoadPage";
import Home from "./pages/Home";

function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/editor" element={<Editor/>} />
          <Route path="/loadEncounter" element={<EncounterLoadPage />} />
        </Routes>
      </Router>
    );
}

export default App;
