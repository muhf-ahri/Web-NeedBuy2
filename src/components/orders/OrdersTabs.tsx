import React from 'react';

import { STATUS_TABS, type TabKey } from './orders.helpers';

interface OrdersTabsProps {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}

const OrdersTabs: React.FC<OrdersTabsProps> = ({ activeTab, onChange }) => (
  <div
    className="
      mb-6 flex gap-2 overflow-x-auto pb-2
      [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
    "
  >
    {STATUS_TABS.map((tab) => {
      const active = activeTab === tab.key;
      return (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`
            shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[12px]
            font-semibold transition-all duration-200 active:scale-[0.98]
            ${
              active
                ? 'bg-[#004ac6] text-white shadow-[0_6px_16px_rgba(83,140,219,0.30)]'
                : 'border border-[#e0e3e5] bg-white text-[#737686] hover:border-[#004ac6]/40 hover:text-[#004ac6]'
            }
          `}
        >
          {tab.label}
        </button>
      );
    })}
  </div>
);

export default OrdersTabs;