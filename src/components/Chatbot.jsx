// import React, { useState, useRef, useEffect } from 'react';

// const Chatbot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       type: 'bot',
//       text: '👋 Hi! I\'m your Civic Assistant. How can I help you today?',
//       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       showQuickReplies: true
//     }
//   ]);
//   const [input, setInput] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef(null);

//   const quickReplies = [
//     { id: 1, text: '📝 How to report?', response: 'reportGuide' },
//     { id: 2, text: '📊 Check status', response: 'checkStatus' },
//     { id: 3, text: '❓ FAQs', response: 'faqs' },
//     { id: 4, text: '📍 Location help', response: 'locationHelp' }
//   ];

//   // Helper static responses - fallback or context guided
//   const responses = {
//     reportGuide: {
//       text: `📝 To report a civic issue:\n\n1. 🔐 Sign in to your account\n2. 📋 Fill the complaint form\n3. 📸 Upload issue photo\n4. 📍 Select location on map\n5. ✅ Submit complaint\n\n⏱️ Rate limit: 1 complaint per 5 minutes`,
//       showQuickReplies: true
//     },
//     checkStatus: {
//       text: '📊 To check your complaint status:\n\n1. Sign in to your account\n2. View your submitted complaints in dashboard\n3. Track status: Pending → In Progress → Resolved\n\n✅ Resolved complaints appear on Public Dashboard!',
//       showQuickReplies: true
//     },
//     faqs: {
//       text: '❓ Frequently Asked Questions:\n\n• ⏰ Review time: 24-48 hours\n• 🔐 Login required to prevent spam\n• 🛠️ Report: potholes, lights, garbage, etc.\n• 📝 Can\'t edit? Submit a new complaint\n• 📧 Updates sent to your email',
//       showQuickReplies: true
//     },
//     locationHelp: {
//       text: '📍 Location Troubleshooting:\n\n• Click "Use Current Location"\n• Allow browser permission\n• Or manually pin on map\n• Enable location services\n• Works best on HTTPS\n\n💡 Map opens automatically if GPS fails',
//       showQuickReplies: true
//     },
//     greeting: {
//       text: 'Hello! 👋 I\'m here to help with civic issues.\n\nWhat would you like to know?',
//       showQuickReplies: true
//     },
//     thanks: {
//       text: 'You\'re welcome! 🌟 Happy to help!\n\nAnything else?',
//       showQuickReplies: true
//     },
//     default: {
//       text: 'I can help you with:\n\n• 📝 Reporting issues\n• 📊 Checking status\n• ❓ FAQs\n• 📍 Location problems\n\nWhat do you need?',
//       showQuickReplies: true
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Your old intent detection logic as fallback
//   const detectIntent = (text) => {
//     const lowerText = text.toLowerCase();

//     if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
//       return 'greeting';
//     }
//     if (lowerText.includes('thank') || lowerText.includes('thanks')) {
//       return 'thanks';
//     }
//     if (lowerText.includes('report') || lowerText.includes('submit') || lowerText.includes('complaint')) {
//       return 'reportGuide';
//     }
//     if (lowerText.includes('status') || lowerText.includes('check') || lowerText.includes('track')) {
//       return 'checkStatus';
//     }
//     if (lowerText.includes('faq') || lowerText.includes('question') || lowerText.includes('how long')) {
//       return 'faqs';
//     }
//     if (lowerText.includes('location') || lowerText.includes('map') || lowerText.includes('gps')) {
//       return 'locationHelp';
//     }

//     return 'default';
//   };

//   // New function to call backend for AI reply
//   const sendMessageToAI = async (messageText) => {
//     try {
//       const response = await fetch('http://localhost:5000/api/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ message: messageText }),
//       });
//       if (!response.ok) {
//         throw new Error(`Error: ${response.status}`);
//       }
//       const data = await response.json();
//       return data.reply;
//     } catch (error) {
//       console.error('Failed to fetch AI response:', error);
//       return "Sorry, I couldn't process your request at the moment.";
//     }
//   };

//   const handleSend = async (messageText, isQuickReply = false, responseKey = null) => {
//     if (!messageText.trim() && !isQuickReply) return;

//     const userMessage = {
//       type: 'user',
//       text: messageText,
//       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInput('');
//     setIsTyping(true);

//     // Call AI backend to get response
//     let aiReplyText = await sendMessageToAI(messageText);

