import { Link } from 'react-router-dom';
import { Button } from 'antd';

function Header() {
  return (
    <header>
      <nav>
        <Link to="/">Главная</Link>
        <Link to="/about">О нас</Link>
        <Link to="/register">
          <Button color="pink" variant="solid">Signup</Button>
        </Link>
        <Link to="/login">
          <Button>Signin</Button>
        </Link>
      </nav>
    </header>
  );
}

export default Header;
