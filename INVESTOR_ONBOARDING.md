# TOL LANGIT ETF — Investor Onboarding Guide

## Welcome

You're about to set up a **managed systematic trading account** through **TOL LANGIT ETF**, running on **IC Markets** with **MetaTrader 5 (MT5)**.

This guide walks you through login, EA installation, account verification, and monthly top-up mechanics.

---

## Part 1: MetaTrader 5 (MT5) Installation & Login

### Step 1: Download MetaTrader 5

1. Visit **https://www.metatrader5.com** (official MetaQuotes site)
2. Click **"Download"** → choose your OS (Windows, macOS, Android, iOS)
3. Install and launch the application

**Note:** Download **only** from metatrader5.com to ensure security.

### Step 2: Add Your IC Markets Account

1. Open **MetaTrader 5**
2. Click **"File"** (top menu) → **"Login to Trading Account"**
3. In the dialog, select **"Server"** and search for: **`ICMarketsSC-MT5-3`** (exact spelling)
4. Enter your credentials:
   - **Login:** `8011691`
   - **Password:** *(your IC Markets password)*
   - **Server:** `ICMarketsSC-MT5-3`
5. Click **"OK"**

**Result:** MT5 will connect to your live account at IC Markets. You should see:
- Your **Account Balance** (USD)
- Your **Equity** (current account value)
- An empty **Trades** tab initially (EA begins trading once it starts)

---

## Part 2: Understanding Your Account Dashboard

### What You Should See in MT5

#### **Account Tab**
- **Balance:** Starting capital (e.g., $10,000)
- **Equity:** Live account value (changes as trades profit/loss)
- **Free Margin:** Available buying power for new trades
- **Used Margin:** Capital tied up in open trades
- **Margin Level:** Risk metric (keep above 100%)

#### **Trades Tab**
- **Open Trades:** Live positions currently running
- **Symbol:** Trading pair (e.g., XAUUSD, AUDCAD)
- **Type:** Buy or Sell
- **Volume:** Lot size (automatically scales with your account balance)
- **Current Profit/Loss:** Real-time P&L per trade

#### **History Tab**
- **Closed Trades:** Completed trades (winning and losing)
- **Win Rate:** Percentage of winning trades
- **Average Win/Loss:** Mean profit/loss per trade

---

## Part 3: Installing the Expert Advisor (EA)

The **EA (Expert Advisor)** is the automated system that executes all trades. It runs 24/5 on a remote server.

### Option A: EA Running on Remote Server (Recommended for Most Investors)

The EA is **already running on a managed MetaQuotes VPS server** connected to your account. You don't need to install anything locally.

✅ **Advantages:**
- Runs 24/5 automatically (even if your computer is off)
- No installation required
- Professional hosting with minimal downtime
- Full transparency — you can see every trade in your MT5 account

**What to do:** Keep MT5 installed on your computer or phone so you can **monitor live trades anytime**. That's it.

### Option B: Advanced — Running EA Locally (For Technical Users)

If you want to run the EA on your own computer:

1. **Get the EA file** from Adithyo (contact below)
2. **In MT5:**
   - Click **"File"** → **"Open Data Folder"**
   - Navigate to **`MQL5/Experts`**
   - Copy the EA file into this folder
3. **Activate the EA:**
   - Right-click the EA in the **"Navigator"** panel (left side)
   - Select **"Add to Chart"**
   - Confirm that **"AutoTrading"** is enabled (green icon, top-right of chart)
4. **Verify:** Open trades will appear in your **"Trades"** tab within seconds

**⚠️ Important:** If running locally, your computer must stay on during trading hours. The remote VPS option is more reliable.

---

## Part 4: Real-Time Dashboard Monitoring

You can monitor your account **live** on the public dashboard:

### **Dashboard URL:** https://tol-langit-etf.vercel.app/

#### What You See:
1. **Account Performance**
   - Total Gain (%)
   - Absolute Gain (%)
   - Monthly Returns (by month)
   - Drawdown (max historical decline)

2. **Live Equity Curve**
   - Visual chart of your account growth over time

3. **Trading Activity**
   - Recent trades and outcomes
   - Win rate and profit factor
   - Trading pairs in use

4. **Systems Overview**
   - V10 (multi-pair FX — MT4, SGD)
   - ETF GOLD (XAUUSD + AUDCAD — MT5, USD) ← **Your system**

5. **Operator Info**
   - Adithyo's track record (5+ years verified)
   - Links to Myfxbook statements
   - Contact info

### How to Use the Dashboard
- **Switch between products** using the tabs/buttons
- **View your live account** under "ETF GOLD"
- **Monitor monthly returns** to see seasonal trends
- **Check recent trades** to understand what's executing

