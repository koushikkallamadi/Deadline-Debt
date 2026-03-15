# 💀 Deadline Debt

**Stop studying harder. Start studying smarter.**  
*Manage your academic debt before the interest kills your grades.*

[**🚀 Live Demo**](https://deadline-debt.vercel.app/)

---

## ❓ What is Deadline Debt?

Deadline Debt is a futuristic task manager that turns your "to-do list" into a "Debt Score." Instead of just seeing a list of tasks, you see exactly how much your procrastination is "costing" you. The goal is simple: **Pay off your academic debt by finishing your work.**

---

## 🧠 How it Works (The Algorithm)

We use a unique scoring system to help you stay ahead of your deadlines. Think of it like a **financial debt**:

1.  **The "Loan" (Base Debt)**: Every task you haven't finished adds **3 points** to your debt. This is what you "owe" just for having work to do.
2.  **The "Interest" (Late Penalty)**: If you miss a deadline, the debt grows by **15 points every day**. The longer you wait, the bigger the debt gets!
3.  **The "Discount" (Early Bird)**: If your task is due in more than a week, we give you a **20-point discount**. This keeps your stress low for future work so you can focus on today.
4.  **Progress Reward**: Every topic you check off lowers the debt score. We reward your partial progress!
5.  **Debt Clearance**: The moment you finish 100% of a task, the debt for that task drops to **zero instantly**.

### Visual Flow

```text
┌──────────────────┐
│  Pending × 3     │  ← Base debt from incomplete work
└────────┬─────────┘
         │
    Is it overdue?
    ┌────┴─────┐
    │ YES      │ NO
    ▼          ▼
  +15/day    (skip)     ← Late penalty (interest)
    │          │
    └────┬─────┘
         │
    Due > 7 days away?
    ┌────┴─────┐
    │ YES      │ NO
    ▼          ▼
   -20       (skip)     ← Early bird discount
    │          │
    └────┬─────┘
         │
         ▼
  × (1 - completion%)   ← Partial progress reward
         │
         ▼
    All done? → 0       ← Full clearance
```

---

## ✨ Why You'll Love It

### 🤖 Your AI Study Advisor
Stuck? Ask the **AI Advisor** (powered by Gemini 1.5 Flash). It knows your tasks and can give you a game plan on what to study next, or just give you a boost of motivation.

### ⏲️ Focus with Pomodoro
Use the built-in timer to stay in the zone. Choose the classic **25/5 minute cycle** or set your own custom time.

### 🏆 Gamified Success
Clear your tasks to earn **Achievements** and build a **Streak**. Watch your "Achievements Board" grow as you clear your debt.

---

## 🛠️ Tech Behind the Scenes

- **Frontend**: Built with **React** for a smooth, app-like feel.
- **Backend**: **Node.js & Express** handling your data securely.
- **Database**: **MongoDB** keeping track of all your tasks and streaks.
- **AI Integration**: **Google Gemini** providing smart, personalized advice.

---

## 🚀 Setup Your Mission Control

### 1. Clone & Install
```bash
git clone https://github.com/koushikkallamadi/Deadline-Debt.git
cd Deadline-Debt
npm install
```

### 2. Configure the Server
Go into the `server` folder, install dependencies, and create a `.env` file:
```bash
cd server
npm install
```
**Required .env variables:**
- `MONGO_URI`: Your database link.
- `GEMINI_API_KEY`: For the AI Advisor.
- `JWT_SECRET`: For secure login.
- `PORT`: Usually `5000`.

### 3. Run the App
- **Server**: `npm start` (inside the `server` folder)
- **Frontend**: `npm run dev` (in the root folder)

---

## 📝 License
Distributed under the ISC License.

---

**Developed with ❤️ by [Koushik Kallamadi](https://github.com/koushikkallamadi)**
