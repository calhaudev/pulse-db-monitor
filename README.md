# 📊 Pulse DB Monitor

**Pulse DB Monitor** is a **TypeScript + Fastify** application that performs periodic health checks on a **database** and sends alert emails using **AWS SES**.

> Designed with **SOLID principles** for clean architecture and long-term maintainability. Because keeping your database healthy shouldn’t be a mystery. 🧠💉

---

## 🚀 Features

- 🔁 Periodic health checks (configurable via env, no need for crontab)
- 📧 Email alerts via AWS SES with metric highlights and warnings
- 📦 Layered architecture (Domain, UseCases, Infra)
- 🛢️ Support for MySQL and MariaDB
- 🧪 Monitored metrics:
  - Active connections
  - Database size
  - Slow queries
  - (Coming soon) Replication lag

---

## 📦 Installation

```bash
git clone https://github.com/calhaudev/pulse-db-monitor.git
cd pulse-db-monitor
npm install
```

---

## ⚙️ Configuration

Create the `.env` file from the `.env.example`:

```bash
cp .env.example .env
```

> All environment variables are validated using [Zod](https://zod.dev) in `config.ts`.

---

## 🧪 Usage

### 🔧 Development mode

```bash
npm run dev
```

### 🏗️ Production build

```bash
npm run build
npm start
```

---

## 📡 Available Endpoints

- `GET /health-check`: Performs a simple database connection check.
- `GET /full-health-check`: Runs all available critical checks.

---

## 💌 Example Email Output

```
🚨 DATABASE HEALTH REPORT

✅ Active Connections: 12 connections
⚠️ Slow Queries: 87 queries (threshold: 50)
✅ Database Size: 412.8 MB

🔁 Check interval: every 60 seconds
```

---

## 🧱 Project Structure

- `domain/`: Entities, usecases, and contracts (ports)
- `infra/`: Infrastructure implementations (DatabaseService, EmailNotifier)
- `config/`: Zod-validated environment configuration
- `app.ts`: Fastify server entrypoint and scheduled runner

---

## 📜 License

MIT

---

## 🙋 Author

Built with 💛 by [**Rafael Calhau**](mailto:calhaudev@gmail.com)

> A fullstack developer passionate about frontend architecture, clean code, and real-world reliable systems.

---

## 🌟 Roadmap / To-Do

- [ ] PostgreSQL support

---
