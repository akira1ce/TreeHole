import { colors, drawerPlacement, drawerTitles, roles } from '@/constants';
import userManage from '@/locales/en-US/userManage';
import { IUser, IUserActionType } from '@/models/user/types';
import { IGetUserListParams, IRemoveByIdParams } from '@/services/user';
import getLocalMap from '@/utils/getLocalMap';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Drawer, Form, Input, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { connect, FormattedMessage, useIntl } from 'umi';
import UserForm from './components/UserForm';
import { IHomePorps } from './types';

const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: IUser[]) => {},
};

const HomePage: React.FC<IHomePorps> = ({ user, dispatch }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');
  const [params, SetParams] = useState<IGetUserListParams>({
    pageNo: 1,
    limit: 10,
    name: '',
  });

  const localMap = getLocalMap(intl, userManage);

  const columns: ColumnsType<IUser> = [
    {
      title: localMap['userManage.account'],
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: intl.formatMessage({ id: 'userManage.location' }),
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: intl.formatMessage({ id: 'userManage.name' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: intl.formatMessage({ id: 'userManage.role' }),
      dataIndex: 'role',
      key: 'role',
      render: (_, { role }) => {
        return <Tag color={colors[Number(role)]}>{roles[Number(role)]}</Tag>;
      },
    },
    {
      title: intl.formatMessage({ id: 'userManage.status' }),
      dataIndex: 'status',
      key: 'status',
      render(_, { status }) {
        const isOpen = status === true;
        return <Tag color={isOpen ? '#87d068' : '#f50'}>{isOpen ? '启用' : '禁用'}</Tag>;
      },
    },
    {
      title: intl.formatMessage({ id: 'userManage.oprator' }),
      dataIndex: 'handle',
      align: 'center',
      width: 200,
      render: (text, record, index) => {
        return (
          <Space>
            <Button
              type="primary"
              danger
              onClick={() => {
                handleDel(record);
              }}
              icon={<DeleteOutlined />}
            ></Button>
            <Button
              type="primary"
              onClick={() => {
                handleDrawer(true, 2, record);
              }}
              icon={<EditOutlined />}
            ></Button>
          </Space>
        );
      },
    },
  ];

  /**
   *
   * @param open boolean 打开关闭
   * @param mode number ['','ADD','UPDATE']
   * @param record IUser 选中行
   * @returns
   */
  const handleDrawer = (open: boolean, mode?: number, record?: IUser) => {
    setDrawerOpen(open);
    !open && form.resetFields();
    mode && setMode(mode);
    console.log(record);
    mode == 2 && form.setFieldsValue({ ...record });
  };

  /** form save */
  const handleSave = async () => {
    const field: IUser = form.getFieldsValue();
    mode == 2 && (await modifyById(field));
    mode == 1 && (await register(field));
    SetParams({ ...params });
    handleDrawer(false);
  };

  /** C */
  async function register(payload: IUser) {
    dispatch<IUserActionType, IUser>({
      type: 'user/register',
      payload,
    });
  }

  /** U */
  async function modifyById(payload: IUser) {
    dispatch<IUserActionType, IUser>({
      type: 'user/modifyById',
      payload,
    });
  }

  /** R */
  function getUserList(payload: IGetUserListParams) {
    dispatch<IUserActionType, IGetUserListParams>({
      type: 'user/getUserList',
      payload,
    });
  }

  const handleSearch = () => {
    SetParams({ ...params, name: searchText });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  /**
   *
   * @param pageNo 页码
   * @param limit
   */
  const handlePagination = (pageNo: number, limit: number) => {
    SetParams({ ...params, pageNo, limit });
  };

  /** D */
  async function removeById(payload: IRemoveByIdParams) {
    dispatch<IUserActionType, IRemoveByIdParams>({
      type: 'user/removeById',
      payload,
    });
  }

  /** delete item */
  const handleDel = async (record: any) => {
    const { _id } = record;
    await removeById({ _id });
    SetParams({ ...params });
  };

  useEffect(() => {
    getUserList(params);
  }, [params]);

  return (
    <PageContainer ghost>
      {/* form */}
      <Drawer
        width={450}
        title={drawerTitles[mode]}
        placement={drawerPlacement}
        onClose={() => {
          handleDrawer(false);
        }}
        open={drawerOpen}
        footer={
          <Space>
            <Button onClick={() => {}}>
              <FormattedMessage id="userManage.reset" />
            </Button>
            <Button type="primary" onClick={handleSave}>
              <FormattedMessage id="userManage.save" />
            </Button>
          </Space>
        }
        footerStyle={{ display: 'flex', justifyContent: 'flex-end' }}
      >
        <UserForm form={form} mode={mode} />
      </Drawer>
      {/* table tools */}
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Space>
          {/* search */}
          <Input placeholder="input name" allowClear onChange={handleSearchChange} />
          <Button type="primary" onClick={handleSearch}>
            <FormattedMessage id="userManage.search" />
          </Button>
          {/* add */}
          <Button
            type="primary"
            onClick={() => {
              handleDrawer(true, 1);
            }}
          >
            <FormattedMessage id="userManage.add" />
          </Button>
        </Space>
        {/* table */}
        <Table
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          rowKey="_id"
          bordered
          dataSource={user.list}
          columns={columns}
          pagination={{
            showSizeChanger: true,
            current: params.pageNo,
            pageSize: params.limit,
            total: user.count,
            onChange: handlePagination,
          }}
        />
      </Space>
    </PageContainer>
  );
};

export default connect(({ user }: any) => ({ user }))(HomePage);
