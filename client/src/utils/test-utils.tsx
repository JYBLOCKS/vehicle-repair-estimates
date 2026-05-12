import React, { type ReactNode } from "react";
import { queries, render, type RenderOptions } from "@testing-library/react";
//styles
import { theme } from "../themes/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router";
import { AuthContextProvider } from "../features/auth/context/Auth";

const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return (
    <AuthContextProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>{children}</BrowserRouter>
      </ThemeProvider>
    </AuthContextProvider>
  );
};

const customRender = (
  ui: ReactNode,
  options?: Omit<RenderOptions, "queries">,
) => render(ui, { queries, wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
