import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Footer from '../components/footer';
import Header from '../components/header';
import Cart from '../components/cart';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
