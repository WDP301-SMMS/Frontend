import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Header";
import { Footer } from "~/libs/components/layout/Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Sidebar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
