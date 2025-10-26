// import emailjs from '@emailjs/browser';

// // Initialize EmailJS (do this once in your app)
// emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

// export const sendStatusUpdateEmail = async (userEmail, complaintData) => {
//   const templateParams = {
//     to_email: userEmail,
//     complaint_id: complaintData.id,
//     status: complaintData.status,
//     description: complaintData.description.substring(0, 100) + '...',
//     update_date: new Date().toLocaleDateString()
//   };

//   try {
//     await emailjs.send(
//       import.meta.env.VITE_EMAILJS_SERVICE_ID,
//       import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
//       templateParams
//     );
//     console.log('Email sent successfully!');
//     return true;
//   } catch (error) {
//     console.error('Email send failed:', error);
//     return false;
//   }
// };

// export const sendComplaintSubmissionEmail = async (userEmail, complaintData) => {
//   const templateParams = {
//     to_email: userEmail,
//     complaint_id: complaintData.id,
//     description: complaintData.description,
//     location: complaintData.location,
//     submission_date: new Date().toLocaleDateString()
//   };

//   try {
//     await emailjs.send(
//       import.meta.env.VITE_EMAILJS_SERVICE_ID,
//       import.meta.env.VITE_EMAILJS_SUBMISSION_TEMPLATE_ID,
//       templateParams
//     );
//     return true;
//   } catch (error) {
//     console.error('Email send failed:', error);
//     return false;
//   }
// };


import emailjs from '@emailjs/browser';

// Initialize EmailJS
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

export const sendStatusUpdateEmail = async (userEmail, complaintData) => {
  console.log('📧 sendStatusUpdateEmail called');
  console.log('To:', userEmail);
  console.log('Data:', complaintData);
  console.log('Template ID:', import.meta.env.VITE_EMAILJS_TEMPLATE_ID);
  console.log('Service ID:', import.meta.env.VITE_EMAILJS_SERVICE_ID);
  
  const templateParams = {
    to_email: userEmail,
    complaint_id: complaintData.id || 'N/A',
    status: complaintData.status,
    description: complaintData.description.substring(0, 100) + '...',
    update_date: new Date().toLocaleDateString()
  };
  
  console.log('Template params:', templateParams);

  try {
    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams
    );
    
    console.log('✅ EmailJS response:', response);
    return true;
  } catch (error) {
    console.error('❌ EmailJS error:', error);
    console.error('Error text:', error.text);
    console.error('Error status:', error.status);
    throw error;
  }
};

export const sendComplaintSubmissionEmail = async (userEmail, complaintData) => {
  console.log('📧 sendComplaintSubmissionEmail called');
  console.log('To:', userEmail);
  
  const templateParams = {
    to_email: userEmail,
    complaint_id: 'New Complaint',
    description: complaintData.description,
    location: complaintData.location,
    submission_date: new Date().toLocaleDateString()
  };
  
  console.log('Submission template params:', templateParams);

  try {
    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_SUBMISSION_TEMPLATE_ID,
      templateParams
    );
    
    console.log('✅ Submission email sent:', response);
    return true;
  } catch (error) {
    console.error('❌ Submission email error:', error);
    throw error;
  }
};
