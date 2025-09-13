import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getUsers, deleteUser } from "../services/api";
import type { User } from "../services/api";
import AnimatedButton from "../components/ui/AnimatedButton";
import GlassCard from "../components/ui/GlassCard";
import SearchBar from "../components/ui/SearchBar";
import DragDropList from "../components/ui/DragDropList";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useToast } from "../hooks/useToastHook";
import { Users, Plus, Edit3, Trash2, Mail, UserCheck, Sparkles, Search, GripVertical } from "lucide-react";

function LoadingAnimation() {
  return (
    <div className="flex justify-center items-center py-20">
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 dark:border-blue-400 rounded-full border-t-transparent animate-spin"></div>
      </motion.div>
    </div>
  );
}

function UserCard({ user, onDelete, deleting }: { readonly user: User; readonly onDelete: (user: User) => void; readonly deleting: boolean }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ type: "spring", stiffness: 400, damping: 25, duration: 0.3 }}
      className="group"
    >
      <GlassCard className="hover:shadow-2xl transition-all duration-500 overflow-hidden">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <motion.div
              className="relative flex-shrink-0"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </motion.div>
            <div className="space-y-1 flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg truncate">{user.name}</h3>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <Mail size={14} className="flex-shrink-0" />
                <span className="text-sm truncate text-gray-700 dark:text-gray-200">{user.email}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-2 border-t border-gray-300 dark:border-gray-600">
            <Link to={`/edit/${user.id}`} className="flex-1">
              <AnimatedButton variant="secondary" size="sm" icon={<Edit3 size={16} />} className="w-full">
                Editar
              </AnimatedButton>
            </Link>
            <AnimatedButton
              variant="danger"
              size="sm"
              loading={deleting}
              icon={<Trash2 size={16} />}
              onClick={() => onDelete(user)}
              className="flex-1"
            >
              Eliminar
            </AnimatedButton>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <GlassCard hover={false}>
        <div className="text-center py-16">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="mb-6"
          >
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center">
              <Users size={40} className="text-blue-500" />
            </div>
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">¡Comienza tu aventura!</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
            No tienes usuarios aún. Crea tu primer usuario y descubre todas las funcionalidades increíbles.
          </p>
          <Link to="/create">
            <AnimatedButton variant="gradient" size="lg" icon={<Sparkles size={20} />}>
              Crear mi primer usuario
            </AnimatedButton>
          </Link>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dragMode, setDragMode] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; userId: number | null; userName: string }>({ isOpen: false, userId: null, userName: '' });
  const { addToast } = useToast();

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    return users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setConfirmDialog({ isOpen: true, userId: user.id, userName: user.name });
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDialog.userId) return;

    try {
      setDeleting(confirmDialog.userId);
      setConfirmDialog({ isOpen: false, userId: null, userName: '' });
      await deleteUser(confirmDialog.userId);
      await loadUsers();
      addToast({
        type: 'success',
        title: 'Usuario eliminado',
        message: `${confirmDialog.userName} ha sido eliminado correctamente`
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      addToast({
        type: 'error',
        title: 'Error al eliminar',
        message: 'No se pudo eliminar el usuario. Inténtalo de nuevo.'
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDialog({ isOpen: false, userId: null, userName: '' });
  };

  const handleReorder = (newOrder: { id: string | number; content: React.ReactNode }[]) => {
    const reorderedUsers = newOrder.map(item =>
      users.find(user => user.id === item.id)
    ).filter(Boolean) as User[];
    setUsers(reorderedUsers);
    addToast({
      type: 'success',
      title: 'Orden actualizado',
      message: 'Los usuarios han sido reordenados'
    });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <motion.div
          className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Gestión de Usuarios
            </h1>
            <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2" aria-live="polite">
              <UserCheck size={18} aria-hidden="true" />
              {filteredUsers.length} de {users.length} usuario{users.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <AnimatedButton
              variant={dragMode ? "primary" : "secondary"}
              onClick={() => setDragMode(!dragMode)}
              icon={<GripVertical size={20} />}
              aria-label={dragMode ? 'Salir del modo de reordenamiento' : 'Activar modo de reordenamiento'}
            >
              {dragMode ? 'Salir de reorden' : 'Reordenar'}
            </AnimatedButton>
            <Link to="/create">
              <AnimatedButton variant="gradient" size="lg" icon={<Plus size={20} />} aria-label="Crear nuevo usuario">
                Crear Usuario
              </AnimatedButton>
            </Link>
          </div>
        </motion.div>

        {!dragMode && (
          <div className="max-w-md">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Buscar por nombre o email..."
            />
          </div>
        )}
      </div>

      {(() => {
        if (filteredUsers.length === 0) {
          if (searchQuery) {
            return (
              <GlassCard hover={false}>
                <div className="text-center py-12">
                  <Search size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No se encontraron usuarios</h3>
                  <p className="text-gray-600 dark:text-gray-300">Intenta con otros términos de búsqueda</p>
                </div>
              </GlassCard>
            );
          }
          return <EmptyState />;
        }

        if (dragMode) {
          return (
            <DragDropList
              items={filteredUsers.map(user => ({
                id: user.id,
                content: (
                  <div className="flex items-center space-x-4 w-full">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                )
              }))}
              onReorder={handleReorder}
            />
          );
        }

        return (
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AnimatePresence mode="popLayout">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <UserCard
                    user={user}
                    onDelete={handleDeleteClick}
                    deleting={deleting === user.id}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        );
      })()}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Usuario"
        message={`¿Estás seguro de que deseas eliminar a ${confirmDialog.userName}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}