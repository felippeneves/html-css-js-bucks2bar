window.onload = () => {
  const usernameInput = document.getElementById("username");
  const downloadButton = document.getElementById("download");
  const emailButton = document.getElementById("send-email");
  const chartTab = document.getElementById("chart-tab");
  const canvas = document.getElementById("myChart");
  const ctx = canvas.getContext("2d");

  /**
   * Validates the input value of a username field based on specific criteria:
   * - At least one uppercase letter.
   * - At least one special character (!@#$&*~).
   * - At least one digit.
   * - Minimum length of 8 characters.
   * Updates the border color of the username input field to green if valid, or red if invalid.
   *
   * @function usernameInputCallback
   * @returns {void}
   */
  function usernameInputCallback() {
      const username = usernameInput.value;
      const regex = new RegExp(
        "^(?=.*[A-Z])" + // At least one uppercase letter
          "(?=.*[!@#$&*~])" + // At least one special character
          "(?=.*[0-9])" + // At least one digit
          ".{8,}$" // Minimum 8 characters
      );
      usernameInput.style.borderColor = regex.test(username) ? "green" : "red";
  }
  
  usernameInput.addEventListener("input", usernameInputCallback);

  // Download chart as image
  downloadButton.addEventListener("click", () => {
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "chart.png";
    link.click();
  });

  emailButton.addEventListener("click", async () => {
    const image = canvas.toDataURL("image/png");
    const email = document.getElementById("email-address").value;
    if (!email) {
      alert("Email address is required!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email address!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          image,
        }),
      });

      if (response.ok) {
        alert("Email sent successfully!");
      } else {
        alert("Failed to send email. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("An error occurred. Please try again.");
    }
  });

  // Initialize chart
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
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
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
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
