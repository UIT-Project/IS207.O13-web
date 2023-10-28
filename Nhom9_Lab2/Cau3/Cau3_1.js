function updateDateTime() {
    var dateTimeElement = document.getElementById('date-time');
    var currentDate = new Date();
    var daysOfWeek = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    var dayOfWeek = daysOfWeek[currentDate.getDay()];
    var formattedDate = dayOfWeek + ', ' + currentDate.getDate() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear() + ', ' + ('0' + currentDate.getHours()).slice(-2) + ':' + ('0' + currentDate.getMinutes()).slice(-2);
    dateTimeElement.textContent = formattedDate;
}


setInterval(updateDateTime, 1000);


updateDateTime();



