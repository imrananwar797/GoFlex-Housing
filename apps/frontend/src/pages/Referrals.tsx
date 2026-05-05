import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import ReferralCenter from '../components/referral/ReferralCenter';

const Referrals: React.FC = () => {
  return (
    <DashboardLayout
      title="Referral Program"
      nav={[
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/referrals', label: 'Refer & Earn' },
      ]}
    >
      <ReferralCenter />
    </DashboardLayout>
  );
};

export default Referrals;
