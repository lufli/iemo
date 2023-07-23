import { useRouter } from 'next/router';
import { kv } from '@vercel/kv';
import {
  Button,
  Divider,
  Input,
  Row,
  Space,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export const getServerSideProps = async ({ req }) => {
  const token = req.headers?.cookie?.split('=')[1] || null;
  let user;

  if (token) {
    try {
      user = await kv.get(token);
    } catch (error) {
      console.error('Error caught:', error.message);
    }
  }

  if (user) {
    return {
      props: {
        token,
      },
    };
  }

  return {
    redirect: {
      destination: '/playground',
      permanent: false,
    },
  };
};

function Playground({ token }) {
  const router = useRouter();

  const onDelete = () => {
    const expirationDate = new Date('9999-12-31');
    const expires = `; expires=${expirationDate.toUTCString()}`;
    document.cookie = `token=${expires}; SameSite=Strict; path=/playground`;
    router.push('/playground');
  };

  return (
    <div style={{ width: '100%' }}>
      <Divider orientation="left">Playground</Divider>
      <Row type="flex" justify="center" align="middle" style={{ minHeight: '100px' }}>
        <Space.Compact>
          <Input value={token} addonBefore="Your Secret" disabled />
          <Button type="primary" htmlType="submit" icon={<DeleteOutlined />} onClick={onDelete} danger>Delete</Button>
        </Space.Compact>
      </Row>
    </div>
  );
}

export default Playground;
