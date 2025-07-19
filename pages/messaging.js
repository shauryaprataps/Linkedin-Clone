import Image from "next/image";
import Header from "../components/Header";
import { useState } from "react";
import Head from "next/head";

export default function MessagingPage() {
  // Dummy conversation list for the left sidebar.
  const dummyConversations = [
    {
      id: 1,
      name: "LinkdIn",
      avatar:
        "data:image/png;base64,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", // Replace with your asset or image URL.
      lastMessage:
        "Reactivate your Premium subscription now and get 50% off 2 months...",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      name: "Dr. Apostolos Ampountolas",
      avatar:
        "data:image/jpeg;base64,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",
      lastMessage: "Looking forward to our meeting tomorrow.",
      timestamp: "Yesterday",
    },
    {
      id: 3,
      name: "John Doe",
      avatar:
        "data:image/jpeg;base64,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",
      lastMessage: "Can we schedule a call?",
      timestamp: "1 day ago",
    },
  ];

  // Dummy messages for the selected conversation.
  const dummyMessages = [
    {
      id: 1,
      sender: "LinkdIn",
      content:
        "Hi there, Aditya! Reactivate your Premium subscription now and get 50% off 2 months of LinkdIn Premium.",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      sender: "Aditya",
      content: "A discounted rate? Sure!",
      timestamp: "10:31 AM",
    },
  ];

  const [selectedConversation, setSelectedConversation] = useState(
    dummyConversations[0]
  );
  const [messages, setMessages] = useState(dummyMessages);
  const [newMessage, setNewMessage] = useState("");

  // Handler to simulate sending a new message.
  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const newMsg = {
        id: messages.length + 1,
        sender: "Aditya", // Hard-coded current user name.
        content: newMessage,
        timestamp: "Now",
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black">
      <Head>
        <title>Messaging | LinkdIn</title>
        <link rel="icon" href="/logos/LinkdIn_Icon.png" />
      </Head>
      <Header />
      <div className="max-w-7xl mx-auto p-4">
        {/* Grid layout: three panels using 12 columns on medium screens */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left Sidebar (Conversations) */}
          <div className="md:col-span-3 bg-white dark:bg-[#1D2226] rounded-md shadow overflow-auto">
            <h2 className="text-xl font-bold p-4 text-gray-900 dark:text-white">
              Messages
            </h2>
            <div>
              {dummyConversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`flex items-center p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer ${
                    selectedConversation.id === conv.id
                      ? "bg-gray-200 dark:bg-gray-700"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedConversation(conv);
                    // In a real app, fetch the messages for the selected conversation
                    // Here, we just keep the dummy messages.
                    setMessages(dummyMessages);
                  }}
                >
                  <Image
                    src={conv.avatar}
                    alt={conv.name}
                    width={128}
                    height={128}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4 flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {conv.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {conv.lastMessage}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {conv.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Middle Panel (Conversation Details) */}
          <div className="md:col-span-6 bg-white dark:bg-[#1D2226] rounded-md shadow flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedConversation.name}
              </h2>
            </div>
            <div className="flex-grow p-4 overflow-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "Aditya" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.sender === "Aditya"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <span className="text-xs block text-right text-gray-500 dark:text-gray-400">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar (Extra Panels) */}
          <div className="md:col-span-3 bg-white dark:bg-[#1D2226] rounded-md shadow p-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Page Inboxes
            </h2>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                LinkdIn Premium
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upgrade to LinkdIn Premium to see who viewed your profile and
                get access to more insights.
              </p>
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
