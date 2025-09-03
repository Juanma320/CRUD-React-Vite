import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../services/mockData";

export default function Create() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createUser({ name, email });
    navigate("/"); // volver a lista
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-green-600 mb-4">Crear registro</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-2 py-1 w-full"
          required
        />
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-2 py-1 w-full"
          required
        />
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Guardar
        </button>
      </form>
    </div>
  );
}
