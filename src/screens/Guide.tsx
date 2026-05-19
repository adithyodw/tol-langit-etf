// Investor onboarding guide.
//
// Three parts:
//   1. How to think about TOL LANGIT — as an ETF, not a trade.
//   2. The monthly top-up habit — why a fixed contribution every month works
//      with an equity-scaled strategy.
//   3. How to connect — direct EA installation on the investor's own IC
//      Markets account, hosted on a MetaQuotes / Google Cloud VPS.

import { OPERATOR } from '../data/signals';

interface EtfPoint {
  k: string;
  h: string;
  p: string;
}

const ETF_POINTS: EtfPoint[] = [
  {
    k: '01',
    h: 'Diversified, not a single bet',
    p: 'You are not backing one trade. TOL LANGIT is two systematic strategies — V10, an eight-pair FX basket, and ETF Gold, XAUUSD with an AUDCAD overlay. Risk is spread across instruments, exactly like a fund.',
  },
  {
    k: '02',
    h: 'Fully automated',
    p: 'The strategy runs as an Expert Advisor (EA) on MetaTrader. It executes 24 hours a day, five days a week, with no manual trading and no market timing on your part.',
  },
  {
    k: '03',
    h: 'Independently verified',
    p: 'Every number in this app is third-party tracked on Myfxbook and shadow-verified on MQL5. You audit the basket before you fund it — and every day after.',
  },
  {
    k: '04',
    h: 'You allocate — you do not manage',
    p: 'Your only job is to decide how much to put in and how often. No charts to watch, no positions to adjust. That is fund behaviour, not day-trading.',
  },
];

interface Tier {
  amount: string;
  perMonth: number;
  name: string;
  who: string;
}

const TIERS: Tier[] = [
  {
    amount: '$100',
    perMonth: 100,
    name: 'Starter Stash',
    who: 'Build the habit. A low-commitment amount — enough to learn how the basket behaves with real skin in the game, without stretching your budget.',
  },
  {
    amount: '$500',
    perMonth: 500,
    name: 'Builder',
    who: 'A serious monthly savings line. For investors with a multi-year goal who want the stash to genuinely matter.',
  },
  {
    amount: '$1,000',
    perMonth: 1000,
    name: 'Serious Compounding',
    who: 'A primary growth sleeve. For investors treating TOL LANGIT as a core part of their long-term plan.',
  },
];

interface Step {
  k: string;
  h: string;
  p: string;
  note?: string;
}

const STEPS: Step[] = [
  {
    k: '01',
    h: 'Open an IC Markets account',
    p: 'Register a live MetaTrader 5 Raw Spread account with IC Markets using the link below. Raw Spread is required — Standard and cTrader accounts are not compatible with the EA configuration.',
  },
  {
    k: '02',
    h: 'Already with IC Markets?',
    p: 'If you already hold an IC Markets account you can link it to the TOL LANGIT partnership instead of opening a new one. Message on Telegram and we will arrange it.',
  },
  {
    k: '03',
    h: 'Share your MT5 login',
    p: 'Send your MT5 account number and Master Password (this is separate from your client-portal password) via Telegram. Credentials are used only to install the EA and are not retained, logged, or stored afterward.',
  },
  {
    k: '04',
    h: 'Subscribe to the MQL5 VPS',
    p: 'The EA runs on MetaQuotes’ VPS — hosted on Google Cloud infrastructure — so it trades 24/5 without your own computer being switched on. The subscription is roughly USD $10–15 per month depending on term.',
    note: 'This is the always-on Google Cloud server your account connects to.',
  },
  {
    k: '05',
    h: 'Get your MetaQuotes ID',
    p: 'In MT5 open Tools → Options → Community (the Messages tab on some builds). Copy the 9-digit MetaQuotes ID and send it over so the VPS can be activated and synced to your terminal.',
  },
  {
    k: '06',
    h: 'Monitor your account',
    p: 'That is it. The EA trades directly on your own IC Markets account — you keep full visibility and control. Track every fill live on Myfxbook and MQL5, the same independent verification shown throughout this app.',
  },
];

interface ControlPoint {
  h: string;
  p: string;
}

const CONTROL_POINTS: ControlPoint[] = [
  {
    h: 'Your money never leaves your account',
    p: 'Funds sit in your own IC Markets account. Deposits and withdrawals are yours alone — no one else can move them.',
  },
  {
    h: 'Not pooled, not a managed fund',
    p: 'This is your account running an EA. It is not a fund that holds your cash and it is not copy-trading from a shared master.',
  },
  {
    h: 'Switch off any time',
    p: 'Remove the EA or stop the VPS whenever you choose. There is no lock-up and no notice period.',
  },
  {
    h: 'Verified, never promised',
    p: 'Every performance figure is third-party tracked on Myfxbook. You are shown the real statement — good months and bad.',
  },
];

function fmtUsd(n: number): string {
  return '$' + n.toLocaleString('en-US');
}

