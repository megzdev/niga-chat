// إعدادات Firebase
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
const messagesRef = database.ref('messages');

let username = '';

// دالة بدء الشات بعد إدخال الاسم
function startChat() {
  const usernameInput = document.getElementById('username-input');
  username = usernameInput.value.trim();
  if (username) {
    document.getElementById('username-prompt').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';
  } else {
    alert('من فضلك، أدخل اسمك!');
  }
}

// دالة إرسال الرسالة
function sendMessage() {
  const messageInput = document.getElementById('message-input');
  const messageText = messageInput.value.trim();
  if (messageText && username) {
    messagesRef.push({
      text: messageText,
      sender: username,
      timestamp: Date.now()
    });
    messageInput.value = '';
  }
}

// استقبال الرسايل وعرضها
messagesRef.on('value', (snapshot) => {
  const chatBox = document.getElementById('chat-box');
  chatBox.innerHTML = '';
  const messages = snapshot.val();
  if (messages) {
    Object.values(messages).forEach(msg => {
      const p = document.createElement('p');
      p.textContent = `${msg.sender}: ${msg.text}`;
      if (msg.sender === username) {
        p.classList.add('sent');
      } else {
        p.classList.add('received');
      }
      chatBox.appendChild(p);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});

// التحكم في الـLight/Dark Mode
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// تحميل الوضع المحفوظ من localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark-mode');
  themeToggle.textContent = '☀️';
} else {
  themeToggle.textContent = '🌙';
}

// تبديل الوضع لما نضغط على الزرار
themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  if (body.classList.contains('dark-mode')) {
    themeToggle.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
  } else {
    themeToggle.textContent = '🌙';
    localStorage.setItem('theme', 'light');
  }
});
