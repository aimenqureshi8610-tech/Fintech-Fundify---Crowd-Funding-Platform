# 🚀 Fundify – Crowdfunding Platform with Fraud Detection

**Group Members:** Izaan 23K-5530 | Areeb 23K-5520 | Aimen 23K-5502 | Omama 23K-5546

---

## 📁 Project Structure

```
fundify/
├── server.js                  ← Main Express server (START HERE)
├── database.sql               ← Run this in MySQL first
├── package.json               ← Dependencies
├── .env.example               ← Copy to .env and fill values
│
├── config/
│   └── db.js                  ← MySQL database connection
│
├── middleware/
│   ├── auth.js                ← Login/role protection
│   └── fraudDetection.js      ← 🛡️ Fraud Detection Engine
│
├── routes/
│   ├── auth.js                ← /auth/login, /register, /logout
│   ├── campaigns.js           ← /campaigns (CRUD + donate)
│   ├── admin.js               ← /admin (approve/reject/fraud)
│   └── user.js                ← /user/dashboard
│
└── public/
    ├── css/style.css          ← All styles
    ├── js/app.js              ← Shared JS utilities
    ├── uploads/               ← Campaign images (auto-created)
    └── pages/
        ├── index.html         ← Landing page
        ├── login.html         ← Login
        ├── register.html      ← Register
        ├── browse.html        ← Browse campaigns
        ├── create-campaign.html ← Create campaign
        ├── campaign-detail.html ← Single campaign view
        ├── dashboard.html     ← User dashboard
        └── admin.html         ← 🛡️ Admin panel
```

---

## ⚙️ SETUP INSTRUCTIONS (Step by Step)

### Step 1 — Install Node.js
Download from https://nodejs.org (version 18 or higher)
Verify: open terminal and type `node --version`

### Step 2 — Install MySQL
Download MySQL Community Server from https://dev.mysql.com/downloads/
During installation, set a root password (remember it!)

### Step 3 — Set Up the Database
1. Open MySQL Workbench or MySQL command line
2. Run the contents of `database.sql`
   - This creates the `fundify` database and all tables
   - It also creates the default admin account

### Step 4 — Configure Environment
1. Copy `.env.example` to a new file called `.env`
2. Open `.env` and fill in your MySQL password:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=fundify
SESSION_SECRET=any_random_string_here
PORT=3000
```

### Step 5 — Install Dependencies
Open terminal in the `fundify/` folder and run:
```bash
npm install
```

### Step 6 — Start the Server
```bash
npm start
```
You should see:
```
🚀 Fundify running at http://localhost:3000
📋 Admin login: admin@fundify.com / (set during setup, see ADMIN_PASSWORD)
```

### Step 7 — Open in Browser
Go to: **http://localhost:3000**

---

## 👤 User Accounts

| Role       | Email                  | Password  | Access |
|------------|------------------------|-----------|--------|
| Admin      | admin@fundify.com      | set via ADMIN_PASSWORD  | Full admin panel |
| Fundraiser | Register → select "Fundraise" | any | Create campaigns |
| Donor      | Register → select "Donate"    | any | Browse & donate |

---

## 🛡️ Fraud Detection System

The fraud engine (`middleware/fraudDetection.js`) runs automatically on:

### Campaign Checks:
| Rule | Fraud Score Added |
|------|-----------------|
| Goal > Rs.500,000 from account < 7 days old | +40 |
| Goal > Rs.100,000 from account < 3 days old | +30 |
| User has more than 5 campaigns | +25 |
| Deadline is less than 2 days away | +20 |
| Description under 50 characters | +15 |
| Duplicate campaign title found | +35 |

**If fraud score ≥ 40 → Campaign auto-flagged for admin review**

### Donation Checks:
| Rule | Action |
|------|--------|
| Single donation > Rs.50,000 | Flagged |
| More than 10 donations in 1 hour | Flagged |
| Total donations > Rs.100,000 in 1 hour | Flagged |
| More than 3 donations to same campaign | Flagged |

**Flagged donations are NOT added to campaign totals until admin reviews**

### Admin Actions:
- View all fraud alerts with severity levels (High/Medium/Low)
- Approve or reject pending campaigns with reasons
- Resolve fraud alerts with notes
- Ban/unban users

---

## 🗺️ Page Routes

| URL | Page |
|-----|------|
| / | Landing page |
| /auth/login | Login |
| /auth/register | Register |
| /auth/logout | Logout |
| /pages/browse.html | Browse campaigns |
| /pages/create-campaign.html | Create campaign |
| /campaign/:id | Campaign detail |
| /dashboard | User dashboard |
| /admin/panel | Admin panel |

---

## 🔌 API Endpoints

### Auth
- `POST /auth/register` — Register new user
- `POST /auth/login` — Login
- `GET /auth/logout` — Logout

### Campaigns
- `GET /campaigns` — Get all active campaigns (with search/category filters)
- `GET /campaigns/:id` — Get single campaign with comments/donations
- `POST /campaigns/create` — Create campaign (fundraiser only)
- `POST /campaigns/:id/donate` — Donate to campaign
- `POST /campaigns/:id/comment` — Post comment
- `POST /campaigns/:id/update` — Post campaign update

### Admin
- `GET /admin/dashboard` — Full dashboard stats
- `POST /admin/campaigns/:id/approve` — Approve campaign
- `POST /admin/campaigns/:id/reject` — Reject campaign
- `POST /admin/users/:id/ban` — Ban user
- `POST /admin/users/:id/unban` — Unban user
- `POST /admin/fraud/:id/resolve` — Resolve fraud alert

### User
- `GET /user/me` — Get current user
- `GET /user/dashboard` — Dashboard data

---

## 🧪 Testing the Fraud System

1. Register as a fundraiser
2. Create a campaign with:
   - Goal > Rs.500,000
   - A very short description (under 50 chars)
3. Check the admin panel → the campaign will have a high fraud score and be auto-flagged
4. Login as admin and see the fraud alerts panel

---

## 💡 Technologies Used

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | HTML, CSS, JavaScript | Responsive UI, no framework needed |
| Backend | Node.js + Express | Fast, scalable API server |
| Database | MySQL | Relational data: users, campaigns, donations |
| Auth | Express-session + bcrypt | Secure password hashing + sessions |
| File Upload | Multer | Campaign image uploads |
| Fraud | Custom rule engine | Lightweight, no ML needed |
