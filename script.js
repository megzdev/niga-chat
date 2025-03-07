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
const auth = firebase.auth();
const database = firebase.database();
const messagesRef = database.ref('messages');

let currentUser = null;

// تسجيل الدخول
function signIn() {
  const email = document.getElementById('email-input').value;
  const password = document.getElementById('password-input').value;
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      currentUser = userCredential.user;
      document.getElementById('auth-container').style.display = 'none';
      document.getElementById('chat-container').style.display = 'block';
    })
    .catch((error) => {
      alert('خطأ في تسجيل الدخول: ' + error.message);
    });
}

// إنشاء حساب جديد
function signUp() {
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      currentUser = userCredential.user;
      document.getElementById('auth-container').style.display = 'none';
      document.getElementById('chat-container').style.display = 'block';
    })
    .catch((error) => {
      alert('خطأ في إنشاء الحساب: ' + error.message);
    });
}

// تسجيل الخروج
function signOut() {
  auth.signOut().then(() => {
    currentUser = null;
    document.getElementById('chat-container').style.display = 'none';
    document.getElementById('auth-container').style.display = 'block';
    showSignIn();
  });
}

// تبديل بين شاشة تسجيل الدخول والتسجيل
function showSignUp() {
  document.getElementById('signup-form').style.display = 'block';
  document.getElementById('email-input').parentElement.style.display = 'none';
}

function showSignIn() {
  document.getElementById('signup-form').style.display = 'none';
  document.getElementById('email-input').parentElement.style.display = 'block';
}

// دالة إرسال الرسالة
function sendMessage() {
  const messageInput = document.getElementById('message-input');
  const messageText = messageInput.value.trim();
  if (messageText && currentUser) {
    messagesRef.push({
      text: messageText,
      sender: currentUser.email.split('@')[0], // نستخدم جزء الإيميل قبل @ كاسم
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

// استقبال آخر 50 رسالة
messagesRef.limitToLast(50).on('value', (snapshot) => {
  const chatBox = document.getElementById('chat-box');
  chatBox.innerHTML = '';
  const messages = snapshot.val();
  if (messages && currentUser) {
    Object.entries(messages).forEach(([id, msg]) => {
      const p = document.createElement('p');
      p.textContent = `${msg.sender}: ${msg.text}`;
      if (msg.sender === currentUser.email.split('@')[0]) {
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

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark-mode');
  themeToggle.textContent = '☀️';
} else {
  themeToggle.textContent = '🌙';
}

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
