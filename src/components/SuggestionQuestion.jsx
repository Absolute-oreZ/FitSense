import React from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";

const SuggestionQuestion = ({ question, onClick }) => {
  return (
    <div
      className="dark:bg-accent-dark text-black dark:text-light-2 border rounded-md p-4 cursor-pointer hover:bg-gray-100 transition duration-300"
      onClick={onClick}
    >
      <QuestionCircleOutlined className="text-dark-1 mr-2" />
      <p className="text-dark-1">{question}</p>
    </div>
  );
};

export default SuggestionQuestion;
