import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Space, Tag, Modal, Form, message, Popconfirm, Select, DatePicker } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Payment } from '@/types';
import { getPayments, createPayment, updatePayment, deletePayment } from '@/api/payments';
import { getAllUsers } from '@/api/users';
import { getErrorMessage } from '@/utils/error';

import dayjs from 'dayjs';

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  // User Select States
  const [userList, setUserList] = useState<any[]>([]);
  const [userPagination, setUserPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [userSearchText, setUserSearchText] = useState('');
  const [userLoading, setUserLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [form] = Form.useForm();

  // Debounce search text
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
      // Reset to page 1 on search change
      setPagination(prev => ({ ...prev, current: 1 }));
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { data: paymentsData, total } = await getPayments({
        q: debouncedSearchText,
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize
      });
      setPayments(paymentsData);
      setPagination(prev => ({ ...prev, total }));
    } catch (error) {
      console.error(error);
      message.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [debouncedSearchText, pagination.current, pagination.pageSize]);

  // Fetch users for dropdown
  const fetchUserList = async (page = 1, search = '', append = false) => {
    setUserLoading(true);
    try {
      const { data, total } = await getAllUsers({
        page,
        limit: userPagination.pageSize,
        q: search,
      });

      if (append) {
        setUserList(prev => [...prev, ...data]);
      } else {
        setUserList(data);
      }

      setUserPagination(prev => ({ ...prev, current: page, total }));
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setUserLoading(false);
    }
  };

  // Handle user search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isModalVisible) {
        fetchUserList(1, userSearchText, false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [userSearchText, isModalVisible]);

  const handleUserPopupScroll = (e: any) => {
    const { target } = e;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      if (userList.length < userPagination.total) {
        fetchUserList(userPagination.current + 1, userSearchText, true);
      }
    }
  };

  const handleAdd = () => {
    setEditingPayment(null);
    form.resetFields();
    setIsModalVisible(true);
    // Initial fetch when opening modal
    fetchUserList(1, '', false);
  };

  const handleEdit = (record: Payment) => {
    setEditingPayment(record);
    form.setFieldsValue({
      ...record,
      transactionDate: dayjs(record.transactionDate),
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    setActionLoading(true);
    try {
      await deletePayment(id);
      message.success('Payment deleted successfully');
      fetchPayments();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async () => {
    setActionLoading(true);
    try {
      const values = await form.validateFields();
      const paymentData = {
        ...values,
        transactionDate: values.transactionDate.toISOString(),
      };

      if (editingPayment) {
        await updatePayment(editingPayment.id, paymentData);
        message.success('Payment updated successfully');
      } else {
        await createPayment(paymentData);
        message.success('Payment created successfully');
      }
      setIsModalVisible(false);
      fetchPayments();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
      render: (userId: number) => userId,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `$${amount.toFixed(2)}`,
      sorter: (a: Payment, b: Payment) => a.amount - b.amount,
    },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Method', dataIndex: 'method', key: 'method' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
          {status}
        </Tag>
      ),
      filters: [
        { text: 'Completed', value: 'completed' },
        { text: 'Pending', value: 'pending' },
        { text: 'Failed', value: 'failed' },
      ],
      onFilter: (value: any, record: Payment) => record.status === value,
    },
    {
      title: 'Transaction Date',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
      sorter: (a: Payment, b: Payment) =>
        dayjs(a.transactionDate).unix() - dayjs(b.transactionDate).unix(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Payment) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} disabled={actionLoading}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this payment?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />} loading={actionLoading} disabled={actionLoading}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];



  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0 }}>Payment Management</h1>
        <Space>
          <Input
            placeholder="Search payments"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} disabled={actionLoading}>
            Add Payment
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={payments}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
        }}
        onChange={(p) => {
          setPagination(prev => ({
            ...prev,
            current: p.current || 1,
            pageSize: p.pageSize || 10
          }));
        }}
      />
      <Modal
        title={editingPayment ? 'Edit Payment' : 'Add Payment'}
        open={isModalVisible}
        onOk={handleSubmit}
        confirmLoading={actionLoading}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="userId"
            label="User"
            rules={[{ required: true, message: 'Please select user' }]}
          >
            <Select
              showSearch
              placeholder="Select user"
              filterOption={false}
              onSearch={setUserSearchText}
              onPopupScroll={handleUserPopupScroll}
              loading={userLoading}
            >
              {userList.map((user) => (
                <Select.Option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: 'Please enter amount' }]}
          >
            <Input type="number" prefix="$" step="0.01" />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Please select type' }]}
          >
            <Select>
              <Select.Option value="deposit">Deposit</Select.Option>
              <Select.Option value="withdrawal">Withdrawal</Select.Option>
              <Select.Option value="refund">Refund</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="method" label="Method">
            <Select>
              <Select.Option value="credit_card">Credit Card</Select.Option>
              <Select.Option value="bank_transfer">Bank Transfer</Select.Option>
              <Select.Option value="paypal">PayPal</Select.Option>
              <Select.Option value="crypto">Cryptocurrency</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
              <Select.Option value="failed">Failed</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="referenceNumber" label="Reference Number">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="transactionDate"
            label="Transaction Date"
            rules={[{ required: true, message: 'Please select date' }]}
          >
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Payments;
