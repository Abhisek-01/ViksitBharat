// import { auth } from './firebase';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// export async function signupUser(email, password) {
//   try {
//     await createUserWithEmailAndPassword(auth, email, password);
//     alert("Account created and logged in successfully.");
//   } catch (error) {
//     if (error.code === 'auth/email-already-in-use') {
//       alert("Email already registered. Please sign in.");
//     } else {
//       alert(error.message);
//     }
//     throw error;
//   }
// }

// export async function signInUser(email, password) {
//   try {
//     await signInWithEmailAndPassword(auth, email, password);
//     alert("Successfully signed in.");
//   } catch (error) {
//     alert(error.message);
//     throw error;
//   }
// }
