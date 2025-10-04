import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
const vapidKey = import.meta.env.VITE_firebase_vapidKey;

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBT9xm-txBmjE3oW1Q-ZWIPfDRpK8UWmPI",
  authDomain: "food-del-66e22.firebaseapp.com",
  projectId: "food-del-66e22",
  storageBucket: "food-del-66e22.firebasestorage.app",
  messagingSenderId: "70727244191",
  appId: "1:70727244191:web:bcdd9356067f7df224c5aa",
  measurementId: "G-W3RG0GGSY2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let messaging = null;

// Check if Firebase Messaging is supported
isSupported().then((supported) => {
  if (supported) {
    messaging = getMessaging(app);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }

    // Listen for foreground messages
    onMessage(messaging, (payload) => {
      console.log("Message received:", payload);
      alert(`Notification: ${payload.notification?.title}`);
    });
  } else {
    console.warn("Firebase messaging is not supported in this browser.");
  }
});

// Function to request FCM token
// export const requestFCMToken = async () => {
//   if (!messaging) {
//     console.warn("Messaging not initialized or not supported.");
//     return null;
//   }

//   try {
//     const token = await getToken(messaging, {
//       vapidKey: vapidKey,
//     });
//     console.log("FCM Token:", token);
//     return token;
//   } catch (error) {
//     console.error("Error getting FCM token:", error);
//     throw error;
//   }
// };

// Function to request FCM token
export const requestFCMToken = async () => {
  if (!messaging) {
    console.warn("Messaging not initialized or not supported.");
    return null;
  }

  try {
    const token = await getToken(messaging, {
      vapidKey: vapidKey,
    });
    console.log("FCM Token:", token);
    return token || null; // if empty string, return null
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null; // ✅ return null instead of throwing
  }
};

export { messaging };


