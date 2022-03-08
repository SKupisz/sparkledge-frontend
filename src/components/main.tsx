import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux"

import { LightMode, DarkMode } from "../styled/main";
import { RootState } from "../redux/mainReducer";
import Navbar from "./subcomponents/navbar";
import Welcome from "./subpages/welcome";
import About from "./subpages/about";
import SigningPanel from "./subpages/signing";

const Main:React.FC = () => {

    const graphicalMode: number = useSelector((state:RootState)=> state.generalData.graphicalMode);

    return <ThemeProvider theme={graphicalMode === 0 ? LightMode : DarkMode}>
        <Router>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Welcome/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/signin" element={<SigningPanel mode={1}/>}/>
            </Routes>
        </Router>
    </ThemeProvider>
};

export default Main;