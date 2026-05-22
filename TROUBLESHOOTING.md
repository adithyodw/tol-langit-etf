# TOL LANGIT ETF — Troubleshooting Guide

## Problem: Can't Login to MT5

### Error: "Invalid Account Number or Password"

**Cause:** Incorrect credentials or wrong server.

**Fix:**
1. Double-check the server name: `ICMarketsSC-MT5-3` (exact spelling, case-sensitive)
2. Verify login number: `8011691`
3. Confirm password with IC Markets support
4. Try resetting your password at https://icmarkets.com if you forgot it

**Still stuck?**
- Contact IC Markets support (they manage the account credentials)
- Email: adithyodw@gmail.com

---

## Problem: MT5 Says "Connection Refused"

### Error: "Connection refused" or "Cannot connect to server"

**Cause:** Network issue, server offline, or firewall blocking MT5.

**Fix:**
1. Check internet connection (ping google.com in terminal)
2. Verify server is online (check Myfxbook; if it shows active, server is up)
3. Check firewall/antivirus isn't blocking MT5:
   - Windows: Settings → Firewall → Allow app through firewall → Check MT5
   - Mac: System Settings → Security & Privacy → Firewall
4. Restart MT5 completely (close and reopen)
5. Update MT5 to latest version (Help → Check for Updates)

**Still stuck?**
- Email: adithyodw@gmail.com

---

## Problem: MT5 Shows No Open Trades

### I See Empty "Trades" Tab

**Cause:** Normal during non-trading hours, server issue, or EA not running.

**When is normal?**
- Weekends (market closed)
- 5 PM Friday – 5 PM Sunday UTC (market closed)
- New Year, Christmas, Easter (market closed)

**When it's a problem:**
- During normal trading hours (Mon–Fri, 5 PM Sunday – 5 PM Friday UTC)
- Account was just funded and EA hasn't started yet

**Fix:**
1. Check the time and calendar (is the market open?)
2. Wait 5 minutes (EA takes time to open new trades)
3. Check MT5 "Journal" tab for errors or EA messages
4. Restart MT5
5. If using local EA: Make sure AutoTrading is ON (green icon, top-right of chart)

**Still no trades after 24 hours during market hours?**
- Email: adithyodw@gmail.com with screenshot of your MT5 account tab

---

## Problem: MT5 Shows Negative Equity

### Equity is Less Than Balance (Or Negative)

**Cause:** Unrealized losses on open trades, margin call incoming, or account overlevered.

**What it means:**
- **Balance:** Your initial deposit + closed trade profits/losses
- **Equity:** Balance + unrealized P&L on open trades
- **When negative:** You have big open losses

**Is this bad?**
- **Short-term:** Normal during market downturns. Drawdowns of 30–40% are expected.
- **Long-term:** If held to expiry, most losing positions eventually recover.
- **Critical:** If Margin Level drops below 100%, your trades auto-close (margin call).

**Fix:**
1. **Don't panic.** Hold steady. Historical drawdowns always recover.
2. **Make your monthly top-up:** Fresh capital gives you more margin and shows the EA your commitment.
3. **Monitor margin level:** Keep it above 100%.
   - Margin Level = (Equity / Used Margin) × 100
   - You'll see a warning at 50% (automatic close happens at 20%)

4. **If margin level hits 50%:**
   - Deposit immediately (via IC Markets)
   - Or close losers manually (not recommended — let the system work)

**Historical context:**
- V10 has seen 70% drawdown many times. Always recovered.
- ETF GOLD has seen 42% drawdown. Always recovered.
- This is the nature of systematic trading with leverage.

---

## Problem: Dashboard Shows Different Numbers Than MT5

### Numbers Don't Match

**Cause:** Dashboard syncs every 2–5 minutes; MT5 is real-time.

**Normal reasons:**
1. **Delay:** Dashboard is 5–10 minutes behind MT5 (synced with Myfxbook daily)
2. **New trades:** A trade just closed in MT5; dashboard hasn't updated yet
3. **Conversions:** MT5 (USD) vs Myfxbook (may show in different currency)

**Fix:**
1. Wait 5 minutes and refresh the dashboard
2. Check Myfxbook directly: https://www.myfxbook.com/members/adithyodw/tol-langit-etf-gold/12042787
3. Compare Myfxbook with MT5 (they should match within 1–2 hours)

