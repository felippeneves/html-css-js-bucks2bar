window.onload = () => {
  const usernameInput = document.getElementById("username");
  const downloadButton = document.getElementById("download");
  const chartTab = document.getElementById("chart-tab");
  const canvas = document.getElementById("myChart");
  const ctx = canvas.getContext("2d");

  // Username validation
  usernameInput.addEventListener("input", () => {
    const username = usernameInput.value;
    const regex = /^(?=.*[A-Z])(?=.*[!@#$&*~])(?=.*[0-9]).{8,}$/;
    usernameInput.style.borderColor = regex.test(username) ? "green" : "red";
  });

  // Download chart as image
  downloadButton.addEventListener("click", () => {
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "chart.png";
    link.click();
  });

  // Initialize chart
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
      ],
      datasets: [
        {
          label: "Income",
          data: [],
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        {
          label: "Expenses",
          data: [],
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  // Update chart data
  chartTab.addEventListener("click", () => {
    const incomeData = [];
    const expensesData = [];
    const months = [
      "jan", "feb", "mar", "apr", "may", "jun",
      "jul", "aug", "sep", "oct", "nov", "dec",
    ];
    months.forEach((month) => {
      const income = document.getElementById(`${month}-income`).value;
      const expenses = document.getElementById(`${month}-expenses`).value;
      incomeData.push(Number(income));
      expensesData.push(Number(expenses));
    });

    myChart.data.datasets[0].data = incomeData;
    myChart.data.datasets[1].data = expensesData;
    myChart.update();
  });
};