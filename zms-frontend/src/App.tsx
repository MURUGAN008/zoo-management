import { Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import AdminPortal from "./pages/AdminPortal";
import NotFound from "./pages/NotFound";
import CreateAnimal from "./pages/CreateAnimal";
// import Home from "./pages/";


function App() {

  return (
    <Routes>
      {/* App should be in white bg and using colorful demonstrations */}
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/portal/admin" element={<AdminPortal />} />
      <Route path="/create/animal" element={<CreateAnimal />} />
      {/* /map */}
      <Route path="*" element={<NotFound />} />
    </Routes>

  )
}

export default App
