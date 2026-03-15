# 💀 Deadline Debt

**Stop studying harder. Start studying smarter.**  
*Manage your academic debt before the interest kills your grades.*

Deadline Debt is a futuristic task management application designed for students who want to visualize their academic workload as a "Debt Score." By gamifying the pressure of deadlines, it helps you prioritize what's urgent and rewards you for consistent progress.

---

## 🧠 The "Deadline Debt" Algorithm

Think of your tasks like a **credit card**. Every topic you haven't finished is **debt you owe**. The longer you ignore it past the deadline, the more **interest** (penalty) piles up.

### How the Score is Calculated:
1.  **Base Debt**: Every incomplete topic adds **3 points** to your debt.
2.  **Overdue Penalty (Interest)**: The moment a task passes its due date, it gains **15 points per day**. It's aggressive to create urgency.
3.  **Early Bird Discount**: If your deadline is **more than 7 days away**, you get a **20-point discount**. Focus on the now, worry about the future later.
4.  **Completion Scaling**: Your total debt is multiplied by the percentage of work remaining. If you've done 75% of the topics, only 25% of the debt remains.
5.  **Debt Clearance**: The moment you finish **every single topic**, your debt for that task drops to **zero instantly**, regardless of how late it was.

---

## ✨ Key Features

### 🤖 Gemini AI Advisor
Get personalized academic coaching. The built-in AI Advisor uses **Google Gemini 1.5 Flash** to analyze your tasks and provide:
- Strategic advice on which tasks to tackle first.
- Encouragement and "Mission Control" themed feedback.
- Context-aware answers based on your current workload.

### ⏲️ Integrated Pomodoro Timer
Stay in the zone with a built-in focus tool:
- **Standard Cycles**: 25m focus / 5m break.
- **Custom Timer**: Set your own focus intervals to match your study style.

### 🏆 Achievement & Streak System
Track your consistency and celebrate your wins:
- **Clearing Tasks**: Move tasks to the "Achievements" board once fully completed.
- **Streak Tracking**: Keep your momentum alive with daily activity tracking.

### 🌑 Professional Dark Mode
A sleek, mission-control inspired interface designed to minimize eye strain during late-night study sessions.

---

## 🛠️ Technical Stack

**Frontend:**
- **React (Vite)**: For a fast, responsive single-page application experience.
- **React Router**: Seamless navigation between the landing page, dashboard, and auth.
- **Axios**: Efficient API communication with the backend.
- **CSS3**: Custom dark-themed styling with high-fidelity micro-animations.

**Backend:**
- **Node.js & Express**: A robust RESTful API architecture.
- **MongoDB & Mongoose**: Flexible NoSQL database for task and user management.
- **Google Generative AI**: Integration with Gemini 1.5 Flash for advanced AI features.
- **JWT Authentication**: Secure user sessions and data protection.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/koushikkallamadi/Deadline-Debt.git
   cd Deadline-Debt
   ```

2. **Setup the Server:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET=your_jwt_secret
   ```
   Start the server:
   ```bash
   npm start
   ```

3. **Setup the Frontend:**
   ```bash
   cd ../
   npm install
   ```
   Start the development server:
   ```bash
   npm run dev
   ```

---

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

---

## 📝 License
Distributed under the ISC License. See `LICENSE` for more information.
