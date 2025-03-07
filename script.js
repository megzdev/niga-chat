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

// دالة بدء الشات مع التحقق من كود الأمان
function startChat() {
  const usernameInput = document.getElementById('username-input');
  const codeInput = document.getElementById('code-input');
  username = usernameInput.value.trim();
  const code = codeInput.value;

  if (username && code === '69') {
    document.getElementById('username-prompt').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';
  } else if (!username) {
    alert('من فضلك، أدخل اسمك!');
  } else {
    alert('كود الأمان غلط! الكود الصحيح هو 69');
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

// دالة تعديل الرسالة
function editMessage(messageId, oldText) {
  const newText = prompt('عدل الرسالة:', oldText);
  if (newText && newText.trim()) {
    messagesRef.child(messageId).update({ text: newText.trim() });
  }
}

// دالة مسح الرسالة
function deleteMessage(messageId) {
  if (confirm('متأكد عاوز تمسح الرسالة؟')) {
    messagesRef.child(messageId).remove();
  }
}

// استقبال آخر 50 رسالة فقط
messagesRef.limitToLast(50).on('value', (snapshot) => {
  const chatBox = document.getElementById('chat-box');
  chatBox.innerHTML = '';
  const messages = snapshot.val();
  if (messages) {
    Object.entries(messages).forEach(([id, msg]) => {
      const p = document.createElement('p');
      p.textContent = `${msg.sender}: ${msg.text}`;
      if (msg.sender === username) {
        p.classList.add('sent');
        p.innerHTML += ` <span class="actions">
          <button onclick="editMessage('${id}', '${msg.text}')">تعديل</button>
          <button onclick="deleteMessage('${id}')">مسح</button>
        </span>`;
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
