// src/pages/ShoppingPlansPage.tsx
//
// Rencana Belanja = grup belanja. User bikin kategori sendiri (mis. "Kamar"),
// isi dengan produk (kipas, lampu, ...), lalu checkout satu grup sekaligus
// tanpa mencentang item satu per satu di keranjang.
//
// Alur AI (kebutuhan → rekomendasi → rencana otomatis) pindah ke /needs.
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import PlansListView from '../components/shopping-plans/PlansListView';
import PlanDetail from '../components/shopping-plans/PlanDetail';

const ShoppingPlansPage: React.FC = () => {
  // /needs mengirim planId lewat state saat "Jadikan Rencana" — langsung buka.
  const fromNeeds =
    (useLocation().state as { planId?: string } | null)?.planId ?? null;
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(fromNeeds);

  return selectedPlanId ? (
    <PlanDetail
      planId={selectedPlanId}
      onBack={() => setSelectedPlanId(null)}
    />
  ) : (
    <PlansListView onSelect={setSelectedPlanId} />
  );
};

export default ShoppingPlansPage;