document.addEventListener('DOMContentLoaded', () => {
    const attendanceTable = document.getElementById('attendanceTable');
    const addEntryButton = document.getElementById('addEntry');

    const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'];

    function fillAttendanceTable() {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Пн

        daysOfWeek.forEach((day, index) => {
            const currentDate = new Date(startOfWeek);
            currentDate.setDate(currentDate.getDate() + index);
            const formattedDate = currentDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'numeric' });

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${day}</td>
                <td>${formattedDate}</td>
                <td>Не указано</td>
            `;
            attendanceTable.appendChild(row);
        });
    }

    function addAttendanceEntry(rowIndex, isAttending) {
        const rows = attendanceTable.getElementsByTagName('tr');
        const cell = rows[rowIndex].getElementsByTagName('td')[2];
        cell.innerText = isAttending ? 'Да' : 'Нет';
    }

    addEntryButton.addEventListener('click', () => {
        const rowIndex = prompt('Введите номер строки (1-5), чтобы указать, идете ли вы на учебу:') - 1;
        const isAttending = confirm('Вы идете на учебу?');
        if (rowIndex >= 0 && rowIndex < daysOfWeek.length) {
            addAttendanceEntry(rowIndex, isAttending);
        } else {
            alert('Неверный номер строки. Пожалуйста, введите число от 1 до 5.');
        }
    });

    fillAttendanceTable();
});