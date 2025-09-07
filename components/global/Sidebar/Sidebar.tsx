import React from "react";
import Nametag from "./Nametag";
import Menu from "./Menu";
import Settings from "./Settings";
import LogoutButton from "../Logout/LogoutButton";
import logo from "@/public/logo/Camptrek logo.jpg";
import Image from "next/image";

const Sidebar = () => {
  return (
    <div className="w-80 bg-white shadow-2xl border-r border-gray-100 h-screen overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-red-600 p-6 flex-shrink-0">
        <div className="flex flex-row items-center">
          <div className="w-12 h-12 border-2 border-white rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
            <Image
              src={logo}
              alt="Camptrek Logo"
              width={40}
              height={40}
              className="object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col ml-3">
            <h1 className="text-xl font-bold text-white mb-1">
              CAMPTREK SAFARIS
            </h1>
            <p className="text-white/90 text-sm">AFRICA IS A FEELING</p>
          </div>
        </div>
      </div>

      {/* Sidebar Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <Nametag />
          <Menu />
          <Settings />
        </div>
      </div>

      {/* Logout Button - Fixed at Bottom */}
      <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-white">
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;
