import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Form State
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('☕ Kopi');
  const [note, setNote] = useState('');

  // Initial History Kosong
  const [expenses, setExpenses] = useState([]);

  // Pilihan Kategori
  const categories = [
    { label: 'Kopi', emoji: '☕' },
    { label: 'Makan', emoji: '🍱' },
    { label: 'Belanja', emoji: '🛍️' },
    { label: 'Transport', emoji: '🚕' },
    { label: 'Jajan', emoji: '🥐' },
    { label: 'Lain-lain', emoji: '🌀' },
  ];

  // Hitung Total Pengeluaran
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);

  // Sound Synth Sederhana
  const playSound = (type) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'coin') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(784, ctx.currentTime);
        osc.frequency.setValueAtTime(1174, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.log(e);
    }
  };

  // Klik Kelinci
  const handleBunnyClick = () => {
    if (isAnimating) return;
    playSound('coin');
    setIsAnimating(true);

    setTimeout(() => {
      setIsAnimating(false);
      setIsFormVisible(true);
    }, 700);
  };

  // Submit Transaksi
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!amount) return;

    playSound('coin');
    const numAmount = parseInt(amount, 10);
    const newEntry = {
      id: Date.now(),
      amount: numAmount,
      category,
      note: note || category.split(' ')[1],
    };

    setExpenses([newEntry, ...expenses]);
    setAmount('');
    setNote('');
  };

  return (
    <div className="main-screen">
      {!isFormVisible ? (
        /* 1. LAYAR AWAL: IKON KELINCI */
        <div className="bunny-stage">
          <div className="bunny-icon-only" onClick={handleBunnyClick}>
            <span className={`sparkle ${isAnimating ? 'active-1' : ''}`}>✨</span>
            <span className={`sparkle ${isAnimating ? 'active-2' : ''}`}>⭐</span>
            <span className={`sparkle ${isAnimating ? 'active-3' : ''}`}>✨</span>

            <div className="bunny-svg-container">
              <div className={`coin-drop ${isAnimating ? 'animating' : ''}`}>🪙</div>
              <svg
                className={`bunny-svg ${isAnimating ? 'bounce-rich' : ''}`}
                width="105"
                height="95"
                viewBox="0 0 100 90"
              >
                <ellipse cx="38" cy="22" rx="7" ry="18" fill="#FFFFFF" stroke="#DDB8A2" strokeWidth="2.5" />
                <ellipse cx="38" cy="22" rx="4" ry="12" fill="#EDE0D4" />

                <ellipse cx="62" cy="22" rx="7" ry="18" fill="#FFFFFF" stroke="#DDB8A2" strokeWidth="2.5" />
                <ellipse cx="62" cy="22" rx="4" ry="12" fill="#EDE0D4" />

                <rect x="42" y="34" width="16" height="3" rx="1.5" fill="#5C3D2E" />

                <ellipse cx="50" cy="56" rx="32" ry="26" fill="#FFFFFF" stroke="#DDB8A2" strokeWidth="2.5" />

                <circle cx="30" cy="58" r="4" fill="#EDE0D4" />
                <circle cx="70" cy="58" r="4" fill="#EDE0D4" />

                <circle cx="38" cy="52" r="3" fill="#2B1B17" />
                <circle cx="37" cy="51" r="1" fill="#FFFFFF" />
                <circle cx="62" cy="52" r="3" fill="#2B1B17" />
                <circle cx="61" cy="51" r="1" fill="#FFFFFF" />

                <path
                  d="M 48 56 Q 50 58 52 56 M 50 56 L 50 60 Q 48 62 50 63 Q 52 62 50 60"
                  fill="none"
                  stroke="#5C3D2E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        /* 2. FORMULIR PENGELUARAN */
        <div className="form-card">
          <button
            className="back-btn-icon"
            onClick={() => {
              playSound('click');
              setIsFormVisible(false);
            }}
          >
            ←
          </button>

          <h1 className="form-main-title">Hitung Pengeluaran Hari Ini</h1>

          <form onSubmit={handleAddExpense}>
            <div className="form-group">
              <label className="form-label">NOMINAL (RP)</label>
              <div className="amount-input-box">
                <span className="currency-symbol">Rp</span>
                <input
                  type="number"
                  required
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-amount"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">KATEGORI</label>
              <div className="category-selector">
                {categories.map((cat) => {
                  const fullVal = `${cat.emoji} ${cat.label}`;
                  return (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => {
                        playSound('click');
                        setCategory(fullVal);
                      }}
                      className={`cat-btn ${category === fullVal ? 'selected' : ''}`}
                    >
                      <span className="emoji">{cat.emoji}</span>
                      <span className="label">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">CATATAN</label>
              <input
                type="text"
                placeholder="misal: Pengeluaran tak terduga"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="input-text"
              />
            </div>

            <button type="submit" className="submit-btn">
              Simpan Transaksi 🪙
            </button>
          </form>

          <div className="history-box">
            <div className="history-title">CATATAN TERAKHIR</div>
            {expenses.length === 0 ? (
              <div className="history-empty">Belum ada catatan pengeluaran.</div>
            ) : (
              <div className="history-items">
                {expenses.map((item) => (
                  <div key={item.id} className="history-row">
                    <div className="row-left">
                      <span>{item.category.split(' ')[0]}</span>
                      <span className="row-note">{item.note}</span>
                    </div>
                    <span className="row-val">-Rp {item.amount.toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="summary-banner">
            <div>
              <div className="summary-label">TOTAL PENGELUARAN</div>
              <div className="summary-amount">
                Rp {totalExpense.toLocaleString('id-ID')}
              </div>
            </div>
            <div className="summary-icon">🐰</div>
          </div>
        </div>
      )}
    </div>
  );
}