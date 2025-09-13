import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { createUser } from "../services/api";
import AnimatedButton from "../components/ui/AnimatedButton";
import ModernInput from "../components/ui/ModernInput";
import GlassCard from "../components/ui/GlassCard";
import { useToast } from "../hooks/useToastHook";
import { User, Mail, ArrowLeft, Sparkles, CheckCircle } from "lucide-react";

const CreateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

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

    if (!validateForm()) return;

    try {
      setLoading(true);
      await createUser({ name: name.trim(), email: email.trim() });
      setSuccess(true);

      // Animación de éxito y redirección
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error('Error creating user:', error);
      addToast({
        type: 'error',
        title: 'Error al crear usuario',
        message: 'No se pudo crear el usuario. Inténtalo de nuevo.'
      });
      setErrors({ email: "Error al crear el usuario. Inténtalo de nuevo." });
    } finally {
      setLoading(false);
    }
  };

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
                ¡Usuario creado con éxito!
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
            <Sparkles size={32} className="text-white" />
          </motion.div>
        </div>
        <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white">
          Crear Nuevo Usuario
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Completa la información para agregar un nuevo miembro al equipo
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
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
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.2 }}
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
              className="flex flex-col sm:flex-row gap-4 pt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.2 }}
            >
              <AnimatedButton
                type="submit"
                variant="gradient"
                size="lg"
                loading={loading}
                className="flex-1"
                icon={<Sparkles size={20} />}
                aria-label="Crear nuevo usuario"
              >
                Crear Usuario
              </AnimatedButton>
              <Link to="/">
                <AnimatedButton
                  variant="ghost"
                  size="lg"
                  type="button"
                  icon={<ArrowLeft size={20} />}
                  aria-label="Volver a la lista de usuarios"
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

export default CreateUser;