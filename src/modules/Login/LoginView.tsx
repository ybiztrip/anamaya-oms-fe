import { Button, Card, Form, Image, Input, Layout, Row } from 'antd';
import { Link } from 'react-router-dom';

import AnamayaLogo from '@/assets/anamaya.webp';
import Background from '@/assets/background.jpg'; // <-- add this
import { HOME_PATH } from '@/constants/routePath';

import useLogin from './hooks/useLogin';

function Login() {
  const props = useLogin();
  const { isLoading, form, login } = props;

  return (
    <Layout>
      <div
        className="flex justify-center items-center h-screen bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)), url(${Background})`,
        }}
      >
        <Card
          className="w-96"
          style={{
            width: '90%',
            maxWidth: 400,
          }}
        >
          <Link to={HOME_PATH}>
            <div className="text-center mb-8">
              <Image src={AnamayaLogo} width={200} preview={false} />
            </div>
          </Link>

          <Form
            layout="vertical"
            form={form}
            onFinish={login}
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, whitespace: true }]}
            >
              <Input placeholder="Username" size="large" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, whitespace: true }]}
            >
              <Input placeholder="Password" size="large" type="password" />
            </Form.Item>

            <Row justify="end">
              <Form.Item>
                <Button type="primary" size="large" htmlType="submit" loading={isLoading}>
                  Login
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </Card>
      </div>
    </Layout>
  );
}

export default Login;
