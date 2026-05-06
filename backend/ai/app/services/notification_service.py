import os
from typing import List

from app.core.config import settings
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import EmailStr
from twilio.rest import Client

# --- Email Configuration ---
if settings.SMTP_USER:
    email_conf = ConnectionConfig(
        MAIL_USERNAME=settings.SMTP_USER,
        MAIL_PASSWORD=settings.SMTP_PASSWORD,
        MAIL_FROM=settings.SMTP_USER,
        MAIL_PORT=settings.SMTP_PORT,
        MAIL_SERVER=settings.SMTP_SERVER,
        MAIL_STARTTLS=True,  # Assuming Gmail/standard SMTP
        MAIL_SSL_TLS=False,
        USE_CREDENTIALS=True,
        VALIDATE_CERTS=True
    )
    email_service = FastMail(email_conf)
else:
    email_conf = None
    email_service = None

# --- SMS Configuration ---
twilio_client = None
if os.getenv("TWILIO_ACCOUNT_SID"):
    twilio_client = Client(
        os.getenv("TWILIO_ACCOUNT_SID"),
        os.getenv("TWILIO_AUTH_TOKEN")
    )


class NotificationService:
    
    @staticmethod
    async def send_email(recipients: List[EmailStr], subject: str, body: str):
        """Send an email using FastAPI-Mail"""
        if not email_service:
            return  # Email not configured
        message = MessageSchema(
            subject=subject,
            recipients=recipients,
            body=body,
            subtype=MessageType.html
        )
        await email_service.send_message(message)

    @staticmethod
    async def send_sms(to_number: str, body: str):
        """Send SMS using Twilio"""
        if not twilio_client:
            print("Twilio not configured, skipping SMS")
            return
        
        try:
            twilio_client.messages.create(
                body=body,
                from_=os.getenv("TWILIO_PHONE_NUMBER"),
                to=to_number
            )
        except Exception as e:
            print(f"Failed to send SMS: {str(e)}")

    @staticmethod
    async def send_booking_confirmation(user_email: str, user_phone: str, booking_details: dict):
        # 1. Send Email
        html_content = f"""
        <h1>Booking Confirmed!</h1>
        <p>Your booking at {booking_details['property_name']} is confirmed.</p>
        <p>Total: ${booking_details['total_amount']}</p>
        """
        await NotificationService.send_email([user_email], "Booking Confirmed", html_content)

        # 2. Send SMS
        sms_body = f"GoFlex: Booking confirmed at {booking_details['property_name']}. Check email for details."
        await NotificationService.send_sms(user_phone, sms_body)
