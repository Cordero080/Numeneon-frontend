# Team Plan - NUMENEON

Welcome to the team plan documentation! This folder contains individual task assignments and planning documents for each team member.

---

## 📁 What's in this folder?

| File                | Description                                  |
| ------------------- | -------------------------------------------- |
| `team-structure.md` | Team roles and responsibilities overview     |
| `colin.md`          | Colin's assigned tasks and progress          |
| `crystal.md`        | Crystal's assigned tasks and progress        |
| `natalia.md`        | Natalia's assigned tasks and progress        |
| `pablo.md`          | Pablo's assigned tasks and progress          |
| `tito.md`           | Tito's assigned tasks and progress           |
| `frontend-tree.md`  | Visual map of the frontend project structure |

---

## 🛠️ How the Makefile Works

The **Makefile** is located at the root of the project (`/Numeneon-frontend/Makefile`). It provides shortcuts for common terminal commands so you don't have to type long commands every time.

### What is a Makefile?

A Makefile is a simple text file that stores shortcuts for terminal commands. The `make` command is **built into macOS and Linux** - you don't need to install anything!

### How to Use

1. **Open your terminal**
2. **Navigate to the project root:**
   ```bash
   cd ~/code/ga/unit-4/Numeneon-frontend
   ```
3. **Run any command using `make <shortcut>`**

### ⚠️ Important Rules

- You **MUST** type `make` before every shortcut
- ✅ Correct: `make f`
- ❌ Wrong: `f`

---

## 📋 Available Commands

### 🚀 Server Commands

| Command    | What it does                                                      |
| ---------- | ----------------------------------------------------------------- |
| `make b`   | Start **backend** (Django) server at `http://localhost:8000`      |
| `make f`   | Start **frontend** (Vite/React) server at `http://localhost:5173` |
| `make dev` | Start **BOTH** servers (opens new terminal for frontend)          |

### 🗄️ Database Commands

| Command               | What it does                                     |
| --------------------- | ------------------------------------------------ |
| `make migrate`        | Apply pending database migrations                |
| `make makemigrations` | Create new migration files after changing models |
| `make seed`           | Populate database with test data                 |
| `make shell`          | Open Django interactive shell                    |
| `make dbshell`        | Open SQLite shell for raw SQL queries            |

### 👤 User Management

| Command          | What it does                                |
| ---------------- | ------------------------------------------- |
| `make superuser` | Create an admin user for Django admin panel |
| `make users`     | List all users in the database              |

### 📦 Install & Setup

| Command                 | What it does                                       |
| ----------------------- | -------------------------------------------------- |
| `make install`          | Install **both** frontend and backend dependencies |
| `make install-frontend` | Install frontend npm packages only                 |
| `make install-backend`  | Install backend Python packages only               |

### 🔀 Git Commands

| Command       | What it does                    |
| ------------- | ------------------------------- |
| `make status` | Check git status                |
| `make push`   | Push current branch to origin   |
| `make pull`   | Pull latest changes from origin |

### 🧹 Cleanup & Testing

| Command      | What it does              |
| ------------ | ------------------------- |
| `make test`  | Run Django tests          |
| `make clean` | Remove Python cache files |

---

## 🎯 Quick Start for New Team Members

```bash
# 1. Clone the repo and navigate to it
cd ~/code/ga/unit-4/Numeneon-frontend

# 2. Install all dependencies
make install

# 3. Start both servers
make dev

# OR start them separately in different terminals:
make b    # Terminal 1 - Backend
make f    # Terminal 2 - Frontend
```

---

## 💡 Pro Tips

1. **Always run `make migrate`** after pulling new code that might have database changes
2. **Use `make dev`** for the fastest setup - it opens both servers automatically
3. **Check `make status`** before committing to see what files you've changed
4. **Run `make clean`** if you're having weird Python cache issues

---

## 📚 Related Documentation

- [Backend Setup Guide](../../BACKEND_SETUP.md)
- [Backend README](../../BACKEND_README.md)
- [Frontend README](../../frontend/README.md)
- [Frontend Structure](./frontend-tree.md)
