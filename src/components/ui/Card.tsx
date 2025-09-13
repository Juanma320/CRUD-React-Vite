import type { ReactNode } from 'react';

interface CardProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {children}
    </div>
  );
}