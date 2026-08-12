// src/pages/seller/AnalyticsPage.tsx
import React from 'react';
import SellerLayout from './SellerLayout';
import Icon from '../../components/ui/Icon';

const AnalyticsPage: React.FC = () => {
  const revenueData = [120, 90, 150, 180, 110, 200, 160, 140];
  const days = ['Mon', 'Sun', 'Wed', 'Thu', 'Wed', 'Thu', 'Fed']; // sesuai gambar
  const conversionRate = 3.5;
  const topProducts = ['Mechanical Keyboard', 'Ergonomic Mouse', 'Laptop Stand', 'Wifi Bankird', 'Desktop Stand'];

  return (
    <SellerLayout>
      <div className="space-y-6">
        <h1 className="text-[28px] font-bold text-[#191c1e]">Shop Analytics</h1>

        {/* Revenue Growth Chart */}
        <div className="bg-white rounded-2xl border border-[#e0e3e5] p-5">
          <h3 className="text-[15px] font-bold text-[#191c1e] mb-4">Revenue Growth</h3>
          <div className="h-48 flex items-end gap-2">
            {revenueData.map((value, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-[#004ac6] rounded-t"
                  style={{ height: `${(value / 200) * 100}%` }}
                />
                <span className="text-[10px] text-[#737686] mt-1">{days[i % days.length]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Conversion Rate */}
          <div className="bg-white rounded-2xl border border-[#e0e3e5] p-5">
            <h3 className="text-[15px] font-bold text-[#191c1e] mb-2">Conversion Rate</h3>
            <p className="text-[36px] font-bold text-[#004ac6]">{conversionRate}%</p>
          </div>

          {/* Top Selling Products */}
          <div className="bg-white rounded-2xl border border-[#e0e3e5] p-5">
            <h3 className="text-[15px] font-bold text-[#191c1e] mb-4">Top Selling Products</h3>
            <ul className="space-y-2">
              {topProducts.map((product, idx) => (
                <li key={idx} className="flex items-center gap-2 text-[13px] text-[#434655]">
                  <span className="font-semibold text-[#004ac6]">{idx+1}.</span>
                  {product}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-[#f2f6ff] border border-[#dbe1ff] rounded-2xl p-5">
          <h3 className="flex items-center gap-2 text-[15px] font-bold text-[#191c1e] mb-3">
            <Icon name="spark" size={20} className="text-[#004ac6]" />
            AI-generated Insights
          </h3>
          <ul className="space-y-2 text-[13px] text-[#434655]">
            <li>💡 <strong>Tip:</strong> Consider running a promotion on <span className="font-semibold">Top Selling Product</span> to boost sales.</li>
            <li>📈 Your conversion rate has improved by 0.5% since last week.</li>
            <li>✏️ Try adding more detailed descriptions to low-performing products.</li>
          </ul>
        </div>
      </div>
    </SellerLayout>
  );
};

export default AnalyticsPage;