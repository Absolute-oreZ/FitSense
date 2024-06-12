document.addEventListener('DOMContentLoaded', () => {
    const calendar = document.querySelector('.calendar');
    const monthPicker = calendar.querySelector('#month-picker');
    const yearPicker = calendar.querySelector('#year-picker');
    const calendarDays = calendar.querySelector('.calendar-days');
    const currentDate = new Date();
    let currentMonth = { value: currentDate.getMonth() };
    let currentYear = { value: currentDate.getFullYear() };

    const generateCalendar = (month, year) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const prevLastDay = new Date(year, month, 0);
        const daysInMonth = lastDay.getDate();
        const daysInPrevMonth = prevLastDay.getDate();
        const startDay = firstDay.getDay();
        const today = new Date();

        calendarDays.innerHTML = '';
        monthPicker.innerHTML = firstDay.toLocaleString('default', { month: 'long' });
        yearPicker.querySelector('#year').innerHTML = year;

        for (let i = startDay; i > 0; i--) {
            calendarDays.innerHTML += `<div class="prev-date">${daysInPrevMonth - i + 1}</div>`;
        }

        for (let i = 1; i <= daysInMonth; i++) {
            if (i === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                calendarDays.innerHTML += `<div class="current-date">${i}</div>`;
            } else {
                calendarDays.innerHTML += `<div class="date">${i}</div>`;
            }
        }

        const totalDays = startDay + daysInMonth;
        for (let i = 1; i <= 42 - totalDays; i++) {
            calendarDays.innerHTML += `<div class="next-date">${i}</div>`;
        }
    };

    monthPicker.addEventListener('click', () => {
        const monthList = calendar.querySelector('.month-list');
        monthList.classList.toggle('show');
    });

    calendar.querySelectorAll('.month-list div').forEach((monthElement, index) => {
        monthElement.addEventListener('click', () => {
            currentMonth.value = index;
            generateCalendar(currentMonth.value, currentYear.value);
        });
    });

    yearPicker.querySelector('#pre-year').addEventListener('click', () => {
        currentYear.value--;
        generateCalendar(currentMonth.value, currentYear.value);
    });

    yearPicker.querySelector('#next-year').addEventListener('click', () => {
        currentYear.value++;
        generateCalendar(currentMonth.value, currentYear.value);
    });

    generateCalendar(currentMonth.value, currentYear.value);

    const updateFooterDate = (date) => {
        const dayText = date.toLocaleDateString('default', { weekday: 'long' }).toUpperCase();
        const dateText = date.toLocaleDateString('default', { day: '2-digit', month: 'short', year: 'numeric' });

        document.querySelector('.day-text-format').innerText = dayText;
        document.querySelector('.date-format').innerText = dateText;
    };

    const updateRealTimeDate = () => {
        const now = new Date();
        const timeText = now.toLocaleTimeString('default');
        document.querySelector('.time-format').innerText = timeText;
        updateFooterDate(now);
    };

    setInterval(updateRealTimeDate, 1000);
    updateRealTimeDate();

    calendarDays.addEventListener('click', (e) => {
        if (e.target.classList.contains('date') || e.target.classList.contains('current-date')) {
            const selectedDay = parseInt(e.target.innerText);
            const selectedDate = new Date(currentYear.value, currentMonth.value, selectedDay);
            updateFooterDate(selectedDate);
        }
    });

    // Update fitness tracker values (dummy example)
    const stepsElement = document.getElementById('steps');
    const distanceElement = document.getElementById('distance');
    const caloriesElement = document.getElementById('calories');

    stepsElement.innerText = 8000;
    distanceElement.innerText = '6.4 km';
    caloriesElement.innerText = '400 kcal';

    // Update progress ring based on steps goal
    const progressRing = document.getElementById('progress-ring');
    const stepsGoal = 10000; // Example goal, you can set the user's goal dynamically

    const updateProgressRing = (steps) => {
        const circumference = Math.PI * 100; // Circumference of a circle with radius 50
        const percentage = (steps / stepsGoal) * 100;
        const progress = circumference - (percentage / 100) * circumference;
        progressRing.innerHTML = `
          <svg class="ring-circle">
            <circle cx="60" cy="60" r="50"></circle>
          </svg>
          <svg class="progress-circle" style="stroke-dashoffset: ${progress}; stroke-dasharray: ${circumference};">
            <circle cx="60" cy="60" r="50"></circle>
          </svg>
        `;
    };

    // Example: Update progress ring with current steps
    const currentSteps = 6000; // Example current steps
    updateProgressRing(currentSteps);
});