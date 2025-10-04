/* global importScripts, firebase */
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
apiKey: "AIzaSyBT9xm-txBmjE3oW1Q-ZWIPfDRpK8UWmPI",
  projectId: "food-del-66e22",
  messagingSenderId: "70727244191",
  appId: "1:70727244191:web:bcdd9356067f7df224c5aa",
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    data: payload.data || {},
  });
});
