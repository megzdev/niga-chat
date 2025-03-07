// script.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9rJrrfJp_5NqwSKcojFVHcaeX7nFFn6g",
  authDomain: "niga-chat.firebaseapp.com",
  databaseURL: "https://niga-chat-default-rtdb.firebaseio.com",
  projectId: "niga-chat",
  storageBucket: "niga-chat.firebasestorage.app",
  messagingSenderId: "1057951274717",
  appId: "1:1057951274717:web:bf326a3c320851e817ad34",
  measurementId: "G-30WXNJ81Z3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
  
  // تهيئة Firebase
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  const messagesRef = database.ref('messages');
  
  // إرسال رسالة
  function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value;
    if (messageText.trim()) {
      messagesRef.push({
        text: messageText,
        timestamp: Date.now()
      });
      messageInput.value = ''; // تفريغ الحقل بعد الإرسال
    }
  }
  
  // استقبال الرسائل وعرضها
  messagesRef.on('value', (snapshot) => {
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = ''; // تفريغ المحادثة قبل التحديث
    const messages = snapshot.val();
    if (messages) {
      Object.values(messages).forEach(msg => {
        const p = document.createElement('p');
        p.textContent = msg.text;
        chatBox.appendChild(p);
      });
      chatBox.scrollTop = chatBox.scrollHeight; // التمرير لآخر رسالة
    }
  });
