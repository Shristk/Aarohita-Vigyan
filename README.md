
# Task Scheduler Pro

A modern full-stack task management application built with **Django REST Framework** and **React**.  
It features advanced scheduling, priority management, and a beautiful glass morphism UI.

---

## 🚀 Features

- ✅ Create, edit, and delete tasks with rich descriptions  
- ✅ Schedule tasks with due dates and priority levels (Low, Medium, High, Urgent)  
- ✅ Smart filtering (All, Pending, Completed, Today, Overdue, Scheduled)  
- ✅ Real-time progress tracking with a statistics dashboard  
- ✅ Responsive glass morphism UI design  
- ✅ Bulk operations and instant updates  
- ✅ Visual indicators for overdue and priority tasks  

---

## ⚙️ Technologies

- Backend: Django 4.2.7 | Python 3.8+ | Django REST Framework  
- Frontend: React 18 | JavaScript ES6+  
- Database: SQLite (default)  
- Icons: Lucide Icons  

---

## 📦 Quick Start

### Prerequisites

- Python 3.8 or higher  
- Node.js 14 or higher  
- Git  

### Backend Setup

```bash
git clone https://github.com/yourusername/task-scheduler-pro.git
cd task-scheduler-pro/backend
python -m venv venv
# Activate the virtual environment:
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup

Open a new terminal:

```bash
cd task-scheduler-pro/frontend
npm install
npm start
```

### Access Points

- Frontend: `http://localhost:3000`  
- Backend API: `http://localhost:8000/api/tasks/`  
- Django Admin Panel: `http://localhost:8000/admin/`  

---

## 🔧 API Endpoints

| Method | Endpoint          | Description                   |
|--------|-------------------|-------------------------------|
| GET    | /api/tasks/       | List all tasks                |
| POST   | /api/tasks/       | Create new task               |
| GET    | /api/tasks/{id}/  | Get specific task             |
| PATCH  | /api/tasks/{id}/  | Update task                   |
| DELETE | /api/tasks/{id}/  | Delete task                   |

### Query Parameters

- `?status=pending|completed`  
- `?schedule=today|overdue|scheduled`  
- `?priority=low|medium|high|urgent`  

---

## 🎯 Usage Guide

### Create Task

1. Enter task title  
2. Add description (optional)  
3. Set due date and scheduled date  
4. Select priority (Low, Medium, High, Urgent)  
5. Click **Create Task**

### Manage Tasks

- ✅ Mark as complete (green checkmark)  
- 🔄 Revert to incomplete (orange arrow)  
- 🗑️ Delete (red trash button)  
- Clear all completed tasks  

### Smart Filters

- All / Pending / Completed / Today / Overdue / Scheduled  

---

## 🚀 Deployment

Recommended platform: **Render (Free hosting)**

#### Deployment Steps

1. Push code to GitHub  
2. Create an account at [render.com](https://render.com)  
3. Deploy backend as Web Service  
4. Deploy frontend as Static Site  
5. Set environment variables:

**Backend**
- `SECRET_KEY`  
- `DATABASE_URL`  
- `CORS_ALLOWED_ORIGINS`  

**Frontend**
- `REACT_APP_API_URL`  

Alternative platforms:  
- Vercel + Railway  
- Netlify + Heroku  

---

## 🤝 Contributing

1. Fork the repo  
2. Create feature branch:  
   `git checkout -b feature/your-feature`  
3. Make changes and commit:  
   `git commit -m "Add feature"`  
4. Push branch:  
   `git push origin feature/your-feature`  
5. Open a Pull Request

---

## 📈 Future Roadmap

- Email & Push notifications  
- Advanced analytics dashboard  
- Team collaboration  
- Tags & categories for tasks  
- File attachments  
- Time tracking  
- Mobile app (React Native)  
- Custom themes  

---

## ⚡ Troubleshooting

- Backend not starting → Check virtual env, requirements, migrations  
- Frontend not starting → Clear `node_modules`, check ports  
- API errors → Check CORS & API URL  
- DB errors → Delete `db.sqlite3` and re-run migrations  

---

## 📄 License

MIT License – See LICENSE file for details  

---

## ✉️ Contact

- GitHub: [@yourusername](https://github.com/yourusername)  
- Email: your.email@example.com  
- LinkedIn: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)  

---

## 🙏 Acknowledgments

Thanks to:
- Django Team  
- React Team  
- Lucide Icons  
- Open Source Community  

---

Built with ❤️ using Django REST Framework & React  
_Last updated: September 2025_
