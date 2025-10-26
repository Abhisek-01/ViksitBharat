import { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

import About from "./components/About";
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Features from "./components/Features";
import Story from "./components/Story";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ComplaintForm from "./components/ComplaintForm";
import PublicDashboard from "./components/PublicDashboard";
import AdminDashboard from "./components/AdminDashboard";
import Chatbot from "./components/Chatbot";

function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load complaints from Firebase in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'complaints'), 
      (snapshot) => {
        const complaintsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setComplaints(complaintsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error loading complaints:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Add new complaint to Firebase
  const addComplaint = async (newComplaint) => {
    try {
      const complaint = {
        ...newComplaint,
        status: "Pending",
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date()
      };
      
      await addDoc(collection(db, 'complaints'), complaint);
      alert("Complaint submitted successfully!");
    } catch (error) {
      console.error("Error adding complaint:", error);
      alert("Failed to submit complaint. Please try again.");
    }
  };

  // Update complaint status in Firebase
  const updateComplaintStatus = async (id, newStatus) => {
    try {
      const complaintRef = doc(db, 'complaints', id);
      await updateDoc(complaintRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <NavBar onAdminClick={() => setIsAdminOpen(true)} />
      <Hero />
      <ComplaintForm onSubmit={addComplaint} />
      <PublicDashboard complaints={complaints.filter(c => c.status === "Resolved")} />
      <About />
      <Features />
      {/* <Story /> */}
      {/* <Contact /> */}
      
      
      <Chatbot/>
      
      <Footer />
      
      <AdminDashboard 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)}
        complaints={complaints}
        onUpdateStatus={updateComplaintStatus}
      />
    </main>
  );
}

export default App;
