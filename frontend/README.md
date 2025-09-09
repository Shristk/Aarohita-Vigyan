# Task Manager Full-Stack Application

A full-stack task management application built with Django REST Framework and React.

## Features

- ✅ Create, read, update, delete tasks
- ✅ Toggle task completion status
- ✅ Beautiful, responsive UI
- ✅ Real-time updates
- ✅ Error handling
- ✅ Admin interface

## Tech Stack

- **Backend**: Django 4.2, Django REST Framework
- **Frontend**: React 18, Axios, Tailwind CSS
- **Database**: SQLite (development)

## Quick Start

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver