import { Outlet } from 'react-router-dom';
import NavbarMain from './NavbarMain';
import FooterMain from './FooterMain';

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarMain />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <FooterMain />
    </div>
  );
}

export default Layout; 