const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json({ limit: "10mb" })); // Allow large payloads for base64 images
app.use(cors()); // Enable CORS for all routes

// Email sending endpoint
app.post("/send-email", async (req, res) => {
  const { email, image } = req.body;

  if (!email || !image) {
    return res.status(400).send("Email and image are required.");
  }

  console.log("Received email:", email);
//   console.log("Received image data URL:", image);

  try {
    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "smtp.resend.com", // Use your email provider
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "resend", // Replace with your email
        pass: "your-resend-password", // Replace with your email password
      },
    });

    // Email options
    const mailOptions = {
      from: "test@resend.dev",
      to: email,
      subject: "Your Chart Image",
      text: "Please find your chart image attached.",
      attachments: [
        {
          filename: "chart.png",
          content: image.split("base64,")[1],
          encoding: "base64",
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email.");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
