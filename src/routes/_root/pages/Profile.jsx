import React from "react";
import {
  SettingOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { List, Avatar } from "antd";

import { getCurrentUser } from "../../../lib/firebase/api";
import ThemeToggler from "../../../components/ThemeToggler";

const Profile = () => {
  const currentUser = getCurrentUser();

  const menuItems = [
    { icon: <ThemeToggler />, text: "Theme" },
    {icon: <SettingOutlined />,text: currentUser.displayName},
    { icon: <InfoCircleOutlined />, text: "About App" },
    { icon: <FileTextOutlined />, text: "Terms & Conditions" },
    { icon: <SafetyOutlined />, text: "Privacy Policy" },
  ];

  const handleItemClick = (text) => {
    // Redirect based on the clicked item's text
    switch (text) {
      case "About App":
        window.open("https://github.com/Absolute-oreZ/FitSense", "_blank");
        break;
      case "Terms & Conditions":
        window.open("/UserAgreement.html", "_blank");
        break;
      case "Privacy Policy":
        window.open("/PrivacyPolicy.html", "_blank");
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col items-center p-5 bg-white dark:bg-dark-4 text-black min-h-screen">
      <div className="flex justify-center flex-col items-center mb-6">
        <div className="relative">
          <Avatar size={80} src={currentUser.photoURL} />
          <div className="absolute bottom-0 right-0 bg-black rounded-full w-6 h-6 flex items-center justify-center">
            <SettingOutlined className="text-white" />
          </div>
        </div>
        <div className="text-center mt-3">
          <h2 className="text-lg dark:text-light-1 font-semibold">
            {currentUser.displayName}
          </h2>
          <p className="dark:text-light-2">{currentUser.email}</p>
        </div>
      </div>
      <div className="w-full max-w-md dark:bg-accent-dark bg-gray-100 rounded-lg">
        <List
          itemLayout="horizontal"
          dataSource={menuItems}
          size="large"
          renderItem={(item) => (
            <List.Item
              onClick={() => {
                if (item.text !== "Theme") {
                  handleItemClick(item.text);
                }
              }}
              className="p-10 border-b dark:text-white border-gray-200 last:border-b-0"
            >
              <List.Item.Meta
                className="cursor-pointer"
                avatar={item.icon}
                title={
                  <span className="ml-3 dark:text-white">{item.text}</span>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default Profile;
