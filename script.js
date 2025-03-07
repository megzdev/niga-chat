// إعدادات Firebase الخاصة بيك
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

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const messagesRef = database.ref('messages'); // مكان تخزين الرسايل في قاعدة البيانات

// دالة إرسال الرسالة
function sendMessage() {
  const messageInput = document.getElementById('message-input');
  const messageText = messageInput.value.trim();
  if (messageText) { // نتأكد إن الحقل مش فاضي
    messagesRef.push({
      text: messageText,
      timestamp: Date.now()
    });
    messageInput.value = ''; // نفرّغ الحقل بعد الإرسال
  }
}

// استقبال الرسايل وعرضها في الوقت الفعلي
messagesRef.on('value', (snapshot) => {
  const chatBox = document.getElementById('chat-box');
  chatBox.innerHTML = ''; // نفرّغ الصندوق قبل التحديث
  const messages = snapshot.val();
  if (messages) {
    Object.values(messages).forEach(msg => {
      const p = document.createElement('p');
      p.textContent = msg.text;
      chatBox.appendChild(p);
    });
    chatBox.scrollTop = chatBox.scrollHeight; // ننزل لآخر رسالة تلقائي
  }
});
