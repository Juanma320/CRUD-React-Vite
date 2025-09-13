import { motion, Reorder } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import type { ReactNode } from 'react';

interface DragDropItem {
  readonly id: string | number;
  readonly content: ReactNode;
}

interface DragDropListProps {
  readonly items: DragDropItem[];
  readonly onReorder: (newOrder: DragDropItem[]) => void;
}

export default function DragDropList({ items, onReorder }: DragDropListProps) {
  return (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={onReorder}
      className="space-y-4"
    >
      {items.map((item) => (
        <Reorder.Item
          key={item.id}
          value={item}
          className="group cursor-grab active:cursor-grabbing"
          whileDrag={{
            scale: 1.05,
            rotate: 2,
            zIndex: 50,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.div
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-600 p-4 hover:shadow-lg transition-all duration-300"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                whileHover={{ scale: 1.2 }}
              >
                <GripVertical size={20} />
              </motion.div>
              <div className="flex-1">
                {item.content}
              </div>
            </div>
          </motion.div>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}