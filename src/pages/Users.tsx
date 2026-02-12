import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Space, Tag, Modal, Form, message, Popconfirm } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UndoOutlined } from '@ant-design/icons';
import { User } from '@/types';
import { getAllUsers, createUser, updateUser, deleteUser, restoreUser } from '@/api/users';
import { getErrorMessage } from '@/utils/error';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, total } = await getAllUsers({
        q: debouncedSearchText,
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize
      });
      setUsers(data);
      setPagination(prev => ({ ...prev, total }));
    } catch (error) {
      console.error(error);
      message.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearchText, pagination.current, pagination.pageSize]);

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: User) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    setActionLoading(true);
    try {
      await deleteUser(id);
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestore = async (id: number) => {
    setActionLoading(true);
    try {
      await restoreUser(id);
      message.success('User restored successfully');
      fetchUsers();
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
      if (editingUser) {
        await updateUser(editingUser.id, values);
        message.success('User updated successfully');
      } else {
        await createUser({
          ...values,
          amount: 0,
          isDeleted: false,
        });
        message.success('User created successfully');
      }
      setIsModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'isDeleted',
      key: 'isDeleted',
      render: (isDeleted: boolean) => (
        <Tag color={isDeleted ? 'red' : 'green'}>{isDeleted ? 'Deleted' : 'Active'}</Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/users/${record.id}`)}
            disabled={actionLoading}
          >
            View
          </Button>
          {!record.isDeleted && (
            <>
              <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} disabled={actionLoading}>
                Edit
              </Button>
              <Popconfirm
                title="Are you sure to delete this user?"
                onConfirm={() => handleDelete(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link" danger icon={<DeleteOutlined />} loading={actionLoading} disabled={actionLoading}>
                  Delete
                </Button>
              </Popconfirm>
            </>
          )}
          {record.isDeleted && (
            <Popconfirm
              title="Are you sure to restore this user?"
              onConfirm={() => handleRestore(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" icon={<UndoOutlined />} loading={actionLoading} disabled={actionLoading}>
                Restore
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>User Management</h1>
        <Space>
          <Input
            placeholder="Search users"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} disabled={actionLoading}>
            Add User
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={users}
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
        title={editingUser ? 'Edit User' : 'Add User'}
        open={isModalVisible}
        onOk={handleSubmit}
        confirmLoading={actionLoading}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter valid email' },
            ]}
          >
            <Input />
          </Form.Item>
          {!editingUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter password' }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          {editingUser && (
            <Form.Item name="amount" label="Amount">
              <Input type="number" prefix="$" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
