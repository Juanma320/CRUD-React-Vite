import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Plus, Sparkles } from "lucide-react";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Edit from "./pages/Edit";
import { ThemeProvider } from "./hooks/useTheme";
import { ToastProvider } from "./components/ui/Toast";
import ThemeToggle from "./components/ui/ThemeToggle";

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 transition-colors duration-300"></div>
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-400/30 to-cyan-600/30 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-yellow-400/20 to-orange-600/20 rounded-full blur-2xl"
        animate={{
          x: [-50, 50, -50],
          y: [-50, 50, -50],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}

function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      className="backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center space-x-8">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ModernCRUD
              </h1>
            </motion.div>
            <div className="flex space-x-2">
              <Link to="/">
                <motion.div
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isActive('/')
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Users size={18} />
                  Usuarios
                </motion.div>
              </Link>
              <Link to="/create">
                <motion.div
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isActive('/create')
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={18} />
                  Crear
                </motion.div>
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen relative transition-colors duration-300">
            <AnimatedBackground />
            <Navigation />
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<Create />} />
                <Route path="/edit/:id" element={<Edit />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;