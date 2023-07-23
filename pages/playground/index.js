import { kv } from '@vercel/kv';
import {
  Button,
  Divider,
  Input,
  Row,
  Space,
} from 'antd';

export const getServerSideProps = async ({ req }) => {
  const token = req.headers?.cookie?.split('=')[1];
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
      redirect: {
        destination: `/playground/${token}`,
        permanent: false,
      },
      props: {
        token,
      },
    };
  }
  return { props: {} };
};

function Playground() {
  const onSubmit = async () => {
    const expirationDate = new Date('9999-12-31');
    const expires = `; expires=${expirationDate.toUTCString()}`;

    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        Cookies: document.cookie,
      },
      credentials: 'same-origin',
    });

    const data = await response.json();

    if (data.token) {
      document.cookie = `token=${data.token}${expires}; SameSite=Strict; path=/playground`;
      window.location.href = `${window.location}/${data.token}`;
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <Divider orientation="left">Playground</Divider>
      <Row type="flex" justify="center" align="middle" style={{ minHeight: '100px' }}>
        <Space.Compact>
          <Input addonBefore="Your Secret" disabled />
          <Button type="primary" htmlType="submit" onClick={onSubmit}>Submit</Button>
        </Space.Compact>
      </Row>
    </div>
  );
}

export default Playground;