---

## Part 5: The Monthly Top-Up System (ETF Mechanics)

### Why "ETF"?

Unlike traditional managed accounts, **TOL LANGIT operates like an ETF:**
- No pooled capital (your money is 100% your own)
- Transparent statements (auditable on Myfxbook)
- Equity-scaled position sizing (trades grow automatically with your account)
- Monthly contributions encouraged (dollar-cost averaging)

### How Monthly Top-Ups Work

#### The Concept
Every month, you add fresh capital. The **lot sizes automatically scale** as your account grows.

**Example:**
- **Month 1:** You deposit $1,000 → Account balance = $1,000 → EA trades at 0.1 lot size
- **Month 2:** You earn +$200 profit, then deposit +$500 → Account balance = $1,700 → EA trades at 0.17 lot size
- **Month 3:** You earn +$100 profit, then deposit +$500 → Account balance = $2,300 → EA trades at 0.23 lot size

**Result:** Your position sizes compound automatically. No manual adjustment needed.

### Recommended Top-Up Schedules

#### **Starter Plan: $100/month**
- Best for: Testing, small capital, 5-year horizon
- **Use case:** "I want to learn. If it works, I'll scale up."
- 5-year projection (at 25% annual return): ~$1,500–$2,000

#### **Builder Plan: $500/month**
- Best for: Serious part-time investors, 3–5 year horizon
- **Use case:** "I want meaningful wealth building."
- 5-year projection (at 25% annual return): ~$7,500–$10,000

#### **Serious Compounding Plan: $1,000+/month**
- Best for: Full-time investors, long-term wealth, 5+ year horizon
- **Use case:** "I'm treating this as my main investment vehicle."
- 5-year projection (at 25% annual return): ~$15,000–$25,000+

### How to Make Monthly Deposits

1. **Log into your IC Markets account** → https://icmarkets.com
2. Click **"Deposit"** or **"Fund Account"**
3. Choose your payment method (wire transfer, credit card, etc.)
4. Enter the amount and confirm

**The deposit arrives in your MT5 account within 1–2 hours.**

Once deposited:
- Your MT5 **Balance** increases immediately
- The EA automatically scales lot sizes for the next trades
- You see the new balance on the dashboard within minutes

---

## Part 6: Verifying the EA is Trading

### Check #1: MT5 Live Trades
1. Open MT5
2. Click the **"Trades"** tab
3. You should see **open positions** (if market is active)

**What to look for:**
- Symbol: XAUUSD or AUDCAD
- Type: Buy (↑) or Sell (↓)
- Volume: 0.1 to 2.0 lots (scales with account)
- Profit: Shows live P&L

### Check #2: MT5 Trade History
1. Click the **"History"** tab
2. You should see **closed trades** from today/this week

**What to look for:**
- Multiple trades closing daily/weekly
- Mix of wins and losses (normal — win rate ~75%)
- Commissions charged by IC Markets (~$2–5 per round trip)

### Check #3: Dashboard Live Data
1. Open https://tol-langit-etf.vercel.app/
2. Navigate to **"ETF GOLD"**
3. Click **"Activity"** or **"Recent Trades"**

**What to look for:**
- Your account activity appears within 2–5 minutes
- Trade details match what you see in MT5
- Monthly P&L updates (dashboard syncs with Myfxbook daily)

---

## Part 7: MetaQuotes VPS Setup (Optional but Recommended)

To run the EA 24/5 **without keeping your computer on**, use **MetaQuotes VPS**.

### What It Is
- Remote Windows server specifically for MT5
- Hosts your MT5 and EA
- Runs 24/5 (never sleeps, minimal downtime)
- Cost: ~$15–30/month

### How to Set Up
1. Open MT5 → **"Tools"** → **"Options"** → **"Server"** tab
2. Click **"VPS"** button
3. Select **MetaQuotes VPS** from the list
4. Click **"Rent"** and follow the payment flow
5. MT5 will install itself on the VPS automatically

**Once activated:**
- Your EA runs 24/5 on the remote server
- You can monitor from any device (MT5 mobile app)
- No local installation needed

---

## Part 8: Key Metrics to Understand

### Drawdown
- **Definition:** Maximum peak-to-trough loss (worst equity decline from a high point)
- **V10 (MT4):** ~70% historical (stable but volatile)
- **ETF GOLD (MT5):** ~42% historical (lower risk, newer)
- **What it means:** If your account grows to $10,000, a 42% drawdown means it could temporarily drop to $5,800 before recovering. **This is normal for systematic trading.**

