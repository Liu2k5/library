import React, { useEffect, useState } from 'react';
import { authApi } from '../../../api/authApi';
import TopBar from '../TopBar';
import Sidebar from '../Sidebar';
import Overall from '../Overall';
import NotificationManage from '../NotificationManage';
import MembershipManage from '../MembershipManage';
import AccountManage from '../AccountManage';
import './Dashboard.css';

const TABS = {
  OVERALL: 'overall',
  NOTIFICATIONS: 'notifications',
  MEMBERSHIPS: 'memberships',
  ACCOUNTS: 'accounts',
};

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(TABS.OVERALL);

  useEffect(() => {
    let isMounted = true;
    authApi
      .getCurrentUser()
      .then((res) => {
        if (isMounted) setUser(res.data);
      })
      .catch(() => {
        if (isMounted) setUser(null);
      })
      .finally(() => {
        if (isMounted) setUserLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // even if the request fails, drop the local session state
    } finally {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  return (
    <div className="dash-shell">
      <TopBar user={user} loading={userLoading} onLogout={handleLogout} />
      <div className="dash-body">
        <Sidebar activeTab={activeTab} onSelect={setActiveTab} />
        <main className="dash-content">
          {activeTab === TABS.OVERALL && <Overall />}
          {activeTab === TABS.NOTIFICATIONS && <NotificationManage />}
          {activeTab === TABS.MEMBERSHIPS && <MembershipManage />}
          {activeTab === TABS.ACCOUNTS && <AccountManage />}
        </main>
      </div>
    </div>
  );
}
