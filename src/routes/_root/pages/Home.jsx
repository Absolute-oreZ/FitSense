import React, { useState } from "react";
import run from "../../../lib/geminiAI/config";
import {
  FileImageOutlined,
  LoadingOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Input, Spin } from "antd";
import { getCurrentUser } from "../../../lib/firebase/api";
import SuggestionQuestion from "../../../components/SuggestionQuestion";

const { TextArea } = Input;

const Home = () => {
  const [input, setInput] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const currentUser = getCurrentUser();

  // Handles sending the user's input to the chatbot.
  // Adds the user's input to the conversation history,
  // calls the chatbot API, formats the response, and updates the conversation history accordingly.
  const onSent = async () => {
    if (!input.trim()) return; // Don't send if input is empty or whitespace

    // Add the user's input to the conversation history
    setConversationHistory((prevHistory) => [
      ...prevHistory,
      { sender: "user", message: input },
    ]);

    setLoading(true);
    const response = await run(input);
    let formattedResponse = formatResponse(response);
    setInput("");

    // Add the chatbot's response to the conversation history
    setConversationHistory((prevHistory) => [
      ...prevHistory,
      { sender: "chatbot", message: formattedResponse },
    ]);

    setLoading(false);
    setShowResult(true);
  };

  // Formats the chatbot's response to include HTML markup for bold text and line breaks.
  const formatResponse = (response) => {
    let responseArray = response.split("**");
    let formattedResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        formattedResponse += responseArray[i];
      } else {
        formattedResponse += "<b>" + responseArray[i] + "</b>";
      }
    }
    formattedResponse = formattedResponse.split("*").join("</br>");
    return formattedResponse;
  };

  // Handles the keydown event for the input textarea.
  // If Enter is pressed without Shift, it prevents default behavior and calls onSent.
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default behavior of Enter key
      onSent();
    }
  };

  // Handles the click event for suggestion questions.
  // Sets the input to the selected question when clicked.
  const handleSuggestionClick = async (question) => {
    setInput(question); // Set input to the selected question
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between">
      <div className="w-full flex flex-col h-screen">
        <div className="p-4 flex-1 overflow-y-auto">
          {!showResult ? (
            <>
              <div className="mb-4">
                <p>Hello, {currentUser.displayName}.</p>
                <p>How can I help you today?</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SuggestionQuestion
                  question="How to lose 2kg in a week?"
                  onClick={() =>
                    handleSuggestionClick("How to lose 2kg in a week?")
                  }
                />
                <SuggestionQuestion
                  question="How many times do I need to exercise per week?"
                  onClick={() =>
                    handleSuggestionClick(
                      "How many times do I need to exercise per week?"
                    )
                  }
                />
                <SuggestionQuestion
                  question="What is the best nutrition intake for a 12 years old kid?"
                  onClick={() =>
                    handleSuggestionClick(
                      "What is the best nutrition intake for a 12 years old kid?"
                    )
                  }
                />
                <SuggestionQuestion
                  question="What are the range of BMI?"
                  onClick={() =>
                    handleSuggestionClick("What are the range of BMI?")
                  }
                />
              </div>
            </>
          ) : (
            <div className="p-4 overflow-auto">
              {conversationHistory.map((message, index) => (
                <div key={index} className="flex items-center mb-4">
                  <img
                    src={
                      message.sender === "user"
                        ? currentUser.photoURL
                        : "/icons/FitSense Logo.png"
                    }
                    alt={
                      message.sender === "user"
                        ? "User Avatar"
                        : "Chatbot Avatar"
                    }
                    className="w-8 h-8 rounded-full mr-2 self-start"
                  />
                  <div
                    dangerouslySetInnerHTML={{
                      __html: message.message,
                    }}
                  ></div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="left-4 mb-20 xl:mb-0 w-auto flex items-center bg-white border rounded-xl p-2">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your question here"
            autoSize={{ minRows: 1 }}
            className="border-none focus:ring-0 flex-1 max-h-[200px] overflow-y-auto"
            onKeyDown={handleInputKeyDown}
          />
          {loading ? (
            <LoadingOutlined />
          ) : (
            <button onClick={onSent} className="border-none bg-transparent">
              <SendOutlined className="text-black" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
