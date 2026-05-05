"""Email service for sending confirmations"""
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

class EmailService:
    """Service for sending emails via SMTP"""
    
    def __init__(self):
        self.smtp_server = settings.SMTP_SERVER
        self.smtp_port = settings.SMTP_PORT
        self.smtp_user = settings.SMTP_USER
        self.smtp_password = settings.SMTP_PASSWORD
        self.from_email = settings.SMTP_USER
    
    def send_email(self, to_email: str, subject: str, html_content: str, text_content: Optional[str] = None) -> bool:
        """Send email using SMTP"""
        try:
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = self.from_email
            message["To"] = to_email
            
            # Add text and HTML parts
            if text_content:
                part1 = MIMEText(text_content, "plain")
                message.attach(part1)
            
            part2 = MIMEText(html_content, "html")
            message.attach(part2)
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.sendmail(self.from_email, to_email, message.as_string())
            
            logger.info(f"Email sent successfully to {to_email}")
            return True
        except Exception as e:
            logger.error(f"Error sending email to {to_email}: {str(e)}")
            return False
    
    def send_registration_confirmation(self, email: str, username: str, full_name: Optional[str] = None) -> bool:
        """Send registration confirmation email"""
        name = full_name or username
        subject = "Welcome to GoFlex Housing!"
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #6B2EFF;">Welcome, {name}!</h2>
                    <p>Thank you for registering with GoFlex Housing. Your account has been created successfully.</p>
                    
                    <p><strong>Account Details:</strong></p>
                    <ul>
                        <li>Username: {username}</li>
                        <li>Email: {email}</li>
                    </ul>
                    
                    <p>You can now log in to your account and start exploring available properties or list your own.</p>
                    
                    <p style="margin-top: 20px;">
                        <a href="http://localhost:3000/login" style="background-color: #6B2EFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login Now</a>
                    </p>
                    
                    <p style="margin-top: 20px; font-size: 12px; color: #999;">
                        If you did not create this account, please ignore this email.
                    </p>
                </div>
            </body>
        </html>
        """
        
        text_content = f"Welcome to GoFlex Housing! Your account has been created. Username: {username}, Email: {email}"
        
        return self.send_email(email, subject, html_content, text_content)
    
    def send_booking_confirmation(self, email: str, user_name: str, property_name: str, 
                                 check_in: str, check_out: str, total_amount: float) -> bool:
        """Send booking confirmation email"""
        subject = "Booking Confirmation - GoFlex Housing"
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #6B2EFF;">Booking Confirmed!</h2>
                    <p>Hi {user_name},</p>
                    <p>Your booking has been confirmed successfully.</p>
                    
                    <p><strong>Booking Details:</strong></p>
                    <ul>
                        <li>Property: {property_name}</li>
                        <li>Check-in: {check_in}</li>
                        <li>Check-out: {check_out}</li>
                        <li>Total Amount: ${total_amount:.2f}</li>
                    </ul>
                    
                    <p>You will receive a payment confirmation once the payment is processed.</p>
                    
                    <p style="margin-top: 20px; font-size: 12px; color: #999;">
                        For any inquiries, please contact our support team.
                    </p>
                </div>
            </body>
        </html>
        """
        
        text_content = f"Booking Confirmed! Property: {property_name}, Check-in: {check_in}, Check-out: {check_out}, Amount: ${total_amount:.2f}"
        
        return self.send_email(email, subject, html_content, text_content)
    
    def send_payment_confirmation(self, email: str, user_name: str, transaction_id: str,
                                 amount: float, payment_date: str) -> bool:
        """Send payment confirmation email"""
        subject = "Payment Confirmation - GoFlex Housing"
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #6B2EFF;">Payment Confirmed!</h2>
                    <p>Hi {user_name},</p>
                    <p>Your payment has been processed successfully.</p>
                    
                    <p><strong>Payment Details:</strong></p>
                    <ul>
                        <li>Transaction ID: {transaction_id}</li>
                        <li>Amount: ${amount:.2f}</li>
                        <li>Date: {payment_date}</li>
                        <li>Status: Completed</li>
                    </ul>
                    
                    <p>Thank you for using GoFlex Housing!</p>
                    
                    <p style="margin-top: 20px; font-size: 12px; color: #999;">
                        For any inquiries, please contact our support team.
                    </p>
                </div>
            </body>
        </html>
        """
        
        text_content = f"Payment Confirmed! Transaction ID: {transaction_id}, Amount: ${amount:.2f}, Date: {payment_date}"
        
        return self.send_email(email, subject, html_content, text_content)
    
    def send_kyc_verification_email(self, email: str, user_name: str, status: str) -> bool:
        """Send KYC verification status email"""
        subject = f"KYC Verification Status - {status.capitalize()}"
        
        if status.lower() == "approved":
            message = "Your KYC verification has been approved! You can now access all features."
        elif status.lower() == "rejected":
            message = "Your KYC verification was not approved. Please contact support for more information."
        else:
            message = "Your KYC verification is being processed. We will notify you once it's complete."
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #6B2EFF;">KYC Verification Update</h2>
                    <p>Hi {user_name},</p>
                    <p>{message}</p>
                    
                    <p style="margin-top: 20px; font-size: 12px; color: #999;">
                        For any inquiries, please contact our support team.
                    </p>
                </div>
            </body>
        </html>
        """
        
        return self.send_email(email, subject, html_content)

# Create email service instance
email_service = EmailService()
