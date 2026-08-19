import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from './ui/Icon';
import { followSeller, unfollowSeller } from '../api/sellers';
import { useAuth } from '../contexts/AuthContext';
import type { ProductDetailSeller } from '../types';

const SellerCard: React.FC<{ seller: ProductDetailSeller }> = ({ seller }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [following, setFollowing] = useState(seller.following);
  const [followerCount, setFollowerCount] = useState(seller._count?.followers ?? 0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleFollow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = following ? await unfollowSeller(seller.id) : await followSeller(seller.id);
      setFollowing(res.data.data.following);
      setFollowerCount(res.data.data.followerCount);
    } catch (err: any) {
      setError(err?.message ?? 'Gagal ubah status ikuti, coba lagi ya');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-3xl border border-[#e0e3e5] p-5">
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-[#f2f4f6]">
          {seller.logoUrl ? (
            <img src={seller.logoUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-[#a2a8b3]">
              <Icon name="shop" size={22} className="" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/search?seller=${seller.id}`}
              className="text-[15px] font-bold text-[#101319] hover:text-[#004ac6] transition-colors"
            >
              {seller.storeName}
            </Link>
            {seller.vacationMode && (
              <span className="rounded-full bg-[#fff0e9] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#ff5a1f]">
                Sedang libur
              </span>
            )}
          </div>

          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#737686]">
            <span className="inline-flex items-center gap-1">
              <Icon name="star" size={12} className="text-[#ffd500]" />
              {Number(seller.rating).toFixed(1)}
            </span>
            <span>{seller._count?.products ?? 0} produk</span>
            <span>{followerCount.toLocaleString('id-ID')} pengikut</span>
          </p>

          {seller.description && (
            <p className="mt-2 line-clamp-2 text-[13px] text-[#434655]">{seller.description}</p>
          )}
        </div>

        <button
          onClick={toggleFollow}
          disabled={busy}
          aria-pressed={following}
          className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-semibold transition-colors disabled:opacity-60 ${
            following
              ? 'bg-[#f2f4f6] text-[#434655] hover:bg-[#e0e3e5]'
              : 'bg-[#004ac6] text-white hover:bg-[#003ea8]'
          }`}
        >
          {following ? 'Diikuti' : 'Ikuti'}
        </button>
      </div>

      {error && <p className="mt-3 text-[12px] text-[#ba1a1a]">{error}</p>}
    </div>
  );
};

export default SellerCard;
