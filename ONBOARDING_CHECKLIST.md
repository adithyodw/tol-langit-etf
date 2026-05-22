# TOL LANGIT ETF — Pre-Onboarding Checklist (For You)

Use this before sending investor materials. Ensures everything is ready.

---

## Account Setup (Investor Side)

- [ ] IC Markets account created
  - [ ] Account number: 8011691
  - [ ] Server: ICMarketsSC-MT5-3
  - [ ] Currency: USD
  - [ ] Platform: MT5
  - [ ] Leverage: 1:500
  - [ ] Status: ACTIVE (test login yourself)

- [ ] Investor credentials shared
  - [ ] Login number: 8011691
  - [ ] Server: ICMarketsSC-MT5-3
  - [ ] Password: Provided to investor (securely)

- [ ] Investor account verified on MT5
  - [ ] Log in with their credentials yourself (quick test)
  - [ ] Account balance visible
  - [ ] Can see Trades tab (even if empty)

---

## EA Installation & Verification

- [ ] EA is running (check one of these):
  - [ ] **Remote VPS:** EA is hosted on MetaQuotes VPS (preferred)
    - [ ] VPS subscription is active
    - [ ] EA is installed on VPS
    - [ ] Verified trades are executing (check MT5 history)
  
  - [ ] **Local Installation:** EA is running on operator's machine
    - [ ] EA file is provided to investor
    - [ ] EA is installed in MT5 `MQL5/Experts` folder
    - [ ] AutoTrading is enabled (green icon)
    - [ ] Verified trades are visible in MT5

- [ ] EA is actively trading
  - [ ] Opened at least 5 trades in last 48 hours (during market hours)
  - [ ] Mix of winning and losing trades (realistic)
  - [ ] Commissions visible (confirms real trading, not demo)

- [ ] Account is syncing properly
  - [ ] MT5 account is live (not demo)
  - [ ] Balance shows real USD (not fake balance)
  - [ ] Trades appear in MT5 Trades/History tabs

---

## Myfxbook Connection (Live Data)

- [ ] Myfxbook auto-tracking is active
  - [ ] Account appears on Myfxbook: https://www.myfxbook.com/members/adithyodw/tol-langit-etf-gold/12042787
  - [ ] Statement updates daily (or near-daily)
  - [ ] Public link is visible to investors

- [ ] Myfxbook credentials configured
  - [ ] Vercel environment variables are set:
    - [ ] `MYFXBOOK_EMAIL` = your Myfxbook login email
    - [ ] `MYFXBOOK_PASSWORD` = your Myfxbook password
  - [ ] Credentials are verified (test `/api/myfxbook/sync` yourself)

- [ ] Live data is syncing to dashboard
  - [ ] Visit: https://tol-langit-etf.vercel.app/
  - [ ] Navigate to "ETF GOLD"
  - [ ] Sync badge shows "LIVE" (green pulsing)
  - [ ] Recent trades visible
  - [ ] Balance matches MT5 (within 2–5 min)
  - [ ] Monthly returns are accurate

---

## Dashboard Verification

- [ ] Dashboard is deployed and live
  - [ ] URL works: https://tol-langit-etf.vercel.app/
  - [ ] No errors in browser console
  - [ ] All pages load (Dashboard, Signals, Systems, Activity, Profile, Guide)

- [ ] Data accuracy
  - [ ] V10 stats match Myfxbook:
    - [ ] Gain: ~2370%
    - [ ] Drawdown: ~70%
    - [ ] Win Rate: ~81%
  
  - [ ] ETF GOLD stats match Myfxbook:
    - [ ] Gain: ~411%
    - [ ] Drawdown: ~42%
    - [ ] Win Rate: ~78%

- [ ] Live sync is working
  - [ ] Dashboard shows recent trades (updated 2–5 min ago)
  - [ ] Sync badge shows correct status (LIVE or VERIFIED)
  - [ ] No "sync error" messages

---

## Investor Communication Prepared

- [ ] Materials created and reviewed
  - [ ] ✅ INVESTOR_ONBOARDING.md (comprehensive guide)
  - [ ] ✅ INVESTOR_EMAIL_TEMPLATE.txt (quick email)
  - [ ] ✅ QUICK_REFERENCE_CARD.txt (bookmark)
  - [ ] ✅ TROUBLESHOOTING.md (FAQ)

- [ ] Materials are accurate
  - [ ] All URLs are correct
    - [ ] Dashboard: https://tol-langit-etf.vercel.app/
    - [ ] Myfxbook: https://www.myfxbook.com/members/adithyodw/tol-langit-etf-gold/12042787
    - [ ] Account credentials: 8011691 / ICMarketsSC-MT5-3
  
  - [ ] Contact info is correct
    - [ ] Email: adithyodw@gmail.com
    - [ ] Telegram: @tol_langit
    - [ ] Discord: [Link, if available]

  - [ ] Performance metrics are current
    - [ ] Gain, Drawdown, Win Rate, Profit Factor
    - [ ] Monthly returns are recent (May 2026)
    - [ ] All figures match live Myfxbook data

---

## Investor Onboarding (Before Sending Materials)

