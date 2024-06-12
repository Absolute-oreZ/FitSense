import { Button, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { useLocation, Link, NavLink } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";

import { db } from "../lib/firebase/config";
import { fetchUserData, getCurrentUser } from "../lib/firebase/api";
import { sidebarLinks } from "../constants/index";
import "../index.css";

const LeftSideBar = ({ onSignOut }) => {
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);

  const fetchUserDataAsync = async () => {
    try {
      setIsLoading(true);
      const currentUser = getCurrentUser();
      setCurrentUser(currentUser);
      if (currentUser) {
        const uid = currentUser.uid;
        const userData = await fetchUserData(db, uid);
        setUserData(userData);
      } else {
        console.log("User data not found");
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDataAsync();
  }, []);

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/images/FitSense Logo 2.png"
            alt="logo"
            width={170}
            height={170}
          />
        </Link>

        {userData && currentUser && !isLoading ? (
          <Link to="/profile" className="flex gap-3 items-center">
            <img
              src={currentUser.photoURL}
              alt="profile"
              className="h-14 w-14 rounded-full"
            />
            <div className="flex flex-col">
              <p className="body-bold text-light-2">
                {currentUser.displayName}
              </p>
              <p className="tiny-medium overflow-x-hidden text-light-3">{currentUser.email}</p>
            </div>
          </Link>
        ) : (
          <Spin />
        )}

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link) => {
            const isActice = pathname === link.route;

            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActice && "bg-primary-500"
                }`}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4"
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    width={14}
                    height={14}
                    className={`${
                      isActice ? "" : "invert-white"
                    } group-hover:invert-slate-400`}
                  />
                  <p
                    className={`${
                      isActice ? "text-dark-4" : "text-light-2"
                    } group-hover:text-slate-400`}
                  >
                    {link.label}
                  </p>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <Button
        type="text"
        icon={<LogoutOutlined className="mt-1 mr-2" />}
        className="invert-white flex align-middle"
        onClick={onSignOut}
      >
        Log Out
      </Button>
    </nav>
  );
};

export default LeftSideBar;
