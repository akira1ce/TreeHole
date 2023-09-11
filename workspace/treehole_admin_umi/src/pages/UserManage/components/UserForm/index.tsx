import { roles } from '@/constants';
import { IUser } from '@/models/user/types';
import { Form, Input, Radio, Switch } from 'antd';
import React from 'react';

interface IUserFormProps {
  form: any;
  mode: number;
}

const UserForm: React.FC<IUserFormProps> = ({ form, mode }) => {
  return (
    <Form
      name="basic"
      form={form}
      labelCol={{ span: 6 }}
      labelAlign="left"
      wrapperCol={{ span: 18 }}
      style={{ maxWidth: 600, padding: '0 10px' }}
      initialValues={{ avator: 'https://s2.loli.net/2023/02/28/PtfNEqQHhxTcAbk.png', role: '0', status: true }}
      autoComplete="off"
    >
      {mode == 2 && (
        <Form.Item<IUser> label="id" name="_id">
          <Input disabled />
        </Form.Item>
      )}
      <Form.Item<IUser> label="avator" name="avator">
        <Input disabled />
      </Form.Item>
      <Form.Item<IUser> label="name" name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
        <Input />
      </Form.Item>
      <Form.Item<IUser> label="account" name="account" rules={[{ required: true, message: 'Please input your account!' }]}>
        <Input disabled={mode == 2} />
      </Form.Item>
      <Form.Item<IUser> label="password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item<IUser> label="location" name="location" rules={[{ required: true, message: 'Please input your location!' }]}>
        <Input />
      </Form.Item>
      <Form.Item<IUser> label="role" name="role">
        <Radio.Group>
          <Radio value="0">{roles[0]}</Radio>
          <Radio value="1">{roles[1]}</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item<IUser> label="status" name="status" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 16, span: 8 }}></Form.Item>
    </Form>
  );
};

export default UserForm;
