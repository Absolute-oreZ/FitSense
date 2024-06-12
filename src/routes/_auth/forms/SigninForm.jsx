import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../ant-custom-dark.css";

import { signIn } from "../../../lib/firebase/api";

const SignInForm = ({ setUser }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // State to toggle dark mode

  const onFinish = async (values) => {
    try {
      setIsLoading(true);
      const { email, password } = values;
      const user = await signIn(email, password);
      if (user) {
        setUser(user);
        navigate("/");
      }
    } catch (error) {
      toast.error("Wrong username or password!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex justify-center items-center min-h-screen ${
        isDarkMode ? "dark" : ""
      }`}
    >
      <div className="flex flex-col gap-4 p-4 sm:p-8 md:p-16 w-full max-w-md">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center gap-4">
            <img
              src="/icons/FitSense Logo.png"
              alt="Logo"
              className="w-10 sm:w-12 md:w-16"
            />
            <h1 className="text-lg sm:text-xl md:text-2xl">FitSense</h1>
          </div>
          <p className="text-center">Welcome Back! Sign In to Continue</p>
        </div>
        <Form
          name="normal_login"
          className="login-form border-none"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          scrollToFirstError
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="user@gmail.com"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item className="flex items-center text-center justify-center">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a className="login-form-forgot" href="/">
              Forgot password
            </a>
          </Form.Item>
          <Form.Item className="w-full">
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button w-full bg-rose-400 hover:bg-rose-500"
              disabled={isLoading}
            >
              {isLoading ? <Spin /> : "Log In"}
            </Button>
            <div className="flex justify-center items-center mt-1">
              <p className="text-slate-500 ">Don't have an account yet?</p>
              <Button
                className="hover:border-none border-none dark:bg-dark-4 hover:dark:bg-dark-4 text-blue-700"
                onClick={() => navigate("/sign-up")}
                disabled={isLoading}
              >
                Sign Up
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignInForm;
