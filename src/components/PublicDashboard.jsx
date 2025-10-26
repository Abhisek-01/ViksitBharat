import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useState } from "react";

import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const PublicDashboard = ({ complaints }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useGSAP(() => {
    gsap.from(".issue-item", {
      scrollTrigger: {
        trigger: "#publicdashboard",
        start: "top 80%",
      },
      y: 50,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "power3.out",
    });
  }, [isExpanded]); // Re-run animation when items change

  const visibleIssues = isExpanded ? complaints : complaints.slice(0, 2);

  return (
    <section id="dashboard" className="min-h-dvh w-screen bg-black text-blue-50 py-10 px-6">
      <div className="flex flex-col items-center">
        <p className="font-general text-sm uppercase md:text-[10px] mb-2">
          transparent resolutions
        </p>

        <AnimatedTitle
          title="Resolved Civic Issues"
          containerClass="mt-1 pointer-events-none mix-blend-difference relative z-10 text-4xl md:text-6xl font-bold"
        />

        <ul className="mt-8 w-full max-w-4xl grid gap-6">
          {visibleIssues.map(({ id, description, photoUrl, date }) => (
            <li
              key={id}
              className="issue-item flex gap-4 items-center p-4 border border-blue-500 rounded bg-blue-900"
            >
              <img 
                src={photoUrl} 
                alt={description} 
                className="w-24 h-24 object-cover rounded" 
              />
              <div>
                <p className="font-semibold text-white">{description}</p>
                <p className="text-sm text-blue-300">Resolved on: {date}</p>
              </div>
            </li>
          ))}
        </ul>

        {complaints.length > 2 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-10 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            {isExpanded ? "Collapse" : "View More"}
          </button>
        )}

        {complaints.length === 0 && (
          <p className="mt-8 text-gray-400">No resolved issues yet.</p>
        )}
      </div>
    </section>
  );
};

export default PublicDashboard;


// import React, { useState, useEffect } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/all";
// import AnimatedTitle from "./AnimatedTitle";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { firestore } from '<div className="" />; // Adjust import according to your setup

// gsap.registerPlugin(ScrollTrigger);

// const PublicDashboard = () => {
//   const [complaints, setComplaints] = useState([]);
//   const [isExpanded, setIsExpanded] = useState(false);

//   useEffect(() => {
//     const fetchComplaints = async () => {
//       try {
//         // Adjust collection name and query as per your DB schema
//         const q = query(collection(firestore, "complaints"), where("status", "==", "resolved"));
//         const querySnapshot = await getDocs(q);
//         const fetchedComplaints = [];
//         querySnapshot.forEach((doc) => {
//           fetchedComplaints.push({ id: doc.id, ...doc.data() });
//         });
//         setComplaints(fetchedComplaints);
//       } catch (error) {
//         console.error("Error fetching complaints:", error);
//       }
//     };

//     fetchComplaints();
//   }, []);

//   useEffect(() => {
//     gsap.from(".issue-item", {
//       scrollTrigger: {
//         trigger: "#dashboard",
//         start: "top 80%",
//       },
//       y: 50,
//       opacity: 0,
//       stagger: 0.2,
//       duration: 0.8,
//       ease: "power3.out",
//     });
//   }, [complaints, isExpanded]);

//   const visibleIssues = isExpanded ? complaints : complaints.slice(0, 2);

//   return (
//     <section id="dashboard" className="min-h-dvh w-screen bg-black text-blue-50 py-10 px-6">
//       <div className="flex flex-col items-center">
//         <p className="font-general text-sm uppercase md:text-[10px] mb-2">
//           transparent resolutions
//         </p>
//         <AnimatedTitle
//           title="Resolved Civic Issues"
//           containerClass="mt-1 pointer-events-none mix-blend-difference relative z-10 text-4xl md:text-6xl font-bold"
//         />
//         <ul className="mt-8 w-full max-w-4xl grid gap-6">
//           {visibleIssues.map(({ id, description, photoUrl, date }) => (
//             <li
//               key={id}
//               className="issue-item flex gap-4 items-center p-4 border border-blue-500 rounded bg-blue-900"
//             >
//               <img 
//                 src={photoUrl} 
//                 alt={description} 
//                 className="w-24 h-24 object-cover rounded" 
//               />
//               <div>
//                 <p className="font-semibold text-white">{description}</p>
//                 <p className="text-sm text-blue-300">Resolved on: {date}</p>
//               </div>
//             </li>
//           ))}
//         </ul>
//         {complaints.length > 2 && (
//           <button
//             onClick={() => setIsExpanded(!isExpanded)}
//             className="mt-10 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
//           >
//             {isExpanded ? "Collapse" : "View More"}
//           </button>
//         )}
//         {complaints.length === 0 && (
//           <p className="mt-8 text-gray-400">No resolved issues yet.</p>
//         )}
//       </div>
//     </section>
//   );
// };

// export default PublicDashboard;