export function Guide() {
  return (
    <div className="screen">
      <div className="topbar">
        <div className="topbar-l">
          <span className="kicker">INVESTOR ONBOARDING</span>
          <h1 className="topbar-title">Guide</h1>
        </div>
      </div>

      <div className="guide-hero">
        <div className="guide-hero-title">Treat TOL LANGIT as your ETF</div>
        <p className="guide-hero-sub">
          A simple way to think about this account — and how to turn it into a
          monthly savings habit that compounds.
        </p>
      </div>

      {/* ---- What is an ETF ---- */}
      <div className="section-label"><span>What is an ETF?</span></div>
      <div className="card guide-prose">
        <p>
          An <strong>ETF — Exchange-Traded Fund</strong> — is one basket that
          holds many things at once. Instead of picking individual trades
          yourself, you buy into a single diversified, professionally-run
          basket and let it do the work.
        </p>
        <p>
          ETF investors do not try to time the market. They add money on a
          regular schedule and let it compound over years. It is meant to be
          boring — and that is exactly the point.
        </p>
      </div>

      {/* ---- Why treat this as an ETF ---- */}
      <div className="section-label">
        <span>Why treat TOL LANGIT this way</span>
      </div>
      <div className="card etf-points">
        {ETF_POINTS.map((pt) => (
          <div key={pt.k} className="etf-point">
            <span className="etf-point-num mono">{pt.k}</span>
            <div className="etf-point-body">
              <div className="etf-point-h">{pt.h}</div>
              <div className="etf-point-p">{pt.p}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ---- The monthly top-up habit ---- */}
      <div className="section-label">
        <span>The monthly top-up habit</span>
      </div>
      <div className="card guide-prose">
        <p>
          Here is the mechanic that makes regular top-ups powerful: the
          strategy sizes <strong>every trade as a percentage of your account
          equity</strong>. The moment you add money, the very next trades are
          automatically larger — no resizing, no settings to change. Your new
          capital starts working at full strength immediately.
        </p>
        <p>
          So adding a fixed amount each month is <strong>dollar-cost
          averaging into a compounding engine</strong>. You keep feeding the
          basket like a savings habit while past gains compound on top. Strong
          months and weak months average out — the discipline of showing up
          every month is what builds the stash.
        </p>
      </div>

      {/* ---- Pick your monthly amount ---- */}
      <div className="section-label">
        <span>Pick your monthly amount</span>
        <span className="section-right">Top up every month</span>
      </div>
      <div className="tier-stack">
        {TIERS.map((t) => (
          <div key={t.name} className="tier-card">
            <div className="tier-head">
              <span className="tier-amt mono">{t.amount}</span>
              <span className="tier-per mono">/ month</span>
            </div>
            <div className="tier-name">{t.name}</div>
            <div className="tier-who">{t.who}</div>
            <div className="tier-foot">
              <div className="tier-foot-cell">
                <span className="tier-foot-k">You set aside · 12 mo</span>
                <span className="tier-foot-v mono">
                  {fmtUsd(t.perMonth * 12)}
                </span>
              </div>
              <div className="tier-foot-cell">
                <span className="tier-foot-k">You set aside · 24 mo</span>
                <span className="tier-foot-v mono">
                  {fmtUsd(t.perMonth * 24)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="footnote sm-pad">
        The amounts above are your own contributions — money you decide to
        save, not a projected return. What the strategy does with that capital
        is shown — and only shown — on the verified Myfxbook statement.
      </div>

      {/* ---- See your own numbers ---- */}
      <div className="section-label"><span>See your own numbers</span></div>
      <div className="card guide-callout">
        <div className="guide-callout-h">Model it before you commit</div>
        <p>
          Open the <strong>Home</strong> tab and scroll to the
          <strong> Simulation</strong> panel. Enter the capital you plan to
          start with, pick a holding period, and the app replays the actual
          verified Myfxbook months against your number — so you see the real
          range of outcomes, not a sales pitch.
        </p>
      </div>

      {/* ---- Connect to the server ---- */}
      <div className="section-label">
        <span>Connect to the Google Cloud server</span>
        <span className="section-right">Direct install</span>
      </div>
      <div className="card guide-prose">
        <p>
          This is <strong>direct EA installation on your own account</strong> —
          not a pooled fund and not copy-trading. The strategy is installed
          straight onto your IC Markets account and runs on a MetaQuotes VPS
          hosted on <strong>Google Cloud</strong>, so it executes around the
          clock without your computer being on.
        </p>
      </div>
      <div className="card step-list">
        {STEPS.map((s) => (
          <div key={s.k} className="step-row">
            <span className="step-num mono">{s.k}</span>
            <div className="step-body">
              <div className="step-h">{s.h}</div>
              <div className="step-p">{s.p}</div>
              {s.note && <div className="step-note mono">{s.note}</div>}
            </div>
          </div>
        ))}
      </div>

      <div className="guide-cta-row">
        <a
          className="guide-cta primary"
          href={OPERATOR.links.icMarkets}
          target="_blank"
          rel="noreferrer"
        >
          Open IC Markets account ↗
        </a>
        <a
          className="guide-cta"
          href={OPERATOR.links.telegram}
          target="_blank"
          rel="noreferrer"
        >
          Message on Telegram ↗
        </a>
      </div>
      <div className="footnote sm-pad">
        Disclosure — the IC Markets link is an affiliate code. It does not
        change your spreads, your commissions, or how the strategy executes on
        your account.
      </div>

      {/* ---- What stays in your control ---- */}
      <div className="section-label">
        <span>What stays in your control</span>
      </div>
      <div className="card etf-points">
        {CONTROL_POINTS.map((c) => (
          <div key={c.h} className="etf-point">
            <span className="etf-point-tick" aria-hidden="true">✓</span>
            <div className="etf-point-body">
              <div className="etf-point-h">{c.h}</div>
              <div className="etf-point-p">{c.p}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="footnote">
        Trading leveraged FX and CFDs carries a substantial risk of loss and is
        not suitable for every investor — capital can be lost in full. Monthly
        top-ups are a savings discipline, not a guarantee of gains. Past
        performance, including every Myfxbook and MQL5 figure shown, is not
        indicative of future results. Never contribute money you cannot afford
        to lose. © 2026 TOL LANGIT.
      </div>
    </div>
  );
}
