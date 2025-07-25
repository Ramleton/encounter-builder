import { ThemeProvider } from "@mui/material/styles";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { EncounterProvider } from "./context/EncounterContext";
import { StatBlockProvider } from "./context/StatBlockContext";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { darkTheme } from "./theme";

function App() {
    return (
      <ThemeProvider theme={darkTheme}>
        <EncounterProvider>
          <StatBlockProvider>
            <MainLayout>
              <Router>
                <Routes>
                  <Route path="/" Component={Home} />
                  <Route path="/register" Component={Register} />
                </Routes>
              </Router>
            </MainLayout>
          </StatBlockProvider>
        </EncounterProvider>
      </ThemeProvider>
    );
}

export default App;
