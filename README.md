# WebBanHoa - Flower Shop Web Application

Một ứng dụng web bán hoa với cấu trúc monorepo gồm frontend (React + Vite + Tailwind) và backend (Spring Boot).

## Cấu trúc dự án

```
webbanhoa/
├── frontend/          # React + Vite + Tailwind CSS
├── backend/           # Spring Boot 3.x + Java 17
├── README.md
└── .gitignore
```

## Yêu cầu hệ thống

- Node.js >= 18
- Java 17
- Maven 3.6+

## Cách chạy dự án

### Frontend (Port 5173)

```bash
cd frontend
npm install
npm run dev
```

Frontend sẽ chạy tại: http://localhost:5173

### Backend (Port 8080)

```bash
cd backend
mvn spring-boot:run
```

Backend API sẽ chạy tại: http://localhost:8080

## API Endpoints

- GET `/api/flowers` - Lấy danh sách hoa
- GET `/api/flowers/{id}` - Lấy thông tin hoa theo ID

## Công nghệ sử dụng

### Frontend
- React 18
- Vite
- Tailwind CSS
- JavaScript (JSX)

### Backend
- Spring Boot 3.x
- Java 17
- Maven
- Spring Web
