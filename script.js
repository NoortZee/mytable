// Импортируйте функции, которые вам нужны из SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    // Ваши настройки Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyATgGUuQWQmWQkVJNX-eC-TJDjjUZZxnhk",
        authDomain: "mytable-ec39f.firebaseapp.com",
        databaseURL: "https://mytable-ec39f-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "mytable-ec39f",
        storageBucket: "mytable-ec39f.appspot.com",
        messagingSenderId: "320939389795",
        appId: "1:320939389795:web:e7993e6e7582886e671956",
        measurementId: "G-D27M0PHTJ4"
    };

    // Инициализация Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const attendanceTable = document.getElementById('attendanceTable');
    const addEntryButton = document.getElementById('addEntry');
    const resetEntriesButton = document.getElementById('resetEntries');

    const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'];

    async function loadAttendance() {
        const querySnapshot = await getDocs(collection(db, "attendance"));
        attendanceTable.innerHTML = ''; // Очистка таблицы перед загрузкой
        daysOfWeek.forEach((day, index) => {
            const row = document.createElement('tr');
            const date = new Date();
            date.setDate(date.getDate() - date.getDay() + index + 1); 
            const formattedDate = date.toLocaleDateString('ru-RU');
            const status = querySnapshot.docs.find(doc => doc.id === day)?.data().status || 'Не указано';

            row.innerHTML = `
                <td>${day}</td>
                <td>${formattedDate}</td>
                <td>${status}</td>
            `;
            attendanceTable.appendChild(row);
        });
    }

    async function saveAttendance(day, isAttending) {
        await setDoc(doc(db, "attendance", day), {
            status: isAttending ? 'Да' : 'Нет'
        });
        updateAttendanceRow(day, isAttending ? 'Да' : 'Нет'); // Обновление строки в таблице
        alert(`Запись посещаемости для ${day} сохранена!`);
    }

    function updateAttendanceRow(day, status) {
        const rows = attendanceTable.getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].cells[0].innerText === day) {
                rows[i].cells[2].innerText = status; // Обновление статуса посещаемости
                break;
            }
        }
    }

    async function resetAttendance() {
        const querySnapshot = await getDocs(collection(db, "attendance"));
        const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        loadAttendance(); // Перезагрузка таблицы
    }

    addEntryButton.addEventListener('click', () => {
        const dayIndex = prompt('Введите номер дня (0-4 для Пн-Пт):');
        const isAttending = confirm('Вы идете на учебу?');
        const day = daysOfWeek[dayIndex];

        if (day) {
            saveAttendance(day, isAttending);
        } else {
            alert('Неверный номер дня. Пожалуйста, введите число от 0 до 4');
        }
    });

    resetEntriesButton.addEventListener('click', resetAttendance);

    loadAttendance();
});