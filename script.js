document.addEventListener('DOMContentLoaded', () => {
    // Ваши настройки Firebase
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT_ID.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

    // Инициализация Firebase
    const app = firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    const attendanceTable = document.getElementById('attendanceTable');
    const addEntryButton = document.getElementById('addEntry');
    const resetEntriesButton = document.getElementById('resetEntries');

    const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'];

    function loadAttendance() {
        db.collection("attendance").get().then((querySnapshot) => {
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
        });
    }

    function saveAttendance(day, isAttending) {
        db.collection("attendance").doc(day).set({
            status: isAttending ? 'Да' : 'Нет'
        }).then(() => {
            updateAttendanceRow(day, isAttending ? 'Да' : 'Нет'); // Обновление строки в таблице
            alert(`Запись посещаемости для ${day} сохранена!`);
        });
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

    function resetAttendance() {
        db.collection("attendance").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                db.collection("attendance").doc(doc.id).delete();
            });
            loadAttendance(); // Перезагрузка таблицы
        });
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