//     // If backend fails, fallback to local responses
//     if (!aiReplyText || aiReplyText.trim() === '') {
//       const intent = responseKey || detectIntent(messageText);
//       const response = responses[intent] || responses.default;
//       aiReplyText = response.text;
//     }

//     const botMessage = {
//       type: 'bot',
//       text: aiReplyText,
//       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       showQuickReplies: true
//     };

//     setMessages(prev => [...prev, botMessage]);
//     setIsTyping(false);
//   };

//   const handleQuickReply = (reply) => {
//     handleSend(reply.text, true, reply.response);
//   };

//   return (
//     <>
//       {/* Floating Chat Button */}
//       {!isOpen && (
//         <button
//           onClick={() => setIsOpen(true)}
//           className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white p-5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 animate-pulse"
//         >
//           <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
//           </svg>
//           <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></span>
//           <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"></span>
//         </button>
//       )}

//       {/* Chat Window */}
//       {isOpen && (
//         <div className="fixed bottom-8 right-8 z-50 w-full max-w-md h-[600px] bg-gradient-to-b from-gray-900 to-black border-2 border-blue-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 p-5 flex items-center justify-between shadow-lg">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm border border-white/30">
//                 🤖
//               </div>
//               <div>
//                 <h3 className="font-bold text-white text-lg">Civic Bot</h3>
//                 <div className="flex items-center gap-2">
//                   <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
//                   <p className="text-xs text-blue-100">Always here to help</p>
//                 </div>
//               </div>
//             </div>
//             <button
//               onClick={() => setIsOpen(false)}
//               className="text-white hover:bg-white/20 p-2 rounded-full transition-all"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>

//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-900/50 to-black/50">
//             {messages.map((msg, idx) => (
//               <div key={idx}>
//                 <div className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
//                   <div className={`max-w-[85%] rounded-2xl p-4 shadow-lg ${
//                     msg.type === 'user' 
//                       ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
//                       : 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 border border-gray-700'
//                   }`}>
//                     <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
//                     <p className="text-xs opacity-60 mt-2">{msg.time}</p>
//                   </div>
//                 </div>

//                 {/* Show quick replies after bot messages */}
//                 {msg.type === 'bot' && msg.showQuickReplies && idx === messages.length - 1 && !isTyping && (
//                   <div className="mt-3 ml-2">
//                     <p className="text-xs text-gray-400 mb-2 font-medium">Quick replies:</p>
//                     <div className="flex flex-wrap gap-2">
//                       {quickReplies.map(reply => (
//                         <button
//                           key={reply.id}
//                           onClick={() => handleQuickReply(reply)}
//                           className="text-xs bg-gradient-to-r from-blue-600/30 to-purple-600/30 hover:from-blue-600/50 hover:to-purple-600/50 text-white border border-blue-500/40 rounded-full py-2 px-4 transition-all transform hover:scale-105 hover:shadow-lg backdrop-blur-sm"
//                         >
//                           {reply.text}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}

//             {isTyping && (
//               <div className="flex justify-start">
//                 <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-4 shadow-lg">
//                   <div className="flex space-x-2">
//                     <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce"></div>
//                     <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
//                     <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input */}
//           <div className="p-4 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700">
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
//                 placeholder="Ask me anything..."
//                 className="flex-1 bg-gray-800 text-white border border-gray-600 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-gray-500"
//               />
//               <button
//                 onClick={() => handleSend(input)}
//                 disabled={!input.trim()}
//                 className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white p-3 rounded-2xl transition-all transform hover:scale-105 shadow-lg"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
//                 </svg>
//               </button>
//             </div>
//             <p className="text-xs text-gray-500 mt-2 text-center">Powered by AI • Always Learning</p>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Chatbot;

