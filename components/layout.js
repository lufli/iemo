import Navbar from './navigation';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ width: '80%', margin: 'auto' }}>{children}</main>
    </>
  );
}
