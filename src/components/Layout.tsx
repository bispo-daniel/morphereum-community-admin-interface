import { Outlet } from "react-router-dom";

import Footer from "./Footer";
import Navigator from "./Navigator";

const Layout = () => {
  return (
    <div className="relative flex flex-col w-full min-h-screen">
      <Navigator />

      <div className="flex flex-col flex-1 h-full">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
