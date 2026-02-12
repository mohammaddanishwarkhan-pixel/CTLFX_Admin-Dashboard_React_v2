import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Table, Tabs, Button, Spin, message, Tag, Modal, Form, Input } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { User, Payment, Profile } from '@/types';
import { getUserById } from '@/api/users';
import { getPaymentsByUserId } from '@/api/payments';


import { getProfileByUserId, createProfile, updateProfile } from '@/api/profiles';
import { getErrorMessage } from '@/utils/error';
import dayjs from 'dayjs';

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Loading states
  const [userLoading, setUserLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);



  // Data states
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);


  // Pagination states
  const [paymentParams, setPaymentParams] = useState<any>({ page: 1, limit: 10, total: 0 });


  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [form] = Form.useForm();

  const userId = id ? parseInt(id) : null;

  const fetchUser = async () => {
    if (!userId) return;
    setUserLoading(true);
    try {
      const userData = await getUserById(userId);
      setUser(userData);
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setUserLoading(false);
    }
  };

  const fetchProfile = async () => {
    if (!userId) return;
    setProfileLoading(true);
    try {
      const profileData = await getProfileByUserId(userId);
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      // Profile might not exist, don't show error message unless critical
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchPayments = async () => {
    if (!userId) return;
    setPaymentsLoading(true);
    try {
      const filters: any = {};
      if (paymentParams.filters?.type && paymentParams.filters.type.length > 0) {
        filters.type = paymentParams.filters.type[0];
      }

      const { data, total } = await getPaymentsByUserId(userId, {
        limit: paymentParams.limit,
        offset: (paymentParams.page - 1) * paymentParams.limit,
        ...filters
      });
      setPayments(data);
      setPaymentParams(prev => ({ ...prev, total }));
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setPaymentsLoading(false);
    }
  };





  useEffect(() => {
    if (userId) {
      fetchUser();
      fetchProfile();
      fetchPayments();

    }
  }, [userId, paymentParams.page, paymentParams.limit, JSON.stringify(paymentParams.filters)]);

  const handleEditProfile = () => {
    if (profile) {
      form.setFieldsValue(profile);
    } else {
      form.resetFields();
    }
    setIsProfileModalVisible(true);
  };

  const handleSubmitProfile = async () => {
    if (!userId) return;
    setActionLoading(true);
    try {
      const values = await form.validateFields();
      if (profile) {
        await updateProfile(userId, values);
        message.success('Profile updated successfully');
      } else {
        await createProfile({ ...values, userId });
        message.success('Profile created successfully');
      }
      setIsProfileModalVisible(false);
      fetchProfile();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setActionLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <div>User not found</div>;
  }

  const paymentColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (v: number) => `$${v.toFixed(2)}` },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'Deposit', value: 'deposit' },
        { text: 'Withdrawal', value: 'withdrawal' },
      ],
      filterMultiple: false,
    },
    { title: 'Method', dataIndex: 'method', key: 'method' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'green' : 'orange'}>{status}</Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
  ];





  const tabItems = [
    {
      key: 'profile',
      label: 'Profile',
      children: (
        <Spin spinning={profileLoading}>
          <Card
            title="Profile Information"
            extra={
              <Button icon={<EditOutlined />} onClick={handleEditProfile}>
                {profile ? 'Edit Profile' : 'Create Profile'}
              </Button>
            }
          >
            {profile ? (
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Phone">{profile.phone || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="ID Card">{profile.idCard || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Address" span={2}>
                  {profile.address || 'N/A'}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <p>No profile information available</p>
              </div>
            )}
          </Card>
        </Spin>
      ),
    },
    {
      key: 'payments',
      label: `Payments (${payments.length})`,
      children: (
        <Table
          columns={paymentColumns}
          dataSource={payments}
          rowKey="id"
          loading={paymentsLoading}
          pagination={{
            current: paymentParams.page,
            pageSize: paymentParams.limit,
            total: paymentParams.total,
          }}
          onChange={(pagination, filters, sorter) => {
            setPaymentParams(prev => ({
              ...prev,
              page: pagination.current || 1,
              limit: pagination.pageSize || 10,
              filters: filters,
            }));
          }}
        />
      ),
    },


  ];

  return (
    <div>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/users')} style={{ marginBottom: 16 }}>
        Back to Users
      </Button>
      <Card title="User Details" style={{ marginBottom: 24 }}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
          <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Amount">${user.amount.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={user.isDeleted ? 'red' : 'green'}>
              {user.isDeleted ? 'Deleted' : 'Active'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Created">
            {dayjs(user.createdAt).format('YYYY-MM-DD HH:mm')}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Tabs items={tabItems} />
      <Modal
        title={profile ? 'Edit Profile' : 'Create Profile'}
        open={isProfileModalVisible}
        onOk={handleSubmitProfile}
        confirmLoading={actionLoading}
        onCancel={() => setIsProfileModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="idCard" label="ID Card">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserDetails;
