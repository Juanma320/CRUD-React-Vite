import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Edit from "./pages/Edit";

function App() {
  return (
    <Router>
      {/* Barra de navegación */}
      <nav className="p-4 bg-gray-200 flex gap-4">
        <Link to="/" className="text-blue-500">Inicio</Link>
        <Link to="/create" className="text-green-500">Crear</Link>
      </nav>

      {/* Definición de rutas */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/edit/:id" element={<Edit />} />
      </Routes>
    </Router>
  );
}

export default App;
