import { ThemeProvider } from "@mui/material/styles";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { EncounterProvider } from "./context/EncounterContext";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import { darkTheme } from "./theme";

function App() {
    return (
      <ThemeProvider theme={darkTheme}>
        <EncounterProvider>
          <MainLayout>
            <Router>
              <Routes>
                <Route path="/" Component={Home} />
              </Routes>
            </Router>
          </MainLayout>
        </EncounterProvider>
      </ThemeProvider>
    );
}

export default App;
