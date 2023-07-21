import { Analytics } from '@vercel/analytics/react';
import { ConfigProvider } from 'antd';
import Layout from '@/components/layout';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#43cc68',
        },
      }}
    >
      <Layout>
        <Component {...pageProps} />
        <Analytics />
      </Layout>
    </ConfigProvider>
  );
}
