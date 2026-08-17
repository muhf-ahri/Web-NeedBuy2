import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import PlansListView from '../components/shopping-plans/PlansListView';
import PlanDetail from '../components/shopping-plans/PlanDetail';

const ShoppingPlansPage: React.FC = () => {
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