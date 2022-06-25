import Link from 'next/link';

const Header = () => {
  return (
    <header>
      <Link href='/'>
        <img src='/ZMTLogo.png' />
      </Link>
    </header>
  );
};

export default Header;