### Win Rate
- **V10:** ~81%
- **ETF GOLD:** ~78%
- **What it means:** About 3 out of 4 trades win. Losses are managed automatically by the EA.

### Profit Factor
- **V10:** 1.97
- **ETF GOLD:** 2.34
- **Definition:** Gross profit ÷ Gross loss
- **What it means:** For every $1 you lose, you earn $2.34 (GOLD) or $1.97 (V10) gross.

### Monthly Average Return
- **V10:** ~5.59% (conservative, steady)
- **ETF GOLD:** ~73.67% average (but highly variable month-to-month; some months 0%, others +200%)
- **What it means:** GOLD is newer and more volatile. V10 is proven. Both can compound significantly with monthly top-ups.

---

## Part 9: Important Disclaimers & Risk Management

### Your Capital is Always Yours
- **No managed account:** You own the account outright
- **IC Markets holds your money:** A regulated ASIC broker (not Adithyo or TOL LANGIT)
- **Verifiable statements:** All trades published on Myfxbook (auditable)
- **You can withdraw anytime** (though I recommend staying invested for 3+ months minimum)

### Risk Factors
1. **Leverage Risk:** The EA uses up to 1:500 leverage. Position sizes are managed automatically to stay safe, but leverage amplifies both gains and losses.
2. **Drawdown:** Your account will see 30–70% temporary declines. This is normal. Panic-selling during drawdown destroys long-term returns.
3. **Systematic Losses:** No EA wins 100% of the time. Losses come in clusters. Monthly contributions smooth out volatility.

### Best Practices
✅ **DO:**
- Top up monthly ($100–$1,000 depending on your plan)
- Check your account once a week (no need to obsess)
- Hold for 12+ months (short-term variance is high)
- Use VPS (eliminates manual setup risk)

❌ **DON'T:**
- Panic-sell during drawdown
- Try to "improve" the EA (it's locked for safety)
- Trade manually alongside the EA
- Expect 70% monthly gains (that's an outlier, not average)

---

## Part 10: Getting Help & Support

### Quick Questions
- **Discord:** [Link to community, if available]
- **Email:** adithyodw@gmail.com
- **Telegram:** @tol_langit

### Verify Authenticity
- **Official Dashboard:** https://tol-langit-etf.vercel.app/
- **V10 Myfxbook:** https://www.myfxbook.com/members/adithyodw/tol-langit-v10/8671765
- **ETF GOLD Myfxbook:** https://www.myfxbook.com/members/adithyodw/tol-langit-etf-gold/12042787
- **MQL5 Signals:** https://www.mql5.com/en/users/adithyodw

---

## Part 11: First 24 Hours Checklist

After login, complete these in order:

- [ ] **Hour 1:** Log into MT5 with credentials (8011691 / ICMarketsSC-MT5-3)
- [ ] **Hour 2:** Verify you see your account balance and free margin
- [ ] **Hour 4:** Check the "Trades" tab — should see activity (if market is open)
- [ ] **Hour 8:** Visit https://tol-langit-etf.vercel.app/ and find your account in "Activity"
- [ ] **Day 1:** Review the last 5 closed trades in MT5 history
- [ ] **Day 1:** Plan your first monthly top-up ($100, $500, or $1,000)
- [ ] **Day 2:** Make your first deposit via IC Markets
- [ ] **Week 1:** Set up MetaQuotes VPS (optional but recommended)

---

## Part 12: Monthly Routine

Once set up, here's what you do every month:

**1st–5th of month:**
- Log into IC Markets
- Make a deposit ($100–$1,000 or more)
- Wait 1–2 hours for funds to appear in MT5

**Anytime during month:**
- Open MT5 and check your balance
- Visit the dashboard to see live performance
- Read recent trade activity

**End of month:**
- Review your monthly return (on dashboard or MT5)
- Plan next month's top-up amount
- Celebrate wins, accept losses (both are natural)

---

## Summary

| Step | What | When | Time |
|------|------|------|------|
| 1 | Download MT5 | Now | 10 min |
| 2 | Login to your account | Now | 5 min |
| 3 | Verify trades are running | Within 24h | 5 min |
| 4 | View dashboard | Within 24h | 2 min |
| 5 | Set up VPS | Within 1 week | 15 min |
| 6 | Make first top-up deposit | Within 1 week | 5 min |

---

## Questions Before You Start?

If anything above is unclear, **reach out to Adithyo:**

- **Email:** adithyodw@gmail.com
- **Telegram:** @tol_langit
- **Dashboard support:** Chat or contact on https://tol-langit-etf.vercel.app/

---

**Welcome to TOL LANGIT ETF.** Your journey to disciplined, systematic wealth building starts now.

Good luck. 🚀
