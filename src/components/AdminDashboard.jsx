import React, { useState } from "react";
import AnimatedTitle from "./AnimatedTitle";
import { sendStatusUpdateEmail } from '../components/emailService.js';

const AdminDashboard = ({ isOpen, onClose, complaints, onUpdateStatus }) => {
  const [activeTab, setActiveTab] = useState("pending");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [expandedCount, setExpandedCount] = useState(2);

  const handleStatusUpdate = async (complaintId, newStatus) => {
    const complaint = complaints.find(c => c.id === complaintId);
    
    // Update status in database
    await onUpdateStatus(complaintId, newStatus);
    
    // Send email notification
    if (complaint?.userEmail) {
      await sendStatusUpdateEmail(complaint.userEmail, {
        id: complaintId,
        status: newStatus,
        description: complaint.description
      });
      alert(`✅ Status updated to "${newStatus}" and email sent to ${complaint.userEmail}!`);
    } else {
      alert(`✅ Status updated to "${newStatus}"`);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid credentials!");
    }
  };

  const pendingComplaints = complaints.filter(c => c.status === "Pending");
  const inProgressComplaints = complaints.filter(c => c.status === "In Progress");
  const resolvedComplaints = complaints.filter(c => c.status === "Resolved");

  const getDisplayedComplaints = () => {
    const activeComplaints = 
      activeTab === "pending" ? pendingComplaints :
      activeTab === "inProgress" ? inProgressComplaints :
      resolvedComplaints;
    
    return activeComplaints.slice(0, expandedCount);
  };

  const getCurrentTabComplaints = () => {
    return activeTab === "pending" ? pendingComplaints :
           activeTab === "inProgress" ? inProgressComplaints :
           resolvedComplaints;
  };

  if (!isOpen) return null;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-blue-50 text-4xl hover:text-red-500 transition-colors z-[101]"
        >
          ✕
        </button>

        <div className="relative bg-black border-2 border-blue-500/30 rounded-3xl p-10 w-full max-w-md backdrop-blur-xl shadow-2xl">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <p className="font-general text-[10px] uppercase tracking-widest text-blue-300 mb-2">
                Admin Access
              </p>
              <h2 className="text-4xl font-bold text-blue-50 mb-2">
                Secure Login
              </h2>
              <p className="text-sm text-gray-400">
                Enter admin credentials to continue
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-medium mb-2 text-blue-100 uppercase tracking-wide">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-blue-500/30 rounded-xl text-blue-50 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="admin"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-2 text-blue-100 uppercase tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-blue-500/30 rounded-xl text-blue-50 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                Access Dashboard
              </button>
            </form>

            <p className="mt-6 text-xs text-center text-gray-500">
              Default: admin / admin123
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black">
      <div className="min-h-screen py-10 px-4">
        <button
          onClick={onClose}
          className="fixed top-8 right-8 text-blue-50 text-4xl hover:text-red-500 transition-colors z-[101] bg-black/50 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center"
        >
          ✕
        </button>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="font-general text-[10px] uppercase tracking-widest text-blue-300 mb-2">
              Admin Panel
            </p>
            <AnimatedTitle
              title="Complaints Dashboard"
              className="special-font !text-5xl !font-black !leading-[.9] text-blue-50"
            />
            <p className="mt-4 text-gray-400">Manage and track all civic issue reports • Email notifications enabled</p>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => {
                setActiveTab("pending");
                setExpandedCount(2);
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "pending"
                  ? "bg-gradient-to-r from-yellow-600 to-orange-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              Pending ({pendingComplaints.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("inProgress");
                setExpandedCount(2);
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "inProgress"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              In Progress ({inProgressComplaints.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("resolved");
                setExpandedCount(2);
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "resolved"
                  ? "bg-gradient-to-r from-green-600 to-teal-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              Resolved ({resolvedComplaints.length})
            </button>
          </div>

          <div className="grid gap-6">
            {getDisplayedComplaints().length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-xl">No {activeTab} complaints</p>
              </div>
            ) : (
              getDisplayedComplaints().map((complaint) => (
                <div
                  key={complaint.id}
                  className="bg-gradient-to-br from-gray-900 to-black border-2 border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/40 transition-all shadow-xl"
                >
                  <div className="flex gap-6">
                    {complaint.photoUrl && (
                      <img
                        src={complaint.photoUrl}
                        alt="Issue"
                        className="w-48 h-48 object-cover rounded-xl border-2 border-blue-500/30"
                      />
                    )}

                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-blue-50 mb-2">
                            Complaint #{complaint.id}
                          </h3>
                          <p className="text-gray-300">{complaint.description}</p>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            complaint.status === "Resolved"
                              ? "bg-green-500/20 text-green-300 border border-green-500/40"
                              : complaint.status === "In Progress"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                              : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
                          }`}
                        >
                          {complaint.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Location:</span>
                          <p className="text-gray-300">{complaint.location}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Date:</span>
                          <p className="text-gray-300">{complaint.date}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">User Email:</span>
                          <p className="text-gray-300">{complaint.userEmail || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">User ID:</span>
                          <p className="text-gray-300 text-xs">{complaint.userId?.substring(0, 8) || 'N/A'}...</p>
                        </div>
                      </div>

                      <div className="flex gap-4 items-center">
                        <select
                          value={complaint.status}
                          onChange={(e) => handleStatusUpdate(complaint.id, e.target.value)}
                          className="px-4 py-2 bg-gray-800 text-blue-50 border border-blue-500/30 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>

                        {complaint.coordinates && (
                          <a
                            href={`https://www.google.com/maps?q=${complaint.coordinates.lat},${complaint.coordinates.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-500 hover:to-teal-500 transition-all font-semibold"
                          >
                            📍 View on Map
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {getCurrentTabComplaints().length > expandedCount && (
            <div className="text-center mt-8">
              <button
                onClick={() => setExpandedCount(prev => prev + 5)}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-semibold transition-all"
              >
                View More ({getCurrentTabComplaints().length - expandedCount} remaining)
              </button>
            </div>
          )}

          {expandedCount > 2 && getCurrentTabComplaints().length > 2 && (
            <div className="text-center mt-4">
              <button
                onClick={() => setExpandedCount(2)}
                className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-semibold transition-all"
              >
                Collapse
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


// import React, { useState } from "react";
// import AnimatedTitle from "./AnimatedTitle";
// import { sendStatusUpdateEmail } from '../components/emailService';

// const AdminDashboard = ({ isOpen, onClose, complaints, onUpdateStatus }) => {
//   const [activeTab, setActiveTab] = useState("pending");
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [expandedCount, setExpandedCount] = useState(2);

//   const handleStatusUpdate = async (complaintId, newStatus) => {
//     console.log('🔍 Starting status update...');
//     console.log('Complaint ID:', complaintId);
//     console.log('New Status:', newStatus);
    
//     const complaint = complaints.find(c => c.id === complaintId);
//     console.log('Found complaint:', complaint);
    
//     if (!complaint) {
//       alert('❌ Complaint not found!');
//       return;
//     }
    
//     console.log('User email:', complaint.userEmail);
    
//     // Update status in database
//     await onUpdateStatus(complaintId, newStatus);
//     console.log('✅ Status updated in Firebase');
    
//     // Send email notification
//     if (complaint.userEmail) {
//       console.log('📧 Attempting to send email...');
//       console.log('Email data:', {
//         to: complaint.userEmail,
//         id: complaintId,
//         status: newStatus,
//         description: complaint.description
//       });
      
//       try {
//         const result = await sendStatusUpdateEmail(complaint.userEmail, {
//           id: complaintId,
//           status: newStatus,
//           description: complaint.description
//         });
        
//         console.log('✅ Email send result:', result);
//         alert(`✅ Status updated to "${newStatus}" and email sent to ${complaint.userEmail}!`);
//       } catch (error) {
//         console.error('❌ Email send error:', error);
//         console.error('Error details:', error.message, error.stack);
//         alert(`⚠️ Status updated but email failed:\n${error.message}\n\nCheck console for details.`);
//       }
//     } else {
//       console.warn('⚠️ No user email found');
//       alert(`⚠️ Status updated to "${newStatus}" but no user email found!`);
//     }
//   };

//   const handleLogin = (e) => {
//     e.preventDefault();
//     if (username === "admin" && password === "admin123") {
//       setIsAuthenticated(true);
//     } else {
//       alert("Invalid credentials!");
//     }
//   };

//   const pendingComplaints = complaints.filter(c => c.status === "Pending");
//   const inProgressComplaints = complaints.filter(c => c.status === "In Progress");
//   const resolvedComplaints = complaints.filter(c => c.status === "Resolved");

//   const getDisplayedComplaints = () => {
//     const activeComplaints = 
//       activeTab === "pending" ? pendingComplaints :
//       activeTab === "inProgress" ? inProgressComplaints :
//       resolvedComplaints;
    
//     return activeComplaints.slice(0, expandedCount);
//   };

//   const getCurrentTabComplaints = () => {
//     return activeTab === "pending" ? pendingComplaints :
//            activeTab === "inProgress" ? inProgressComplaints :
//            resolvedComplaints;
//   };

//   if (!isOpen) return null;

//   if (!isAuthenticated) {
//     return (
//       <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md">
//         <button
//           onClick={onClose}
//           className="absolute top-8 right-8 text-blue-50 text-4xl hover:text-red-500 transition-colors z-[101]"
//         >
//           ✕
//         </button>

//         <div className="relative bg-black border-2 border-blue-500/30 rounded-3xl p-10 w-full max-w-md backdrop-blur-xl shadow-2xl">
//           <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
//           <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

//           <div className="relative z-10">
//             <div className="text-center mb-8">
//               <p className="font-general text-[10px] uppercase tracking-widest text-blue-300 mb-2">
//                 Admin Access
//               </p>
//               <h2 className="text-4xl font-bold text-blue-50 mb-2">
//                 Secure Login
//               </h2>
//               <p className="text-sm text-gray-400">
//                 Enter admin credentials to continue
//               </p>
//             </div>

//             <form onSubmit={handleLogin} className="space-y-5">
//               <div>
//                 <label className="block text-xs font-medium mb-2 text-blue-100 uppercase tracking-wide">
//                   Username
//                 </label>
//                 <input
//                   type="text"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   className="w-full px-4 py-3 bg-gray-900/50 border border-blue-500/30 rounded-xl text-blue-50 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
//                   placeholder="admin"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-medium mb-2 text-blue-100 uppercase tracking-wide">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full px-4 py-3 bg-gray-900/50 border border-blue-500/30 rounded-xl text-blue-50 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
//                   placeholder="••••••••"
//                   required
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
//               >
//                 Access Dashboard
//               </button>
//             </form>

//             <p className="mt-6 text-xs text-center text-gray-500">
//               Default: admin / admin123
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 z-[100] overflow-y-auto bg-black">
//       <div className="min-h-screen py-10 px-4">
//         <button
//           onClick={onClose}
//           className="fixed top-8 right-8 text-blue-50 text-4xl hover:text-red-500 transition-colors z-[101] bg-black/50 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center"
//         >
//           ✕
//         </button>

//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-10">
//             <p className="font-general text-[10px] uppercase tracking-widest text-blue-300 mb-2">
//               Admin Panel
//             </p>
//             <AnimatedTitle
//               title="Complaints Dashboard"
//               className="special-font !text-5xl !font-black !leading-[.9] text-blue-50"
//             />
//             <p className="mt-4 text-gray-400">Manage and track all civic issue reports • Email notifications enabled</p>
//           </div>

//           <div className="flex justify-center gap-4 mb-8">
//             <button
//               onClick={() => {
//                 setActiveTab("pending");
//                 setExpandedCount(2);
//               }}
//               className={`px-6 py-3 rounded-xl font-semibold transition-all ${
//                 activeTab === "pending"
//                   ? "bg-gradient-to-r from-yellow-600 to-orange-600 text-white"
//                   : "bg-gray-800 text-gray-400 hover:bg-gray-700"
//               }`}
//             >
//               Pending ({pendingComplaints.length})
//             </button>
//             <button
//               onClick={() => {
//                 setActiveTab("inProgress");
//                 setExpandedCount(2);
//               }}
//               className={`px-6 py-3 rounded-xl font-semibold transition-all ${
//                 activeTab === "inProgress"
//                   ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
//                   : "bg-gray-800 text-gray-400 hover:bg-gray-700"
//               }`}
//             >
//               In Progress ({inProgressComplaints.length})
//             </button>
//             <button
//               onClick={() => {
//                 setActiveTab("resolved");
//                 setExpandedCount(2);
//               }}
//               className={`px-6 py-3 rounded-xl font-semibold transition-all ${
//                 activeTab === "resolved"
//                   ? "bg-gradient-to-r from-green-600 to-teal-600 text-white"
//                   : "bg-gray-800 text-gray-400 hover:bg-gray-700"
//               }`}
//             >
//               Resolved ({resolvedComplaints.length})
//             </button>
//           </div>

//           <div className="grid gap-6">
//             {getDisplayedComplaints().length === 0 ? (
//               <div className="text-center py-20">
//                 <p className="text-gray-500 text-xl">No {activeTab} complaints</p>
//               </div>
//             ) : (
//               getDisplayedComplaints().map((complaint) => (
//                 <div
//                   key={complaint.id}
//                   className="bg-gradient-to-br from-gray-900 to-black border-2 border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/40 transition-all shadow-xl"
//                 >
//                   <div className="flex gap-6">
//                     {complaint.photoUrl && (
//                       <img
//                         src={complaint.photoUrl}
//                         alt="Issue"
//                         className="w-48 h-48 object-cover rounded-xl border-2 border-blue-500/30"
//                       />
//                     )}

//                     <div className="flex-1 space-y-4">
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <h3 className="text-xl font-bold text-blue-50 mb-2">
//                             Complaint #{complaint.id}
//                           </h3>
//                           <p className="text-gray-300">{complaint.description}</p>
//                         </div>
//                         <span
//                           className={`px-4 py-2 rounded-full text-sm font-semibold ${
//                             complaint.status === "Resolved"
//                               ? "bg-green-500/20 text-green-300 border border-green-500/40"
//                               : complaint.status === "In Progress"
//                               ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
//                               : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
//                           }`}
//                         >
//                           {complaint.status}
//                         </span>
//                       </div>

//                       <div className="grid grid-cols-2 gap-4 text-sm">
//                         <div>
//                           <span className="text-gray-500">Location:</span>
//                           <p className="text-gray-300">{complaint.location}</p>
//                         </div>
//                         <div>
//                           <span className="text-gray-500">Date:</span>
//                           <p className="text-gray-300">{complaint.date}</p>
//                         </div>
//                         <div>
//                           <span className="text-gray-500">User Email:</span>
//                           <p className="text-gray-300">{complaint.userEmail || 'N/A'}</p>
//                         </div>
//                         <div>
//                           <span className="text-gray-500">User ID:</span>
//                           <p className="text-gray-300 text-xs">{complaint.userId?.substring(0, 8) || 'N/A'}...</p>
//                         </div>
//                       </div>

//                       <div className="flex gap-4 items-center">
//                         <select
//                           value={complaint.status}
//                           onChange={(e) => handleStatusUpdate(complaint.id, e.target.value)}
//                           className="px-4 py-2 bg-gray-800 text-blue-50 border border-blue-500/30 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
//                         >
//                           <option value="Pending">Pending</option>
//                           <option value="In Progress">In Progress</option>
//                           <option value="Resolved">Resolved</option>
//                         </select>

//                         {complaint.coordinates && (
//                           <a
//                             href={`https://www.google.com/maps?q=${complaint.coordinates.lat},${complaint.coordinates.lng}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-500 hover:to-teal-500 transition-all font-semibold"
//                           >
//                             📍 View on Map
//                           </a>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {getCurrentTabComplaints().length > expandedCount && (
//             <div className="text-center mt-8">
//               <button
//                 onClick={() => setExpandedCount(prev => prev + 5)}
//                 className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-semibold transition-all"
//               >
//                 View More ({getCurrentTabComplaints().length - expandedCount} remaining)
//               </button>
//             </div>
//           )}

//           {expandedCount > 2 && getCurrentTabComplaints().length > 2 && (
//             <div className="text-center mt-4">
//               <button
//                 onClick={() => setExpandedCount(2)}
//                 className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-semibold transition-all"
//               >
//                 Collapse
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
