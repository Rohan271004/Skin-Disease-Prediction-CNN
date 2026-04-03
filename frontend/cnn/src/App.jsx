import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Disease from "./components/Disease";
import Result from "./components/Result";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Disease />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