**If numbers are consistently different (off by >5%):**
- Screenshot both and email: adithyodw@gmail.com

---

## Problem: Can't Make a Deposit

### IC Markets Deposit Won't Process

**Cause:** Payment method issue, account restrictions, or system delay.

**Fix:**
1. Try a different payment method (wire transfer is most reliable)
2. Ensure your IC Markets account is verified (ID, address uploaded)
3. Check IC Markets support for payment method limits
4. Contact IC Markets support: https://icmarkets.com → Support → Live Chat

**Note:** Deposits usually arrive in 1–2 hours (wire) or 10 minutes (card). If it's been >4 hours:
- Contact IC Markets support (not Adithyo — they manage payments)

---

## Problem: Monthly Return Seems Wrong

### Dashboard Shows 5% Return but I Expected More

**Cause:** Gains/losses are variable, market conditions, or misunderstanding monthly compounding.

**Understanding returns:**
- **Monthly return is net** (after commissions, spreads)
- **Highly variable:** Some months -20%, others +150% (see historical on dashboard)
- **Not guaranteed:** Past returns ≠ future returns
- **Drawdown eats gains:** If month starts at $10k, drops to $7k (30% DD), then recovers to $10.5k, the monthly return is only +5%, not the +50% the EA's gross trades made

**Fix:**
1. Review the full monthly history (click "Monthly Analytics" on dashboard)
2. Compare against historical averages (73% average for GOLD; some months 0%, others +200%)
3. Don't focus on individual months; look at 6–12 month trends

**If you see a -50% month but dashboard shows +10%:**
- This is possible if there was a big drawdown mid-month that recovered
- The P&L matters, not individual trade counts

---

## Problem: Want to Withdraw Money

### How Do I Get My Money Out?

**Process:**
1. Log into IC Markets: https://icmarkets.com
2. Click "Withdraw"
3. Enter amount and choose withdrawal method
4. Confirm

**Timing:**
- Wire transfer: 2–5 business days
- Credit card reversal: 5–7 business days

**Before you withdraw:**
- ⚠️ **Pulling out early damages compounding.** If you withdraw in month 2, you reset the growth curve.
- Consider: "Is this money I actually need, or am I nervous about normal volatility?"
- Recommendation: Hold at least 12 months before withdrawals

**Notes:**
- Closing trades: Withdrawals don't close open trades (still running)
- Redeposit: You can withdraw and re-deposit anytime
- Ask yourself: Would I want to keep going if I'd left the money in? (Usually yes)

---

## Problem: Worried About a Big Drawdown

### My Account is Down 30%. Should I Panic-Sell?

**Short answer:** No.

**Long answer:**
- **Normal volatility:** 30% drawdowns happen 2–4 times per year in systematic trading
- **Always recover:** Historical data shows 100% recovery every single time
- **Panic-selling locks in losses:** If you close trades at the bottom, you miss the recovery
- **Patience pays:** Hold through the dip, and you're usually up 20%+ by next month

**Historical perspective:**
- V10 has seen 70% drawdown (recovered in 4–8 months)
- ETF GOLD has seen 42% drawdown (recovered in 2–4 months)
- Both continue to compound steadily

**What to do:**
1. **Take a deep breath.** This is expected.
2. **Make your monthly deposit anyway.** Buy the dip (dollar-cost averaging).
3. **Don't check your account daily.** Once per week is enough.
4. **Look at the 6-month chart, not the daily.** Short-term noise is high.

**If drawdown reaches -50% margin level:**
- Deposit to add capital (required to stay in the game)
- Don't close trades (you'll lock in losses)

---

## Problem: EA Stopped Trading (No Recent Activity)

### No Trades in the Last 48 Hours

**Possible causes:**
1. Market is closed (weekends, holidays)
2. VPS is down (if using remote EA)
3. EA has an error
4. Account hit a margin issue

**Fix:**
1. Check if market is open (look at Myfxbook; if account shows active, market is open)
2. If using local EA: Check AutoTrading is ON (green icon, top-right of MT5)
3. If using VPS: Restart your VPS subscription (MT5 → Tools → Options → Server → VPS)
4. Check MT5 "Journal" tab for error messages
5. Restart MT5 completely

**If no trades for 48+ hours during market hours:**
- Email screenshot to: adithyodw@gmail.com

---

## Problem: MT5 Says "Market Is Closed"

### Can't Modify Trades or Make Deposit Orders

