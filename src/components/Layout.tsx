import { ReactNode } from "react";
import TopBar from "./TopBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AnnouncementTicker from "./AnnouncementTicker";
import EECChatWidget from "./EECChatWidget";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-50">
        <TopBar />
        <Navbar />
        <AnnouncementTicker />
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
      <EECChatWidget />
    </div>
  );
};

export default Layout;
