import os
import sys
from datetime import datetime, timedelta
from app.core.database import SessionLocal, engine, Base
from app.models.database_models import User, Property, Owner, Resident, Booking, PaymentTransaction, UserRole

# Add current directory to path
sys.path.append(os.getcwd())

def seed_demo_data():
    Base.metadata.create_all(engine)
    db = SessionLocal()
    try:
        print("Starting Python Demo Seed...")
        
        # 1. Create Owner User
        owner_user = db.query(User).filter(User.email == "owner@goflex.com").first()
        if not owner_user:
            owner_user = User(
                username="prime_owner",
                email="owner@goflex.com",
                password_hash="$2a$10$S9G8hM7.fGf/XG.L4Lz5vO9o0rQZ6v5L7s4t5vO9o0rQZ6v5L7s4t", # Valid bcrypt for 'password123'
                full_name="Vikram Singh",
                role=UserRole.OWNER,
                is_active=True
            )
            db.add(owner_user)
            db.commit()
            db.refresh(owner_user)
            print(f"Created Owner User: {owner_user.email}")

        # 2. Create Owner Profile
        owner_profile = db.query(Owner).filter(Owner.user_id == owner_user.id).first()
        if not owner_profile:
            owner_profile = Owner(
                user_id=owner_user.id,
                company_name="Singh Properties Group",
                verified=True
            )
            db.add(owner_profile)
            db.commit()
            db.refresh(owner_profile)
            print("Created Owner Profile")

        # 3. Create Properties
        properties = []
        p1 = db.query(Property).filter(Property.name == "Cyber Heights Residency").first()
        if not p1:
            p1 = Property(
                owner_id=owner_profile.id,
                name="Cyber Heights Residency",
                description="Ultra-modern co-living with smart automation in Indiranagar.",
                city="Bengaluru",
                state="Karnataka",
                state_iso="KA",
                monthly_price=22000.0,
                rent=22000.0,
                occupancy=95.0,
                active=True,
                cover_image_url="https://images.pexels.com/photos/12313626/pexels-photo-12313626.jpeg"
            )
            db.add(p1)
            properties.append(p1)

        p2 = db.query(Property).filter(Property.name == "The Whitehouse Suites").first()
        if not p2:
            p2 = Property(
                owner_id=owner_profile.id,
                name="The Whitehouse Suites",
                description="Luxury heritage stay near Whitefield tech corridor.",
                city="Bengaluru",
                state="Karnataka",
                state_iso="KA",
                monthly_price=18000.0,
                rent=18000.0,
                occupancy=88.0,
                active=True,
                cover_image_url="https://images.pexels.com/photos/1535162/pexels-photo-1535162.jpeg"
            )
            db.add(p2)
            properties.append(p2)

        db.commit()
        print("Created Properties")

        # 4. Create Residents
        residents = []
        for i in range(1, 4):
            email = f"resident{i}@example.com"
            user = db.query(User).filter(User.email == email).first()
            if not user:
                user = User(
                    username=f"resident_{i}",
                    email=email,
                    password_hash="pbkdf2:sha256:260000$somehashedpassword",
                    full_name=f"Resident {i}",
                    role=UserRole.RESIDENT,
                    is_active=True
                )
                db.add(user)
                db.commit()
                db.refresh(user)
                
                res_profile = Resident(
                    user_id=user.id,
                    property_id=p1.id if i < 3 else p2.id,
                    check_in_date=datetime.now() - timedelta(days=30),
                    kyc_status="verified"
                )
                db.add(res_profile)
                residents.append(res_profile)
        
        db.commit()
        print("Created Residents")

        # 5. Create Bookings and Payments
        for res in residents:
            booking = Booking(
                property_id=res.property_id,
                resident_id=res.id,
                check_in_date=res.check_in_date,
                check_out_date=res.check_in_date + timedelta(days=180),
                total_amount=22000.0 if res.property_id == p1.id else 18000.0,
                status="active",
                payment_status="completed"
            )
            db.add(booking)
            db.commit()
            db.refresh(booking)

            # Add some payment history
            for m in range(1, 4):
                payment = PaymentTransaction(
                    booking_id=booking.id,
                    user_id=res.user_id,
                    amount=booking.total_amount,
                    stripe_payment_id=f"demo_pay_{booking.id}_{m}",
                    status="completed",
                    created_at=datetime.now() - timedelta(days=30*m)
                )
                db.add(payment)
        
        db.commit()
        print("Created Bookings and Payments")
        print("Demo Seed Successful!")

    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_demo_data()
