import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import AddCat from "@/pages/AddCat";
import CatProfile from "@/pages/CatProfile";
import CustomDiet from "@/pages/CustomDiet";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/add-cat" element={<AddCat />} />
      <Route path="/cats/:name" element={<CatProfile />} />
      <Route path="/custom-diet" element={<CustomDiet />} />
    </Routes>
  );
}

export default App;