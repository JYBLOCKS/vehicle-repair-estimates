import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { AuthContextProvider } from "./features/auth/context/Auth";
import PrivateRoute from "./context/PrivateRoute";
import { Login, NotFound, Register, Home } from "./features";
import { routes } from "./routes";
import { AppThemeProvider } from "./themes/ThemeProvider";

const publicRoutes = [
  { path: routes.home, element: <Home /> },
  { path: routes.login, element: <Login /> },
  { path: routes.register, element: <Register /> },
];

const privateRoutes = [];

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <AppThemeProvider>
        <BrowserRouter>
          <Routes>
            {publicRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}

            <Route element={<PrivateRoute />}>
              {privateRoutes.length > 0 &&
                privateRoutes.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))}
            </Route>

            <Route path={routes.notFound} element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppThemeProvider>
    </AuthContextProvider>
  </StrictMode>
);
