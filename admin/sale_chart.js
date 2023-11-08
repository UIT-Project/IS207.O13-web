const ctx = document.getElementById('saleChart');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [{
      label: 'Doanh thu',
      data: [5, 15, 50, 20, 30, 80, 20],
      borderWidth: 1,
      fill: {
        target: 'origin',
        above: 'rgba(14, 156, 255, 0.1)'
      }
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});