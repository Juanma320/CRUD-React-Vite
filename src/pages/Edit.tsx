import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../services/api";

const EditUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (id) {
      getUserById(Number(id)).then((user) => {
        if (user) {
          setName(user.name);
          setEmail(user.email);
        }
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      await updateUser(Number(id), { name, email });
      navigate("/");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-orange-600 mb-4">
        Editar registro {id}
      </h2>
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
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Actualizar
        </button>
      </form>
    </div>
  );
};

export default EditUser;
