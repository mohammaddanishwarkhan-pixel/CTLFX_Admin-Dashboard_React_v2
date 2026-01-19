import React, { useState } from 'react';
import { Layout } from 'antd';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';

const { Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppSidebar collapsed={collapsed} />
      <Layout>
        <AppHeader collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#f0f2f5', minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
