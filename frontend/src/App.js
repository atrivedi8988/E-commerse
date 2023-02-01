import Header from "./Components/layout/Header/Header";
import Footer from "./Components/layout/Footer/Footer"
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Webfont from "webfontloader"
import React from "react";
import Home from "./Components/Home/Home.jsx"

function App() {

  React.useEffect(()=>{
    Webfont.load({
      google:{
        families:["Roboto","Droid Sans","Chilanka"]
      }
    })
  },[])
  return (
    <Routes>
      <Header />
      <Route path="/" element={<Home/>}/>
      <Footer/>
    </Routes>
  );
}

export default App;
