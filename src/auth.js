import { auth } from './firebase-config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const signup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user,
      message: `User registered: ${userCredential.user.email}`, 
    };
  } catch (error) {
    console.error("Error signing up:", error);
    return {
      success: false,
      message: error.message, 
    };
  }
};

const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user, 
      message: `Logged in as: ${userCredential.user.email}`, 
    };
  } catch (error) {
    console.error("Error logging in:", error);
    return {
      success: false,
      message: error.message, 
    };
  }
};
export { signup, login };