import React, { useState, useRef, useEffect } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "👋 I'm your Civic Assistant. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      showQuickReplies: true,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickReplies = [
    { id: 1, text: '📝 How to report?', response: 'reportGuide' },
    { id: 2, text: '📊 Check status', response: 'checkStatus' },
    { id: 3, text: '❓ FAQs', response: 'faqs' },
    { id: 4, text: '📍 Location help', response: 'locationHelp' },
  ];

  const responses = {
    reportGuide: {
      text: "📝 To report a civic issue:\n\n1. 🔐 Sign in to your account\n2. 📋 Fill the complaint form\n3. 📸 Upload issue photo\n4. 📍 Select location on map\n5. ✅ Submit complaint\n\n⏱️ Rate limit: 1 complaint per 5 minutes",
      showQuickReplies: true,
    },
    checkStatus: {
      text: "📊 To check your complaint status:\n\n1. Sign in to your account\n2. View your submitted complaints in dashboard\n3. Track status: Pending → In Progress → Resolved\n\n✅ Resolved complaints appear on Public Dashboard!",
      showQuickReplies: true,
    },
    faqs: {
      text: "❓ Frequently Asked Questions:\n\n• ⏰ Review time: 24-48 hours\n• 🔐 Login required to prevent spam\n• 🛠️ Report: potholes, lights, garbage, etc.\n• 📝 Can't edit? Submit a new complaint\n• 📧 Updates sent to your email",
      showQuickReplies: true,
    },
    locationHelp: {
      text: "📍 Location Troubleshooting:\n\n• Click 'Use Current Location'\n• Allow browser permission\n• Or manually pin on map\n• Enable location services\n• Works best on HTTPS\n\n💡 Map opens automatically if GPS fails",
      showQuickReplies: true,
    },
    default: {
      text: "I can help you with:\n\n• 📝 Reporting issues\n• 📊 Checking status\n• ❓ FAQs\n• 📍 Location problems\n\nWhat do you need?",
      showQuickReplies: true,
    },
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageToAI = async (message) => {
    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) throw new Error(`Network response was not ok ${response.statusText}`);
      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error("AI API call failed:", error);
      return "Sorry, I couldn't process your request right now.";
    }
  };

  // Optional: original intent detector for fallback
  const detectIntent = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes("hello") || lowerText.includes("hi")) return "greeting";
    if (lowerText.includes("thank")) return "thanks";
    if (lowerText.includes("report") || lowerText.includes("complaint")) return "reportGuide";
    if (lowerText.includes("status") || lowerText.includes("check")) return "checkStatus";
    if (lowerText.includes("faq") || lowerText.includes("question")) return "faqs";
    if (lowerText.includes("location") || lowerText.includes("gps")) return "locationHelp";
    return "default";
  };

  const handleSend = async (messageText, isQuickReply = false, responseKey = null) => {
    if (!messageText.trim() && !isQuickReply) return;

    const userMessage = {
      type: "user",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    let aiReply = await sendMessageToAI(messageText);

    if (!aiReply || aiReply.trim() === "") {
      const intent = responseKey || detectIntent(messageText);
      aiReply = responses[intent]?.text || responses.default.text;
    }

    const botMessage = {
      type: "bot",
      text: aiReply,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      showQuickReplies: true,
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleQuickReply = (reply) => {
    handleSend(reply.text, true, reply.response);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white p-5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 animate-pulse"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"></span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-8 right-8 z-50 w-full max-w-md h-[600px] bg-gradient-to-b from-gray-900 to-black border-2 border-blue-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 p-5 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm border border-white/30">
                🤖
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Civic Bot</h3>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <p className="text-xs text-blue-100">Always here to help</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-900/50 to-black/50">
            {messages.map((msg, idx) => (
              <div key={idx}>
                <div className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 shadow-lg ${
                      msg.type === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 border border-gray-700"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
                    <p className="text-xs opacity-60 mt-2">{msg.time}</p>
                  </div>
                </div>

                {msg.type === "bot" && msg.showQuickReplies && idx === messages.length - 1 && !isTyping && (
                  <div className="mt-3 ml-2">
                    <p className="text-xs text-gray-400 mb-2 font-medium">Quick replies:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickReplies.map((reply) => (
                        <button
                          key={reply.id}
                          onClick={() => handleQuickReply(reply)}
                          className="text-xs bg-gradient-to-r from-blue-600/30 to-purple-600/30 hover:from-blue-600/50 hover:to-purple-600/50 text-white border border-blue-500/40 rounded-full py-2 px-4 transition-all transform hover:scale-105 hover:shadow-lg backdrop-blur-sm"
                        >
                          {reply.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-4 shadow-lg">
                  <div className="flex space-x-2">
                    <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend(input)}
                placeholder="Ask me anything..."
                className="flex-1 bg-gray-800 text-white border border-gray-600 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-gray-500"
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white p-3 rounded-2xl transition-all transform hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Powered by AI • Always Learning</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;

