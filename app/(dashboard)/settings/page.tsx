"use client";
import AutomationPage from "@/components/pages/settings/automation/AutomationPage";
import UserPage from "@/components/pages/settings/user/UserPage";
import StaffProfile from "@/components/pages/settings/user/StaffProfile";
import React, { useState } from "react";
import {
  Users,
  Settings as SettingsIcon,
  Zap,
  UserPlus,
  User,
} from "lucide-react";
import { useStaffStore } from "@/store/StaffStore";

type ActiveProp = {
  tab: "user" | "automation" | "profile";
};

const SettingsPage = () => {
  const { role } = useStaffStore();
  const [active, setActive] = useState<ActiveProp>({ tab: "user" });

  // Check if user is staff (not admin)
  const isStaff = role?.toLowerCase() === "staff";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg">
          {isStaff ? (
            <User className="w-8 h-8 text-white" />
          ) : (
            <SettingsIcon className="w-8 h-8 text-white" />
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {isStaff ? "My Profile" : "Settings & Configuration"}
          </h1>
          <p className="text-gray-600 text-lg">
            {isStaff
              ? "Manage your personal information and account settings"
              : "Manage your CRM system settings and preferences"}
          </p>
        </div>
      </div>

      {/* Conditional Content Based on Role */}
      {isStaff ? (
        // Staff Profile - No tabs, just show profile directly
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <StaffProfile />
        </div>
      ) : (
        // Admin Settings - Show tabs for full management
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActive({ tab: "user" })}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  active.tab === "user"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  User Management
                </div>
              </button>
              <button
                onClick={() => setActive({ tab: "automation" })}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  active.tab === "automation"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Automation
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {active.tab === "user" && <UserPage />}
            {active.tab === "automation" && <AutomationPage />}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
