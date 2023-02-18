import React from "react";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Worksheet } from "./pages/worksheet";
import { Worksheets } from "./pages/worksheets";

export const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/worksheets" element={<Worksheet />} />
        <Route path="/worksheet" element={<Worksheets />} />
      </Routes>
    </div>
  );
};
