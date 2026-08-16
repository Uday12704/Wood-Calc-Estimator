import { BrowserRouter } from "react-router-dom";

import { AppRoutes } from "@/routes";
import { ThemeProvider } from "./components/common/theme-provider";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;