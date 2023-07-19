import { Analytics } from '@vercel/analytics/react';
import Layout from '@/components/layout';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
      <Analytics />
    </Layout>
  );
}
