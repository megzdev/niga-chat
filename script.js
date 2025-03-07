// script.js
const firebaseConfig = {
    // ضع هنا الإعدادات بتاعتك من Firebase
    apiKey: "xxxx",
    authDomain: "xxxx.firebaseapp.com",
    databaseURL: "https://xxxx-default-rtdb.firebaseio.com",
    projectId: "xxxx",
    storageBucket: "xxxx.appspot.com",
    messagingSenderId: "xxxx",
    appId: "xxxx"
  };
  
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