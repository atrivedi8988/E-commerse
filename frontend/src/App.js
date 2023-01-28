import Header from "./Components/layout/Header/Header";
import Footer from "./Components/layout/Footer/Footer"
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import Webfont from "webfontloader"
import React from "react";

function App() {

  React.useEffect(()=>{
    Webfont.load({
      google:{
        families:["Roboto","Droid Sans","Chilanka"]
      }
    })
  },[])
  return (
    <Router>
      <Header />
      <Footer/>
    </Router>
  );
}

export default App;
