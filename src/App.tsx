// App.tsx
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./AppRouter";
import { AuthProvider } from "./hooks/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import { AppProvider } from "./hooks/AppContext";

function App() {
  return (
    <AuthProvider>
      <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppRouter />
      </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
