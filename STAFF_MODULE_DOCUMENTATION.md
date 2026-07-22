# Staff Account Management Module

## Overview
This module provides a comprehensive system for creating and managing hospital staff accounts in the N-GEMS system. It includes:
- Staff account creation with role-based access control
- Firebase authentication integration
- Photo upload to Firebase Storage
- Firestore database storage
- Real-time sync with the database

## Features

### 1. Create Staff Account
- **File**: `app/dashboard/create-staff/page.tsx`
- **Functionality**:
  - Comprehensive staff form with personal, professional, and account information
  - Role-based auto-generated employee IDs
  - Photo upload with preview
  - Real-time permissions preview based on selected role
  - Database synchronization
  - Firebase Authentication user creation

### 2. API Endpoint
- **File**: `app/api/staff/route.ts`
- **Methods**:
  - `POST`: Create a new staff account
  - `GET`: Retrieve staff members (filtered by hospital and role)

### 3. Types & Services
- **Types**: `lib/types.ts` - TypeScript interfaces for staff data
- **Service**: `lib/staff-service.ts` - Reusable functions for staff operations
- **Helpers**: `lib/staff-helpers.ts` - Constants and validation utilities

## API Documentation

### POST /api/staff - Create Staff Account

#### Request Body
```json
{
  "hospitalId": "HOS-0001",
  "hospitalName": "National Hospital Colombo",
  "role": "Doctor",
  "fullName": "Dr. Anjali Perera",
  "nic": "199512345678",
  "dob": "1995-12-15",
  "gender": "Female",
  "mobile": "+94771234567",
  "email": "anjali.perera@hospital.gov",
  "address": "123 Main Street, Colombo",
  "department": "Cardiology",
  "employeeId": "DOC-0043",
  "specialization": "Cardiothoracic Surgery",
  "medicalRegNo": "SLMC 45231",
  "licenseNo": "License123",
  "joiningDate": "2024-01-15",
  "employmentType": "Permanent",
  "username": "dr.anjali",
  "status": "Active",
  "password": "SecurePassword123",
  "confirmPassword": "SecurePassword123",
  "photoBase64": "data:image/jpeg;base64,...",
  "createdBy": "Admin User"
}
```

#### Response - Success (201)
```json
{
  "success": true,
  "message": "Staff account created successfully for Dr. Anjali Perera",
  "staffId": "doc_12345",
  "employeeId": "DOC-0043"
}
```

#### Response - Error (400/500)
```json
{
  "success": false,
  "error": "Error description"
}
```

### GET /api/staff - Get Staff Members

#### Query Parameters
- `hospitalId` (required): Hospital ID to fetch staff for
- `role` (optional): Filter by staff role

#### Example
```
GET /api/staff?hospitalId=HOS-0001&role=Doctor
```

#### Response
```json
{
  "success": true,
  "data": [
    {
      "id": "doc_12345",
      "uid": "firebase_uid",
      "hospitalId": "HOS-0001",
      "role": "Doctor",
      "fullName": "Dr. Anjali Perera",
      "employeeId": "DOC-0043",
      "status": "Active",
      "createdAt": "2024-01-15T10:30:00Z",
      ...
    }
  ]
}
```

## Database Schema (Firestore)

### Collection: `staff`

**Document Structure**:
```
{
  uid: string                    // Firebase Auth UID
  hospitalId: string            // Hospital ID
  hospitalName: string          // Hospital Name
  role: string                  // Staff role
  fullName: string              // Full name
  nic: string                   // National ID
  dob: string                   // Date of birth (YYYY-MM-DD)
  gender: string                // Gender
  mobile: string                // Mobile number
  email: string                 // Email address
  address: string               // Residential address
  department: string            // Department
  employeeId: string            // Auto-generated employee ID
  specialization?: string       // Medical specialization (for doctors)
  medicalRegNo?: string         // Medical registration number (for doctors)
  licenseNo?: string            // License number (optional)
  joiningDate: string           // Joining date (YYYY-MM-DD)
  employmentType: string        // Permanent/Contract/Temporary
  username: string              // Login username
  status: string                // Active/Inactive
  photoUrl?: string             // Firebase Storage photo URL
  createdAt: timestamp          // Creation timestamp
  updatedAt: timestamp          // Last update timestamp
  createdBy: string             // Admin who created the account
}
```

