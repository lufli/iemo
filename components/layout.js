import Navbar from './navigation';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ margin: 'auto', width: '80%' }}>{children}</main>
    </>
  );
}
