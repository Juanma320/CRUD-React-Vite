import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getUserById, updateUser } from "../services/api";
import AnimatedButton from "../components/ui/AnimatedButton";
import ModernInput from "../components/ui/ModernInput";
import GlassCard from "../components/ui/GlassCard";
import { useToast } from "../hooks/useToastHook";
import { User, Mail, ArrowLeft, Edit3, CheckCircle } from "lucide-react";

const EditUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const loadUser = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const user = await getUserById(Number(id));
        if (user) {
          setName(user.name);
          setEmail(user.email);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        addToast({
          type: 'error',
          title: 'Error al cargar usuario',
          message: 'No se pudo cargar la información del usuario'
        });
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id, addToast]);

  const validateForm = () => {
    const newErrors: { name?: string; email?: string } = {};

    if (!name.trim()) {
      newErrors.name = "El nombre es requerido";
    } else if (name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    if (!email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "El email no es válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !id) return;

    try {
      setSaving(true);
      await updateUser(Number(id), { name: name.trim(), email: email.trim() });
      setSuccess(true);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error('Error updating user:', error);
      addToast({
        type: 'error',
        title: 'Error al actualizar',
        message: 'No se pudo actualizar el usuario. Inténtalo de nuevo.'
      });
      setErrors({ email: "Error al actualizar el usuario. Inténtalo de nuevo." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <motion.div
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </motion.div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <GlassCard hover={false}>
            <div className="text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-6"
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
                  <CheckCircle size={40} className="text-white" />
                </div>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
              >
                ¡Usuario actualizado!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-gray-800 dark:text-gray-200"
              >
                Redirigiendo a la lista de usuarios...
              </motion.p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="flex justify-center mb-4">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl"
          >
            <Edit3 size={32} className="text-white" />
          </motion.div>
        </div>
        <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white">
          Editar Usuario
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Modifica la información del usuario #{id}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ModernInput
                label="Nombre completo"
                type="text"
                placeholder="Ingresa el nombre completo"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                }}
                error={errors.name}
                icon={<User size={20} />}
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ModernInput
                label="Correo electrónico"
                type="email"
                placeholder="usuario@ejemplo.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                }}
                error={errors.email}
                icon={<Mail size={20} />}
                required
              />
            </motion.div>

            <motion.div
              className="flex gap-4 pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <AnimatedButton
                type="submit"
                variant="gradient"
                size="lg"
                loading={saving}
                className="flex-1"
                icon={<Edit3 size={20} />}
              >
                Actualizar Usuario
              </AnimatedButton>
              <Link to="/">
                <AnimatedButton
                  variant="ghost"
                  size="lg"
                  type="button"
                  icon={<ArrowLeft size={20} />}
                >
                  Volver
                </AnimatedButton>
              </Link>
            </motion.div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default EditUser;