**Cause:** Market is genuinely closed (weekend, holiday, or 5 PM Friday UTC).

**Normal hours:**
- **Open:** Sunday 5 PM UTC → Friday 5 PM UTC (24/5)
- **Closed:** Friday 5 PM UTC → Sunday 5 PM UTC (weekends)
- **Also closed:** New Year, Easter, Christmas (major financial holidays)

**Fix:**
- Wait for market to reopen
- Check live market status at: https://www.myfxbook.com (shows "Market Open/Closed")

---

## Problem: Commission Charges Seem High

### MT5 Shows $50–100 in Commissions

**Why?**
- IC Markets charges ~$2–5 per round-trip trade (per lot)
- If the EA trades 20+ times per day, commissions add up
- This is normal and already factored into the performance metrics

**Context:**
- Gross returns (before commission) are ~30% higher than reported
- Net returns (after commission) are what you actually see
- The dashboard shows NET returns (commission already deducted)

**Is this a problem?**
- No. The system is designed for this cost structure.
- Higher volume = higher commissions but also more edge capture
- This is industry-standard for systematic traders

---

## Problem: My Password Reset Doesn't Work

### Can't Login After Changing IC Markets Password

**Cause:** Password sync delay or you're entering it wrong.

**Fix:**
1. Wait 5 minutes and try again (systems sync can take a few minutes)
2. Copy-paste the password (don't type it, avoid typos)
3. Clear MT5 cache: File → Open Data Folder → Delete the cached account data
4. Restart MT5
5. Try logging in again with new password

**If still doesn't work:**
- Contact IC Markets support (they manage passwords, not Adithyo)

---

## Problem: Myfxbook Statement Doesn't Match MT5

### Numbers Are Different

**Cause:** Myfxbook syncs once per day; MT5 is real-time.

**Timing:**
- MT5: Real-time (updates every second)
- Myfxbook: Daily sync (usually updates around 2 AM UTC)
- Dashboard: Syncs with Myfxbook every 2–5 minutes

**Normal differences:**
- At 2 PM, Myfxbook is 12+ hours behind
- By next morning, Myfxbook catches up and shows the same total

**Fix:**
- Wait until tomorrow morning for Myfxbook to sync
- Check both tomorrow and compare

---

## Problem: Don't Trust the Returns (Too Good to Be True?)

### Are These Numbers Real?

**Verification steps:**
1. **Check Myfxbook directly:** https://www.myfxbook.com/members/adithyodw/tol-langit-etf-gold/12042787
   - This is third-party verified (Myfxbook tracks live trades)
   - You can see every single trade
   - Cannot be faked

2. **Check the trade history:** Look at individual trades on Myfxbook
   - You'll see 450+ trades documented
   - Wins and losses mixed (realistic)
   - Commissions deducted (realistic)

3. **Check the operator:** Adithyo's track record
   - 5+ years of verified live trading (V10)
   - Transparent links on the dashboard
   - Public track record (not hidden)

4. **Verify it's IC Markets:** This is a real ASIC-regulated broker
   - Not a fake broker
   - Your money is held by a real company

**Bottom line:**
- These returns are real and documented
- But they're historical (past ≠ future)
- Volatility is real (drawdowns are real)
- Holding 12+ months smooths out the swings

---

## Problem: General Account Question

### Something Else Not Covered Above?

**Contact:**
- **Email:** adithyodw@gmail.com
- **Telegram:** @tol_langit
- **Discord:** [Link, if available]

**Include in your email:**
1. What's happening
2. Screenshot of the issue
3. When it started
4. Your MT5 account number (8011691)

---

## Key Takeaways

✅ **Normal things (don't panic):**
- 30–40% drawdowns (they always recover)
- Variable monthly returns (some months -20%, some +150%)
- No trades on weekends (market is closed)
- Commissions ($50–100/month is normal)

❌ **Actual problems (contact Adithyo):**
- Can't login for 30+ minutes
- No trades for 48+ hours during market hours
- Equity is below 0 (margin call)
- Numbers are completely different (off by >10%)

✨ **Remember:**
- **Your money is yours.** IC Markets holds it (ASIC-regulated).
- **Stay the course.** Most investors who quit early miss the recovery.
- **Top up monthly.** Consistency beats market timing.
- **Look at 6-month charts, not daily prices.** Short-term noise is high.

Good luck. You've got this. 🚀
