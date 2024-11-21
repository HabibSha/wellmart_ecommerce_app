import { Outlet } from "react-router-dom";

// import Header from "../components/header/Header";
import Footer from "../components/Footer/Footer";

const Layout = () => {
  return (
    <div>
      {/* <Header /> */}
      <main className="pt-0 min-h-[calc(100vh)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
