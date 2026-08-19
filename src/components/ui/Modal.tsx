import React, { type ReactNode } from 'react';
import Icon from './Icon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div
        className={`
          w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto
          rounded-3xl bg-white shadow-xl
          animate-slideDown
        `}
      >
        <div className="flex items-center justify-between border-b border-[#e0e3e5] px-6 py-4">
          <h3 className="text-lg font-bold text-[#101319]">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-[#737686] transition-colors hover:bg-[#f5f7fb] hover:text-[#004ac6]"
          >
            <Icon name="close" size={20} className="" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;