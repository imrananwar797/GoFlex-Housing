"""
Face Recognition Service for Portal Entry Verification
Used for verifying user identity during portal login/access
"""

import asyncio
import base64
import logging
import pickle
from datetime import datetime
from io import BytesIO
from typing import Dict, Optional, Tuple

try:
    import cv2
    import face_recognition
    import numpy as np
    from PIL import Image
    FACE_RECOGNITION_AVAILABLE = True
except ImportError:
    cv2 = None
    face_recognition = None
    np = None
    Image = None
    FACE_RECOGNITION_AVAILABLE = False

from app.core.config import settings
from app.models.database_models import (FaceEncodingData, FaceVerificationLog,
                                        User)
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)


class FaceRecognitionService:
    """Service for face recognition based portal verification"""
    
    def __init__(self):
        self.tolerance = settings.FACE_RECOGNITION_TOLERANCE
        self.model = settings.FACE_RECOGNITION_MODEL
    
    def encode_face_from_image(self, image_path: str) -> Optional['np.ndarray']:
        if not FACE_RECOGNITION_AVAILABLE:
            logger.error("Face recognition not available")
            return None
        """Extract face encoding from image file"""
        try:
            # Load image
            image = face_recognition.load_image_file(image_path)
            
            # Find face locations
            face_locations = face_recognition.face_locations(image, model=self.model)
            
            if len(face_locations) == 0:
                logger.warning("No faces found in the image")
                return None
            
            if len(face_locations) > 1:
                logger.warning("Multiple faces found, using the first one")
            
            # Get face encodings
            face_encodings = face_recognition.face_encodings(image, face_locations)
            
            if len(face_encodings) > 0:
                return face_encodings[0]
            else:
                return None
                
        except Exception as e:
            logger.error(f"Error encoding face from image: {str(e)}")
            return None
    
    def encode_face_from_base64(self, base64_image: str) -> Optional['np.ndarray']:
        """Extract face encoding from base64 encoded image"""
        try:
            # Decode base64 image
            image_data = base64.b64decode(base64_image)
            image = Image.open(BytesIO(image_data))
            
            # Convert PIL image to numpy array
            image_array = np.array(image)
            
            # Find face locations
            face_locations = face_recognition.face_locations(image_array, model=self.model)
            
            if len(face_locations) == 0:
                logger.warning("No face found in provided image")
                return None
            
            if len(face_locations) > 1:
                logger.warning("Multiple faces detected, using the most prominent")
            
            # Get face encodings
            face_encodings = face_recognition.face_encodings(image_array, face_locations)
            
            if len(face_encodings) > 0:
                return face_encodings[0]
            else:
                return None
                
        except Exception as e:
            logger.error(f"Error encoding face from base64: {str(e)}")
            return None
    
    async def register_face_for_verification(self, user_id: int, image_path: str, db: Session) -> bool:
        """
        Register a face for portal entry verification (KYC process)
        """
        try:
            # Run CPU-bound task in thread pool to avoid blocking async loop
            loop = asyncio.get_running_loop()
            face_encoding = await loop.run_in_executor(None, self.encode_face_from_image, image_path)
            
            if face_encoding is None:
                logger.warning(f"Failed to extract face from image for user {user_id}")
                return False
            
            # Check if user exists and is verified
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                logger.warning(f"User {user_id} not found")
                return False
            
            # Check if user already has face data
            existing_face = db.query(FaceEncodingData).filter(
                FaceEncodingData.user_id == user_id
            ).first()
            
            # Serialize encoding data
            encoding_data = pickle.dumps(face_encoding)
            
            if existing_face:
                # Update existing face data
                existing_face.encoding_data = encoding_data
                existing_face.updated_at = datetime.utcnow()
                logger.info(f"Updated face encoding for user {user_id}")
            else:
                # Create new face data record
                face_data = FaceEncodingData(
                    user_id=user_id,
                    encoding_data=encoding_data
                )
                db.add(face_data)
                logger.info(f"Registered face for user {user_id}")
            
            db.commit()
            
            return True
            
        except Exception as e:
            logger.error(f"Error registering face: {str(e)}")
            db.rollback()
            return False
    
    async def verify_face_for_portal_entry(
        self,
        user_id: int,
        base64_image: str,
        db: Session
    ) -> Dict[str, any]:
        """
        Verify user face for portal entry
        Returns verification result with confidence score
        """
        try:
            # Run CPU-bound task in thread pool
            loop = asyncio.get_running_loop()
            test_encoding = await loop.run_in_executor(None, self.encode_face_from_base64, base64_image)
            
            if test_encoding is None:
                # Log failed verification attempt
                verification_log = FaceVerificationLog(
                    user_id=user_id,
                    verification_status="failed",
                    confidence_score=0.0,
                    verified_at=datetime.utcnow()
                )
                db.add(verification_log)
                db.commit()
                
                return {
                    "verified": False,
                    "confidence": 0.0,
                    "message": "No face detected in provided image"
                }
            
            # Get the expected user's face encoding
            user_face_data = db.query(FaceEncodingData).filter(
                FaceEncodingData.user_id == user_id
            ).first()
            
            if not user_face_data:
                verification_log = FaceVerificationLog(
                    user_id=user_id,
                    verification_status="failed",
                    confidence_score=0.0,
                    verified_at=datetime.utcnow()
                )
                db.add(verification_log)
                db.commit()
                
                return {
                    "verified": False,
                    "confidence": 0.0,
                    "message": "User has no registered face for verification"
                }
            
            # Deserialize stored face encoding
            known_encoding = pickle.loads(user_face_data.encoding_data)
            
            # Compare faces
            is_match, confidence = self.verify_face_match(known_encoding, test_encoding)
            
            # Log verification attempt
            verification_log = FaceVerificationLog(
                user_id=user_id,
                verification_status="success" if is_match else "failed",
                confidence_score=float(confidence),
                verified_at=datetime.utcnow()
            )
            db.add(verification_log)
            db.commit()
            
            return {
                "verified": is_match,
                "confidence": round(float(confidence), 3),
                "message": "Face verified successfully" if is_match else "Face verification failed"
            }
            
        except Exception as e:
            logger.error(f"Error verifying face: {str(e)}")
            return {
                "verified": False,
                "confidence": 0.0,
                "message": "Error during face verification"
            }
    
    def verify_face_match(self, known_encoding: 'np.ndarray', test_encoding: 'np.ndarray') -> Tuple[bool, float]:
        """
        Verify if two face encodings match
        Returns: (is_match, confidence_score)
        """
        try:
            # Calculate face distance
            face_distance = face_recognition.face_distance([known_encoding], test_encoding)[0]
            
            # Determine if faces match based on tolerance
            is_match = face_distance <= self.tolerance
            
            # Calculate confidence (1 - distance)
            confidence = 1 - face_distance
            
            return is_match, confidence
            
        except Exception as e:
            logger.error(f"Error verifying face match: {str(e)}")
            return False, 0.0
    
    async def get_verification_history(self, user_id: int, db: Session, limit: int=10) -> list:
        """Get recent face verification attempts for a user"""
        try:
            logs = db.query(FaceVerificationLog).filter(
                FaceVerificationLog.user_id == user_id
            ).order_by(FaceVerificationLog.created_at.desc()).limit(limit).all()
            
            return [
                {
                    "id": log.id,
                    "status": log.verification_status,
                    "confidence": log.confidence_score,
                    "verified_at": log.verified_at.isoformat() if log.verified_at else None,
                    "created_at": log.created_at.isoformat()
                }
                for log in logs
            ]
            
        except Exception as e:
            logger.error(f"Error getting verification history: {str(e)}")
            return []


# Singleton instance
face_recognition_service = FaceRecognitionService()
