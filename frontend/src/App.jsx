import React from "react";
import { NavBar } from "./components/NavBar";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { Box } from "@chakra-ui/react";
import { Drivers } from "./pages/Drivers";
import { Constructors } from "./pages/Constructors";
import PaceHistory from "./pages/PaceHistory";

function App() {
   return (
      <>
         <NavBar />
         <Box minH="100vh" bg="gray.100">
            <Routes>
               <Route path="/" element={<HomePage />} />
               <Route path="/drivers" element={<Drivers />} />
               <Route path="/constructors" element={<Constructors />} />
               <Route path="/pace-history" element={<PaceHistory />} />
            </Routes>
         </Box>
      </>
   );
}

export default App;
