import "./App.css";
import Navbar from "./components/navbar";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Home from "./pages/home";
import Footer from "./components/footer";
import Signin from "./pages/signin";
import Playground from "./pages/playground";
import { Toaster } from "sonner";
function App() {
  return (
    <div className=" md:mx-5 my-5 flex flex-col gap-4">
      <Router>
        <Toaster position="bottom-right" />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="playground" element={<Playground />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
