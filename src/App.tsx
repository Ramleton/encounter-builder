import { ThemeProvider } from "@mui/material/styles";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { EncounterProvider } from "./context/EncounterContext";
import MainLayout from "./layouts/MainLayout";
import AuthForm from "./pages/AuthForm";
import CreateStatBlock from "./pages/CreateStatBlock";
import Home from "./pages/Home";
import StatBlockSearch from "./pages/StatBlockSearch";
import { darkTheme } from "./theme";

function App() {
    return (
      <ThemeProvider theme={darkTheme}>
        <AuthProvider>
          <EncounterProvider>
            <Router>
              <MainLayout>
                <Routes>
                  <Route path="/" Component={Home} />
                  <Route path="/auth" Component={AuthForm} />
                  <Route path="/statblock_search" Component={StatBlockSearch} />
                  <Route path="/create_statblock" Component={CreateStatBlock} />
                </Routes>
              </MainLayout>
            </Router>
          </EncounterProvider>
        </AuthProvider>
      </ThemeProvider>
    );
}

export default App;
