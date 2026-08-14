// src/pages/admin/components/settings/Branding.tsx
import React, { useState, useRef, useCallback } from 'react';
import Icon from '../../../../components/ui/Icon';
import Button from '../../../../components/ui/Button';

const Branding: React.FC = () => {
  const [logo, setLogo] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [favicon, setFavicon] = useState<string | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [isLogoDragging, setIsLogoDragging] = useState(false);
  const [isFaviconDragging, setIsFaviconDragging] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleLogoUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran maksimal 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setLogo(event.target?.result as string);
      setLogoFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleFaviconUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran maksimal 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setFavicon(event.target?.result as string);
      setFaviconFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleLogoUpload(file);
    e.target.value = '';
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFaviconUpload(file);
    e.target.value = '';
  };

  const removeLogo = () => {
    setLogo(null);
    setLogoFile(null);
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  const removeFavicon = () => {
    setFavicon(null);
    setFaviconFile(null);
    if (faviconInputRef.current) faviconInputRef.current.value = '';
  };

  const handleLogoDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsLogoDragging(true);
  }, []);

  const handleLogoDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsLogoDragging(false);
  }, []);

  const handleLogoDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsLogoDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleLogoUpload(file);
  }, []);

  const handleFaviconDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsFaviconDragging(true);
  }, []);

  const handleFaviconDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsFaviconDragging(false);
  }, []);

  const handleFaviconDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsFaviconDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFaviconUpload(file);
  }, []);

  return (
    <div className="space-y-6">
      {/* ── Primary Logo ── */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-[14px] font-bold text-[#191c1e]">Logo Utama</h3>
          {logoFile && (
            <span className="text-[11px] text-[#737686] bg-[#f2f4f6] px-2 py-0.5 rounded-full">
              {formatFileSize(logoFile.size)}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Preview */}
          <div
            className={`relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${
              logo
                ? 'border-[#004ac6] bg-[#f2f6ff]'
                : isLogoDragging
                  ? 'border-[#004ac6] bg-[#dbe1ff] scale-105'
                  : 'border-[#c3c6d7] bg-[#f8f9fb] hover:border-[#004ac6] hover:bg-[#f2f6ff]'
            }`}
            onDragOver={handleLogoDragOver}
            onDragLeave={handleLogoDragLeave}
            onDrop={handleLogoDrop}
          >
            {logo ? (
              <>
                <img src={logo} alt="Logo" className="h-full w-full object-contain p-3" />
                <button
                  onClick={removeLogo}
                  className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#ba1a1a] text-white shadow-lg transition-colors hover:bg-[#9a1515]"
                  aria-label="Hapus logo"
                >
                  <Icon name="close" size={12} />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-1 text-center">
                <Icon name="upload" size={28} className="text-[#c3c6d7]" />
                <span className="text-[10px] text-[#737686]">Drop or click</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => logoInputRef.current?.click()}
                className="text-sm"
              >
                <Icon name="upload" size={14} className="mr-1" />
                {logo ? 'Ganti Logo' : 'Upload Logo'}
              </Button>
              {logo && (
                <Button
                  variant="outline"
                  onClick={removeLogo}
                  className="text-sm border-[#ba1a1a]/30 text-[#ba1a1a] hover:bg-[#ffe0e0]"
                >
                  <Icon name="trash" size={14} className="mr-1" />
                  Hapus
                </Button>
              )}
            </div>
            <p className="text-[11px] text-[#737686]">
              SVG, PNG, JPG (max 2MB). Rasio 1:1 direkomendasikan.
            </p>
            {logo && logoFile && (
              <p className="text-[11px] text-[#156b32]">
                ✓ Logo siap upload ({formatFileSize(logoFile.size)})
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Favicon ── */}
      <div className="pt-4 border-t border-[#e0e3e5]">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-[14px] font-bold text-[#191c1e]">Favicon</h3>
          {faviconFile && (
            <span className="text-[11px] text-[#737686] bg-[#f2f4f6] px-2 py-0.5 rounded-full">
              {formatFileSize(faviconFile.size)}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Preview */}
          <div
            className={`relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300 ${
              favicon
                ? 'border-[#004ac6] bg-[#f2f6ff]'
                : isFaviconDragging
                  ? 'border-[#004ac6] bg-[#dbe1ff] scale-105'
                  : 'border-[#c3c6d7] bg-[#f8f9fb] hover:border-[#004ac6] hover:bg-[#f2f6ff]'
            }`}
            onDragOver={handleFaviconDragOver}
            onDragLeave={handleFaviconDragLeave}
            onDrop={handleFaviconDrop}
          >
            {favicon ? (
              <>
                <img src={favicon} alt="Favicon" className="h-full w-full object-contain p-2" />
                <button
                  onClick={removeFavicon}
                  className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#ba1a1a] text-white shadow-lg transition-colors hover:bg-[#9a1515]"
                  aria-label="Hapus favicon"
                >
                  <Icon name="close" size={12} />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-1 text-center">
                <Icon name="image" size={20} className="text-[#c3c6d7]" />
                <span className="text-[9px] text-[#737686]">Drop or click</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <input
                ref={faviconInputRef}
                type="file"
                accept="image/*"
                onChange={handleFaviconChange}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => faviconInputRef.current?.click()}
                className="text-sm"
              >
                <Icon name="upload" size={14} className="mr-1" />
                {favicon ? 'Ganti Favicon' : 'Upload Favicon'}
              </Button>
              {favicon && (
                <Button
                  variant="outline"
                  onClick={removeFavicon}
                  className="text-sm border-[#ba1a1a]/30 text-[#ba1a1a] hover:bg-[#ffe0e0]"
                >
                  <Icon name="trash" size={14} className="mr-1" />
                  Hapus
                </Button>
              )}
            </div>
            <p className="text-[11px] text-[#737686]">
              ICO, PNG, JPG (max 2MB). Ukuran 32×32px direkomendasikan.
            </p>
            {favicon && faviconFile && (
              <p className="text-[11px] text-[#156b32]">
                ✓ Favicon siap upload ({formatFileSize(faviconFile.size)})
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Branding;