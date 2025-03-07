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
const usersRef = database.ref('users');

let currentUser = null;
const defaultAvatar = 'https://cdn.discordapp.com/attachments/1249366016476319749/1347544588436377690/image.png?ex=67cc3632&is=67cae4b2&hm=7f4492cf980da571a35d0f2ae918af53cfe35189cd11ecee21c67027903a5575&';

// التحقق من حالة تسجيل الدخول عند تحميل الصفحة
auth.onAuthStateChanged((user) => {
  if (user) {
    currentUser = user;
    showChat();
  } else {
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('chat-container').style.display = 'none';
  }
});

// تسجيل الدخول
function signIn() {
  const email = document.getElementById('email-input').value;
  const password = document.getElementById('password-input').value;
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      currentUser = userCredential.user;
      showChat();
    })
    .catch((error) => {
      alert('خطأ في تسجيل الدخول: ' + error.message);
    });
}

// إنشاء حساب جديد
function signUp() {
  const username = document.getElementById('signup-username').value.trim();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  if (!username) {
    alert('من فضلك، أدخل اسم المستخدم!');
    return;
  }
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      currentUser = userCredential.user;
      usersRef.child(currentUser.uid).set({
        username: username,
        email: email,
        avatar: defaultAvatar
      }).then(() => {
        showChat();
      }).catch((error) => {
        alert('خطأ في حفظ بيانات المستخدم: ' + error.message);
      });
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

// عرض الشات
function showChat() {
  document.getElementById('auth-container').style.display = 'none';
  document.getElementById('chat-container').style.display = 'block';
  loadMessages();
  loadUsers();
}

// تبديل بين شاشة تسجيل الدخول والتسجيل
function showSignUp() {
  document.getElementById('signin-form').style.display = 'none';
  document.getElementById('signup-form').style.display = 'block';
}

function showSignIn() {
  document.getElementById('signin-form').style.display = 'block';
  document.getElementById('signup-form').style.display = 'none';
}

// إعدادات المستخدم
function showSettings() {
  document.getElementById('chat-container').style.display = 'none';
  document.getElementById('settings-container').style.display = 'block';
  usersRef.child(currentUser.uid).once('value', (snapshot) => {
    const userData = snapshot.val() || {};
    document.getElementById('settings-username').value = userData.username || '';
    document.getElementById('settings-email').value = currentUser.email || '';
    document.getElementById('settings-avatar').value = userData.avatar || defaultAvatar;
  });
}

function hideSettings() {
  document.getElementById('settings-container').style.display = 'none';
  document.getElementById('chat-container').style.display = 'block';
}

function updateSettings() {
  const newUsername = document.getElementById('settings-username').value.trim();
  const newEmail = document.getElementById('settings-email').value;
  const newPassword = document.getElementById('settings-password').value;
  const newAvatar = document.getElementById('settings-avatar').value || defaultAvatar;

  if (newUsername) {
    usersRef.child(currentUser.uid).update({ username: newUsername }).then(() => {
      updateOldMessages(currentUser.uid, newUsername); // تحديث الرسايل القديمة
    });
  }
  if (newAvatar) {
    usersRef.child(currentUser.uid).update({ avatar: newAvatar });
  }
  if (newEmail && newEmail !== currentUser.email) {
    currentUser.updateEmail(newEmail)
      .then(() => {
        usersRef.child(currentUser.uid).update({ email: newEmail });
      })
      .catch((error) => alert('خطأ في تحديث الإيميل: ' + error.message));
  }
  if (newPassword) {
    currentUser.updatePassword(newPassword)
      .catch((error) => alert('خطأ في تحديث كلمة السر: ' + error.message));
  }
  alert('تم تحديث الإعدادات بنجاح!');
  hideSettings();
}

// تحديث الرسايل القديمة
function updateOldMessages(userId, newUsername) {
  messagesRef.once('value', (snapshot) => {
    const messages = snapshot.val();
    if (messages) {
      Object.entries(messages).forEach(([id, msg]) => {
        usersRef.child(userId).once('value', (userSnapshot) => {
          const oldUsername = userSnapshot.val().username;
          if (msg.sender === oldUsername) {
            messagesRef.child(id).update({ sender: newUsername });
          }
        });
      });
    }
  });
}

// دالة إرسال الرسالة
function sendMessage() {
  const messageInput = document.getElementById('message-input');
  const messageText = messageInput.value.trim();
  if (messageText && currentUser) {
    usersRef.child(currentUser.uid).once('value', (snapshot) => {
      const userData = snapshot.val();
      if (userData && userData.username) {
        messagesRef.push({
          text: messageText,
          sender: userData.username,
          timestamp: Date.now()
        }).then(() => {
          messageInput.value = '';
        }).catch((error) => {
          alert('خطأ في إرسال الرسالة: ' + error.message);
        });
      } else {
        alert('خطأ: لم يتم العثور على اسم المستخدم!');
      }
    });
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

// تحميل الرسايل
function loadMessages() {
  messagesRef.limitToLast(50).on('value', (snapshot) => {
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = '';
    if (!currentUser) return;

    usersRef.child(currentUser.uid).once('value', (userSnapshot) => {
      const userData = userSnapshot.val();
      if (!userData || !userData.username) {
        alert('خطأ: لم يتم العثور على بيانات المستخدم!');
        return;
      }
      const currentUsername = userData.username;
      const messages = snapshot.val();
      if (messages) {
        Object.entries(messages).forEach(([id, msg]) => {
          const p = document.createElement('p');
          p.textContent = `${msg.sender}: ${msg.text}`;
          if (msg.sender === currentUsername) {
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
      }
      chatBox.scrollTop = chatBox.scrollHeight;
    });
  });
}

// تحميل المستخدمين
function loadUsers() {
  usersRef.on('value', (snapshot) => {
    const usersList = document.getElementById('users-list');
    usersList.innerHTML = '';
    const users = snapshot.val();
    if (users) {
      Object.values(users).forEach(user => {
        if (user.username && user.avatar) {
          const div = document.createElement('div');
          div.classList.add('user-item');
          div.innerHTML = `<img src="${user.avatar}" alt="${user.username}"><span>${user.username}</span>`;
          usersList.appendChild(div);
        }
      });
    }
  });
}

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
