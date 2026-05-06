# Face Recognition Portal Verification Guide

## Overview

The face recognition system is used **exclusively for portal entry verification** during the KYC (Know Your Customer) process. It is **NOT** used for attendance tracking.

## Key Features

- **Portal Entry Verification**: Users register their face during KYC
- **Login Enhancement**: Optional face verification during login
- **Access Control**: Face-based verification for portal access
- **Verification History**: Track all face verification attempts
- **Security**: Encrypted face encodings stored in database

## Database Models

### FaceEncodingData
Stores encrypted face encodings for users who have completed face registration during KYC.

```python
- user_id: Foreign key to User
- encoding_data: Binary pickle of face encoding
- created_at: Registration timestamp
- updated_at: Last update timestamp
```

### FaceVerificationLog
Logs all face verification attempts for audit and security purposes.

```python
- user_id: User attempting verification
- verification_status: success, failed, pending
- confidence_score: Float (0-1) indicating match quality
- verified_at: When verification occurred
- created_at: Log timestamp
```

## API Endpoints

### 1. Register Face for Verification
**POST** `/api/kyc/register-face`

Register a user's face for portal verification (KYC process).

**Request:**
- `file`: Image file (JPG/PNG)
- `token`: JWT authentication token

**Response:**
```json
{
  "message": "Face registered successfully for portal verification",
  "user_id": 123
}
```

**Requirements:**
- User must be authenticated
- User must be verified (is_verified = true)
- Image must contain exactly one clear face

---

### 2. Verify Face for Portal Entry
**POST** `/api/kyc/verify-face-for-entry`

Verify a user's face during login or access attempt.

**Request:**
- `user_id`: User ID (form data)
- `base64_image`: Base64 encoded image (form data)

**Response:**
```json
{
  "verified": true,
  "confidence": 0.987,
  "message": "Face verified successfully"
}
```

**Confidence Score:**
- `0.9+`: Excellent match
- `0.8-0.9`: Good match
- `0.7-0.8`: Acceptable match
- `< 0.7`: Poor match (rejected)

---

### 3. Check Face Registration Status
**GET** `/api/kyc/face-registered`

Check if user has registered their face.

**Request:**
- `token`: JWT authentication token

**Response:**
```json
{
  "user_id": 123,
  "face_registered": true,
  "message": "Face is registered for portal verification"
}
```

---

### 4. Get Verification History
**GET** `/api/kyc/verification-history?limit=10`

Get user's face verification attempt history.

**Request:**
- `token`: JWT authentication token
- `limit`: Number of records (default: 10)

**Response:**
```json
{
  "user_id": 123,
  "username": "john_doe",
  "verification_history": [
    {
      "id": 1,
      "status": "success",
      "confidence": 0.985,
      "verified_at": "2024-01-15T10:30:00",
      "created_at": "2024-01-15T10:30:00"
    }
  ]
}
```

## Integration with KYC Process

1. **User Registers Account**: Standard registration via `/api/auth/register`
2. **User Verifies Email/Phone**: Manual verification process
3. **User Registers Face**: Upload photo via `/api/kyc/register-face`
4. **Face Stored**: Face encoding saved in database
5. **Portal Access**: User can verify identity via face during login

## Face Recognition Settings

Configuration in `app/core/config.py`:

```python
# Tolerance for face matching (lower = stricter)
FACE_RECOGNITION_TOLERANCE = 0.6

# Model for face detection
FACE_RECOGNITION_MODEL = "hog"  # "hog" or "cnn"
```

## Security Considerations

1. **Face Encodings**: Stored as binary pickle objects, not images
2. **Verification Logs**: All attempts logged for audit trail
3. **User Status**: Only active and verified users can register/verify
4. **Confidence Threshold**: Configurable matching tolerance
5. **Image Handling**: Temporary files deleted after processing

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "No face detected" | Image doesn't contain a face | Upload clear photo of face |
| "Multiple faces detected" | More than one person in image | Upload photo with only your face |
| "Face verification failed" | Face doesn't match registered face | Ensure good lighting, similar angle |
| "User has no registered face" | Face not registered yet | Register face via `/api/kyc/register-face` |

## Removed Features

The following attendance-related features have been **removed**:
- ❌ Attendance marking via face recognition
- ❌ Entry/exit time recording
- ❌ Attendance analytics
- ❌ Camera location tracking
- ❌ Attendance records database model

Face recognition is **exclusively** for portal entry verification.

## Example Workflow

### Frontend Implementation

```javascript
// 1. Register face
const formData = new FormData();
formData.append('file', imageFile);
const response = await fetch('/api/kyc/register-face', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});

// 2. Verify face for portal entry
const verifyResponse = await fetch('/api/kyc/verify-face-for-entry', {
  method: 'POST',
  body: new URLSearchParams({
    user_id: userId,
    base64_image: base64EncodedImage
  })
});
const result = await verifyResponse.json();
if (result.verified && result.confidence > 0.8) {
  // Grant portal access
}
```

## Requirements

- OpenCV for image processing
- face_recognition library for face detection/encoding
- dlib for face recognition algorithms
- PostgreSQL for storing face encodings

## Testing

```bash
# Run tests
pytest app/services/test_face_recognition.py

# Test face registration
curl -X POST http://localhost:8000/api/kyc/register-face \
  -H "Authorization: Bearer <token>" \
  -F "file=@image.jpg"

# Test face verification
curl -X POST http://localhost:8000/api/kyc/verify-face-for-entry \
  -d "user_id=1&base64_image=<base64_image>"
```

## Performance Notes

- First load of known faces: ~500ms
- Face encoding extraction: ~1-2 seconds per image
- Face comparison: ~10ms per comparison
- Recommended batch size: 100-1000 users

## Future Enhancements

- Multi-face angle support
- Liveness detection (prevent spoofing)
- Mobile biometric integration
- WebRTC real-time verification
- Two-factor authentication with face
