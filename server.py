from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import base64
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

app = FastAPI()

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request body model
class EmailRequest(BaseModel):
    email: str
    image: str

@app.post("/send-email")
async def send_email(request: EmailRequest):
    email = request.email
    image = request.image

    if not email or not image:
        raise HTTPException(status_code=400, detail="Email and image are required.")

    print("Received email:", email)
    # print("Received image data URL:", image)

    try:
        # Decode the base64 image
        image_data = image.split("base64,")[1]
        image_bytes = base64.b64decode(image_data)

        # Configure email
        sender_email = "test@resend.dev"
        sender_password = "your-resend-password"  # Replace with your email password
        smtp_server = "smtp.resend.com"
        smtp_port = 587

        # Create email message
        message = MIMEMultipart()
        message["From"] = sender_email
        message["To"] = email
        message["Subject"] = "Your Chart Image"

        # Email body
        message.attach(MIMEText("Please find your chart image attached.", "plain"))

        # Attach the image
        attachment = MIMEBase("application", "octet-stream")
        attachment.set_payload(image_bytes)
        encoders.encode_base64(attachment)
        attachment.add_header(
            "Content-Disposition",
            f"attachment; filename=chart.png",
        )
        message.attach(attachment)

        # Send email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, email, message.as_string())

        return {"message": "Email sent successfully."}
    except Exception as e:
        print("Error sending email:", e)
        raise HTTPException(status_code=500, detail="Failed to send email.")

# Start server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=3000)