import React, { useState } from "react";
import { Button, Checkbox, DatePicker, Form, Input, Select, Spin } from "antd";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { passwordValidator, ageValidator } from "../../../lib/validation/index";
import { signUp } from "../../../lib/firebase/api";
import { auth, db } from "../../../lib/firebase/config";

const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { Option } = Select;
  const navigate = useNavigate();

  const formItemLayout = {
    labelCol: { span: 24 }, // Set label to span the full width on small devices
    wrapperCol: { span: 24 }, // Set input wrapper to span the full width on small devices
  };

  const tailFormItemLayout = {
    wrapperCol: { span: 24 }, // Set button wrapper to span the full width on small devices
  };

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      setIsLoading(true);
      const { email, password, nickname, dob, intro, gender } = values;
      const account = { email, password, nickname, dob, intro, gender };
      await signUp(auth, account, db);
      navigate("/");
    } catch (error) {
      toast.error(
        "This email has been used to register an Account! Try another email...",
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen overflow-x-hidden">
      <div className="flex flex-col gap-4 px-4 sm:px-8 md:px-16 max-w-xl">
        <div className="flex items-center justify-center gap-4">
          <img
            src="/icons/FitSense Logo.png"
            alt="Logo"
            className="w-10 sm:w-12 md:w-16"
          />
          <h1 className="text-xl md:text-2xl">FitSense</h1>
        </div>
        <p className="text-center">To Use FitSense, Create An Account</p>
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          className="dark:text-white dark:bg-darkbkg mb-4 flex-col items-center justify-center"
          scrollToFirstError
          style={{ color: "white" }}
        >
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ validator: passwordValidator }]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="nickname"
            label="Nickname"
            tooltip="What do you want us to call you?"
            rules={[
              {
                required: true,
                message: "Please input your nickname!",
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="dob"
            label="Date Of Birth"
            rules={[
              {
                validator: ageValidator,
              },
            ]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              placeholder="DD/MM/YYYY"
              allowClear={false}
              style={{
                width: "100%",
              }}
              disabledDate={(current) =>
                current && current > moment().endOf("day")
              }
            />
          </Form.Item>

          <Form.Item
            name="intro"
            label="Intro"
            tooltip="A short introduction helps us deliver better health consultancy"
            rules={[
              {
                required: true,
                message: "Please input Intro",
              },
            ]}
          >
            <Input.TextArea showCount maxLength={500} />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Gender"
            rules={[
              {
                required: true,
                message: "Please select gender!",
              },
            ]}
          >
            <Select placeholder="select your gender">
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            className="text-center"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error("Should accept agreement")),
              },
            ]}
            {...tailFormItemLayout}
          >
            <Checkbox>
              I have read the{" "}
              <a target="_blank" href="UserAgreement.html">
                agreement
              </a>
            </Checkbox>
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full dark:bg-rose-400 bg-rose-400 hover:bg-rose-500"
              disabled={isLoading}
            >
              {isLoading ? <Spin /> : "Register"}
            </Button>
            <div className="flex justify-center items-center">
              <span className="text-slate-500">Already have an account?</span>
              <Button
                className="border-none hover:border-none text-blue-700"
                onClick={() => navigate("/sign-in")}
                disabled={isLoading}
              >
                Sign In
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignupForm;
