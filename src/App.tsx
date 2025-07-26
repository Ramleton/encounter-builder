import { ThemeProvider } from "@mui/material/styles";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { EncounterProvider } from "./context/EncounterContext";
import { StatBlockProvider } from "./context/StatBlockContext";
import MainLayout from "./layouts/MainLayout";
import AuthForm from "./pages/AuthForm";
import Home from "./pages/Home";
import { darkTheme } from "./theme";

function App() {
    return (
      <ThemeProvider theme={darkTheme}>
        <AuthProvider>
          <EncounterProvider>
            <StatBlockProvider>
              <MainLayout>
                <Router>
                  <Routes>
                    <Route path="/" Component={Home} />
                    <Route path="/auth" Component={AuthForm} />
                  </Routes>
                </Router>
              </MainLayout>
            </StatBlockProvider>
          </EncounterProvider>
        </AuthProvider>
      </ThemeProvider>
    );
}

export default App;
