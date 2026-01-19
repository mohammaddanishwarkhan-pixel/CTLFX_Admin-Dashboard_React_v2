import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin } from 'antd';
import { UserOutlined, DollarOutlined, BankOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { getDashboardStats, DashboardStats } from '@/api/dashboard';


const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<DashboardStats>({
    users: { active: 0, deleted: 0 },
    financials: { totalDeposits: 0, totalWithdrawals: 0 },
    pending: { deposits: 0, withdrawals: 0 }
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Dashboard</h1>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={stats.users.active}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Deleted Users"
              value={stats.users.deleted}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Deposits"
              value={stats.financials.totalDeposits}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Withdrawals"
              value={stats.financials.totalWithdrawals}
              prefix={<BankOutlined />}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Deposits"
              value={stats.pending.deposits}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Withdrawals"
              value={stats.pending.withdrawals}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#d4380d' }}
            />
          </Card>
        </Col>

      </Row>
    </div>
  );
};

export default Dashboard;
