# ALM-Team-Tim-BE

POST: http://localhost:8081/auth/register
{
"username": "updateduser5",
"password": "123",
"email": "abc5@gmail.com"
}

POST :http://localhost:8081/auth/login
{
"usernameOrEmail": "updateduser5",
"password": "123"
}

GET: http://localhost:8081/users

GET: http://localhost:8081/users/{id}

<!-- GET: http://localhost:8081/users/{email} -->

PUT:http://localhost:8081/users/{id}
{
"username": "user5",
"password": "123",
"email": "abc6@gmail.com",
"phoneNumber": 123456789,
"profileImage": null,
"role": null,
"createdAt": "2025-09-29T17:08:15",
"passwordChangedAt": null
}

GET http://localhost:8081/profile/users/{id}

# NGười dùng quên mk và yêu cầu reset mk

POST http://localhost:8081/auth/forgot-password

{
"email": "lehbac05@gmail.com",
}

POST http://localhost:8081/auth/verify-otp

{
"email": "lehbac05@gmail.com",
"otp": "654713"
}

POST http://localhost:8081/auth//reset-password

{
"email": "lehbac05@gmail.com",
"reset_token": "HgYvhHNDAm1f9nawYxKYrontS2_VbH7fMuZS4ey48go",
"newPassword": "123456"
}

1. Upload Avatar (POST /api/users/{userId}/avatar)

Method: POST
URL: http://localhost:8080/api/users/1/avatar (thay 1 bằng userId hợp lệ).
Headers:

Content-Type: multipart/form-data

Body:

Chọn form-data.
Key: file, Type: File, Value: Chọn file ảnh (ví dụ: avatar.jpg).

Kỳ vọng:

Status: 200 OK
Response: "Avatar uploaded successfully: <uniqueFilename>"

Lưu ý: Nếu user không tồn tại, file sẽ bị xóa và trả về 404.

2. Lấy Avatar (GET /api/users/{userId}/avatar)

Method: GET
URL: http://localhost:8080/api/users/1/avatar
Headers: Không cần (trừ auth).
Kỳ vọng:

Status: 200 OK
Response: "/uploads/<uniqueFilename>"
Status: 404 nếu không có avatar.

3. Lấy Danh sách Ảnh (GET /api/users/{userId}/images)

Method: GET
URL: http://localhost:8080/api/users/1/images
Headers: Không cần (trừ auth).
Kỳ vọng:

Status: 200 OK
Response: JSON array (ví dụ: [{"id": 1, "userId": 1, "imageUrl": "/uploads/xxx.jpg", "createdAt": "2025-10-02T15:00:00"}])
Status: 404 nếu không có ảnh.

4. Xóa Avatar (DELETE /api/users/{userId}/avatar)

Method: DELETE
URL: http://localhost:8080/api/users/1/avatar
Headers: Thêm Authorization nếu yêu cầu auth.
Kỳ vọng:

Status: 200 OK
Response: "Avatar deleted successfully"
Status: 404 nếu không có avatar.

5. Xóa Tất cả Ảnh (DELETE /api/users/{userId}/images)

Method: DELETE
URL: http://localhost:8080/api/users/1/images
Headers: Thêm Authorization nếu yêu cầu auth.
Kỳ vọng:

Status: 200 OK
Response: "All images deleted successfully"
Status: 404 nếu không có ảnh.
