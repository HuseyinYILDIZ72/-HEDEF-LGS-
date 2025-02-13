document.getElementById('register-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push({ username, password, isAdmin: false });
    localStorage.setItem('users', JSON.stringify(users));

    alert('Kayıt başarılı! Giriş yapabilirsiniz.');
    window.location.href = 'login.html';
});

document.getElementById('login-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin123') {
        const adminUser = { username, password, isAdmin: true };
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        alert('Admin olarak giriş başarılı!');
        window.location.href = 'admin.html';
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Giriş başarılı!');
        window.location.href = user.isAdmin ? 'admin.html' : 'index.html';
    } else {
        alert('Geçersiz kullanıcı adı veya şifre!');
    }
});

document.getElementById('note-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const subject = document.getElementById('subject').value;
    const title = document.getElementById('note-title').value;
    const file = document.getElementById('note-file').files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const note = {
                subject,
                title,
                fileName: file.name,
                fileContent: event.target.result
            };

            addNoteToList(note);
            saveNoteToLocalStorage(note);
        };
        reader.readAsDataURL(file);
    }
});

function addNoteToList(note) {
    const noteList = document.getElementById('note-list');
    const noteElement = document.createElement('div');
    noteElement.classList.add('note');

    noteElement.innerHTML = `
        <h3>${note.subject}</h3>
        <p><strong>${note.title}</strong></p>
        <p><a href="${note.fileContent}" download="${note.fileName}">Dosyayı İndir</a></p>
        <button onclick="deleteNote('${note.title}')">Sil</button>
    `;

    noteList.appendChild(noteElement);
}

function saveNoteToLocalStorage(note) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
}

function deleteNote(title) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes = notes.filter(note => note.title !== title);
    localStorage.setItem('notes', JSON.stringify(notes));
    document.getElementById('note-list').innerHTML = '';
    loadNotesFromLocalStorage();
}

function loadNotesFromLocalStorage() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.forEach(note => addNoteToList(note));
}

function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userList = document.getElementById('user-list');
    users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.classList.add('user');

        userElement.innerHTML = `
            <span>${user.username}</span>
            <button onclick="deleteUser('${user.username}')">Sil</button>
        `;

        userList.appendChild(userElement);
    });
}

function deleteUser(username) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.filter(user => user.username !== username);
    localStorage.setItem('users', JSON.stringify(users));
    document.getElementById('user-list').innerHTML = '';
    loadUsers();
}

window.onload = function() {
    loadNotesFromLocalStorage();
    if (document.getElementById('user-list')) {
        loadUsers();
    }
};