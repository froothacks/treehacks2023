import React from "react";
import { Routes, Route } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Worksheet } from "./pages/worksheet";
import { Worksheets } from "./pages/worksheets";

export const App = () => {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/worksheets" element={<Worksheet />} />
        <Route path="/worksheet" element={<Worksheets />} />
      </Routes>
      <Footer />
    </div>
  );
};