**Indexes**:
- `hospitalId` + `status`
- `hospitalId` + `role`
- `email` (unique)
- `username` + `hospitalId` (unique)

## Usage Examples

### Create a Staff Account (Frontend)

```typescript
import { createStaffAccount, convertFileToBase64 } from "@/lib/staff-service";

// In your component
const handleCreateStaff = async (formData, photoFile) => {
  const photoBase64 = photoFile ? await convertFileToBase64(photoFile) : "";
  
  const response = await createStaffAccount({
    ...formData,
    hospitalId: "HOS-0001",
    hospitalName: "National Hospital Colombo",
    photoBase64,
    createdBy: currentUser.displayName,
  });

  if (response.success) {
    console.log("Staff created:", response.staffId);
  } else {
    console.error("Error:", response.error);
  }
};
```

### Fetch Staff List

```typescript
import { getStaffList } from "@/lib/staff-service";

const staffMembers = await getStaffList("HOS-0001", "Doctor");
console.log(staffMembers);
```

### Update Staff Status

```typescript
import { deactivateStaffAccount, reactivateStaffAccount } from "@/lib/staff-service";

// Deactivate staff
await deactivateStaffAccount("doc_12345");

// Reactivate staff
await reactivateStaffAccount("doc_12345");
```

## Configuration

### Environment Variables
Required Firebase configuration in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
FIREBASE_PRIVATE_KEY=xxx
FIREBASE_CLIENT_EMAIL=xxx
```

See `.env.local.example` for all required variables.

## Security Considerations

1. **Authentication**: All API endpoints should validate the request is from an authenticated user
2. **Authorization**: Implement role-based access control (RBAC) to ensure only authorized admins can create staff
3. **Photo Upload**: Photos are validated for type and size before upload
4. **Password Security**: Passwords are never stored in Firestore; only handled by Firebase Auth
5. **Email Validation**: Unique email constraint prevents duplicate accounts
6. **Custom Claims**: Staff role and permissions are set as Firebase custom claims for efficient access control

## TODO - Important Implementation Notes

### 1. User Context Integration
Update the `getHospitalContext()` and `getUserContext()` functions in `lib/staff-helpers.ts` to:
- Get current hospital ID from user session or app context
- Get current user info from Firebase Auth
- Consider using React Context or Redux for state management

### 2. Authentication & Authorization
Add middleware/guards to protect the `/api/staff` endpoint:
- Verify Firebase token
- Check if user has admin role
- Validate hospital ID matches user's hospital

### 3. Input Validation
Enhance server-side validation in `/api/staff/route.ts`:
- Validate all field formats
- Check NIC format (Sri Lankan format)
- Validate mobile number format
- Sanitize inputs to prevent injection attacks

### 4. Error Handling
Add comprehensive error handling:
- Catch specific Firebase errors
- Provide meaningful error messages to users
- Log errors for debugging

### 5. Additional Features
Consider implementing:
- Staff list/management page
- Staff profile view and edit
- Bulk import from CSV
- Staff deactivation/activation
- Password reset functionality
- Audit logs for staff account changes

## Testing

### Unit Tests
```bash
npm test -- lib/staff-service.ts
npm test -- lib/staff-helpers.ts
```

### Integration Tests
Test the API endpoints:
```bash
# Create staff
curl -X POST http://localhost:3000/api/staff \
  -H "Content-Type: application/json" \
  -d @staff-payload.json

# Get staff list
curl http://localhost:3000/api/staff?hospitalId=HOS-0001
```

## Troubleshooting

### Common Issues

1. **"Email already registered"**
   - User already exists in Firebase Auth
   - Check if staff member is already in database

2. **"Failed to upload photo"**
   - Check Firebase Storage permissions
   - Ensure storage bucket is configured
   - Verify file size is under 2MB

3. **"Custom claims not set"**
   - User was created but custom claims failed
   - Staff can still log in but may lack role permissions
   - Re-set claims using Firebase Admin Console

4. **Firestore write fails but fallback succeeds**
   - Check Firebase project quota
   - Verify Firestore database is active
   - Check network connectivity

## Support

For issues or questions about the staff module, refer to:
- Firebase Documentation: https://firebase.google.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Project README: ../README.md
