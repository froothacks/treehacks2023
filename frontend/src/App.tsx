import React from "react";
import { Routes, Route } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RouteName } from "./constants/routes";
import { Home } from "./pages/Home";
import { Submission } from "./pages/submission";
import { Worksheet } from "./pages/worksheet";
import { Worksheets } from "./pages/worksheets";

export const App = () => {
  return (
    <div className="App" style={{ height: "100vh" }}>
      <Header />
      <div
        style={{
          height: "calc(100% - 60px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ height: "100%" }}>
          <Routes>
            <Route path={RouteName.HOME} element={<Home />} />
            <Route
              path={RouteName.WORKSHEETS}
              element={
                <ProtectedRoute>
                  <Worksheets />
                </ProtectedRoute>
              }
            />
            <Route
              path={RouteName.WORKSHEET}
              element={
                <ProtectedRoute>
                  <Worksheet />
                </ProtectedRoute>
              }
            />
            <Route
              path={RouteName.SUBMISSION}
              element={
                <ProtectedRoute>
                  <Submission />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        {/*<Footer />*/}
      </div>
    </div>
  );
};