- [ ] Investor has been informed
  - [ ] You've explained the system verbally
  - [ ] Investor understands it's NOT passive (requires monthly top-ups)
  - [ ] Investor understands drawdown risk (30–40% normal, historical recovery proven)
  - [ ] Investor has agreed to 12+ month holding period

- [ ] Initial deposit is confirmed
  - [ ] Investor knows how much to deposit initially
  - [ ] Investor knows how much to top up monthly
  - [ ] Investor has confirmed the plan (Starter $100, Builder $500, or Serious $1,000+)

---

## Final Verification (Day Before Sending)

- [ ] Test investor login yourself
  - [ ] Log into MT5 with their credentials
  - [ ] Verify you can see their account
  - [ ] Verify trades are visible
  - [ ] Logout

- [ ] Test the dashboard
  - [ ] Visit https://tol-langit-etf.vercel.app/
  - [ ] Navigate to "ETF GOLD"
  - [ ] Verify all data is current (within 5 min of MT5)
  - [ ] Check "Activity" tab for recent trades

- [ ] Test Myfxbook link
  - [ ] Visit the public statement: https://www.myfxbook.com/members/adithyodw/tol-langit-etf-gold/12042787
  - [ ] Verify it shows live data
  - [ ] Verify trades are visible to public

- [ ] Double-check material accuracy one more time
  - [ ] No typos or broken links
  - [ ] All numbers match live sources (MT5, Myfxbook, dashboard)
  - [ ] All URLs are clickable and correct

---

## Send-Off Sequence

When you're ready to send:

**1. Send the quick email first:**
- Copy content from `INVESTOR_EMAIL_TEMPLATE.txt`
- Personalize it with investor name
- Include their credentials (login 8011691, server ICMarketsSC-MT5-3)
- Keep it short (5 min read, action-oriented)

**2. Follow up with the full guide:**
- Attach or share: `INVESTOR_ONBOARDING.md`
- Let them know they can refer back to it anytime
- It's detailed but structured (they can skip sections if needed)

**3. Provide the quick reference:**
- Share: `QUICK_REFERENCE_CARD.txt`
- Suggest they print or save it
- It's a 2-minute reference for the main steps

**4. Keep troubleshooting guide handy:**
- Share: `TROUBLESHOOTING.md`
- Tell them: "If anything goes wrong, check this first"
- Save you from 20 support emails

**5. Follow up in 24 hours:**
- "Did you get logged in okay?"
- "Any questions so far?"
- Smooth first-time experience = long-term trust

---

## Red Flags Before Sending (Stop If Any of These Are True)

❌ **DO NOT SEND** if:
- [ ] MT5 account isn't actually active (test failed)
- [ ] No trades in last 48 hours (during market hours)
- [ ] Dashboard sync badge shows "VERIFIED" instead of "LIVE"
- [ ] Myfxbook data doesn't match MT5 balance (off by >5%)
- [ ] You haven't tested the investor login yourself
- [ ] Any URL in the guides doesn't work
- [ ] Performance numbers are outdated (>1 week old)
- [ ] Investor hasn't confirmed commitment or their monthly top-up plan

**If any red flag is true:** Fix it first, then send.

---

## Post-Onboarding (After Investor Logs In)

- [ ] Investor successfully logged into MT5
- [ ] Investor can see their account balance
- [ ] Investor can see trades (if market is open)
- [ ] Investor verified the dashboard is working
- [ ] Investor made their first deposit (or scheduled it)
- [ ] Investor understands the monthly top-up system

---

## Monthly Routine (Ongoing)

- [ ] Dashboard data is current (syncing properly)
- [ ] Myfxbook statement is up to date
- [ ] No investor complaints about data accuracy
- [ ] Monthly top-ups are being made on schedule
- [ ] You're responsive to investor questions

---

## Investor Support Responses (Template Answers)

### "Is this real?"
> Yes. All data is on Myfxbook (third-party verified), and your money is held by IC Markets (ASIC-regulated). You can see every trade on your MT5 account. Completely transparent.

### "Why do I need to top up monthly?"
> Equity-scaled trading means your position sizes grow automatically with your account balance. Monthly top-ups compound your growth. It's like an ETF where you keep buying more shares.

### "What if I see a big loss?"
> Drawdowns of 30–40% are normal and expected. Historically, every single drawdown has recovered within 2–4 months. This is systematic trading. Patience wins.

### "Can I withdraw?"
> Yes, anytime via IC Markets. But withdrawing early disrupts compounding. Recommend holding at least 12 months. Most investors who wait are up 50%+ by then.

### "My MT5 balance changed. Is something wrong?"
> No. That's profit/loss from open trades. Your balance fluctuates daily. Check again in 24 hours — it usually stabilizes.

---

## Final Thoughts

✅ **You're ready to send when:**
- Account is live and actively trading
- Dashboard is syncing live data
- All materials are accurate and tested
- Investor has confirmed their commitment
- You've tested login and dashboard yourself

✨ **Remember:**
- First impression matters (ensure everything works before sending)
- Transparency is your advantage (Myfxbook + MT5 + live dashboard)
- Monthly top-ups are the key to success (compounding)
- Drawdown fear is your biggest enemy (reassure investors they're normal)

🚀 **Now go onboard that investor!**
