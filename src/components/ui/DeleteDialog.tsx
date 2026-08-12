// src/components/ui/DeleteDialog.tsx
import React, { useState } from 'react';
import Button from './Button';
import Icon from './Icon';
import { deleteInvent, type InventProduct } from '../../api/invent';

interface DeleteDialogProps {
  product: InventProduct;
  onClose: () => void;
  onDeleted: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  product,
  onClose,
  onDeleted,
}) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirm = async () => {
    setBusy(true);
    setError(null);
    try {
      await deleteInvent(product.id);
      onDeleted();
    } catch (err: any) {
      setError(err?.message ?? 'Gagal menghapus produk');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="px-5 py-4 border-b border-[#e0e3e5]">
          <h2 className="text-[16px] font-bold text-[#191c1e]">Hapus produk?</h2>
        </div>

        <div className="p-5 space-y-3">
          <p className="text-[13px] text-[#434655]">
            <span className="font-semibold text-[#191c1e]">{product.name}</span> akan
            dihapus permanen dari toko kamu. Tindakan ini tidak bisa dibatalkan.
          </p>

          {error && (
            <div className="p-2 bg-[#ffe0e0] border border-[#ffbcbc] text-[#a33131] text-xs rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={confirm}
              disabled={busy}
              className="flex-1 px-4 py-2 rounded-full bg-[#ba1a1a] text-white text-sm font-medium hover:bg-[#9a1515] disabled:opacity-50 transition"
            >
              {busy ? 'Menghapus…' : 'Ya, hapus'}
            </button>
            <Button type="button" variant="outline" onClick={onClose} disabled={busy}>
              Batal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteDialog;