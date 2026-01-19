import React, { useEffect, useState } from 'react';
import { Table, Input, Space, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Otp } from '@/types';
import { getOtps } from '@/api/otps';
import dayjs from 'dayjs';
import { message } from 'antd';

const OTPPage: React.FC = () => {
  const [otps, setOtps] = useState<Otp[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  const fetchOtps = async () => {
    setLoading(true);
    try {
      const data = await getOtps();
      setOtps(data);
    } catch (error) {
      message.error('Failed to fetch OTP logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOtps();
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 100,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      filteredValue: [searchText],
      onFilter: (value: any, record: Otp) =>
        record.email.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Status',
      dataIndex: 'consumed',
      key: 'consumed',
      render: (consumed: boolean) => (
        <Tag color={consumed ? 'blue' : 'orange'}>{consumed ? 'Consumed' : 'Active'}</Tag>
      ),
      filters: [
        { text: 'Consumed', value: true },
        { text: 'Active', value: false },
      ],
      onFilter: (value: any, record: Otp) => record.consumed === value,
    },
    {
      title: 'Attempts',
      dataIndex: 'attempts',
      key: 'attempts',
      width: 100,
      sorter: (a: Otp, b: Otp) => a.attempts - b.attempts,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a: Otp, b: Otp) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: 'Expires At',
      dataIndex: 'expiresAt',
      key: 'expiresAt',
      render: (date: string) => {
        const isExpired = dayjs(date).isBefore(dayjs());
        return (
          <span style={{ color: isExpired ? '#ff4d4f' : 'inherit' }}>
            {dayjs(date).format('YYYY-MM-DD HH:mm:ss')}
            {isExpired && ' (Expired)'}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>OTP Logs</h1>
        <Space>
          <Input
            placeholder="Search by email"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
        </Space>
      </div>
      <Table columns={columns} dataSource={otps} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default OTPPage;
