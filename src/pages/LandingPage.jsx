import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

function TypewriterText({ text, speed = 100, delay = 0 }) {
  const [displayed, setDisplayed] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let timeout;
    timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setTimeout(() => setShowCursor(false), 1500);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return (
    <span className="typewriter">
      {displayed}
      {showCursor && <span className="typewriter-cursor">|</span>}
    </span>
  );
}

function FloatingOrbs() {
  return (
    <div className="floating-orbs">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />
    </div>
  );
}

function AnimatedCounter({ target, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    const el = document.getElementById(`counter-${target}`);
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [started, target, duration]);

  return (
    <span id={`counter-${target}`}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function LandingPage() {
  return (
    <div className="landing-page">
      <FloatingOrbs />
      <Navbar variant="landing" />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content animate-fade-up">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Academic Debt Tracker
          </div>

          <h1 className="hero-title">
            <TypewriterText text="Debt Tracker" speed={85} />
          </h1>
          <p className="hero-tagline">
            Your academic debt is growing.{' '}
            <span className="hero-accent">Start paying it off.</span>
          </p>
          <p className="hero-subtitle">
            Track pending assignments, monitor your academic debt score that grows daily,
            and clear it topic by topic. Stay on top of deadlines before they bury you.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg btn-glow">
              <span>Get Started Free</span>
              <span className="btn-arrow">→</span>
            </Link>
            <a href="#how-it-works" className="btn btn-ghost btn-lg">See how it works</a>
          </div>

          <div className="hero-proof">
            <span className="hero-proof-label">Trusted by students worldwide</span>
            <div className="hero-proof-stats">
              <div className="hero-proof-stat">
                <strong><AnimatedCounter target={2500} suffix="+" /></strong>
                <span>Students</span>
              </div>
              <div className="hero-proof-stat">
                <strong><AnimatedCounter target={15000} suffix="+" /></strong>
                <span>Tasks Cleared</span>
              </div>
              <div className="hero-proof-stat">
                <strong><AnimatedCounter target={98} suffix="%" /></strong>
                <span>Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <span className="section-label">Features</span>
        <h2 className="section-title">Everything you need to track your debt</h2>
        <p className="section-subtitle">
          Powerful tools designed to keep you accountable and on schedule.
        </p>
        <div className="features-grid">
          {[
            { icon: '📊', title: 'Debt Score', desc: 'A real-time score that increases daily for every pending task. See exactly how much you owe.' },
            { icon: '📋', title: 'Topic Tracker', desc: 'Break tasks into topics and check them off one by one. Watch your debt decrease as you learn.' },
            { icon: '🤖', title: 'AI Advisor', desc: 'Get personalized advice on what to prioritize based on your current debt and deadlines.' },
            { icon: '⚡', title: 'Real-time Updates', desc: 'Your debt score updates instantly as deadlines pass and topics are completed.' },
          ].map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-card-shine" />
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-section">
        <span className="section-label">How it works</span>
        <h2 className="section-title">Three steps to academic freedom</h2>
        <p className="section-subtitle">
          Simple, effective, and designed for students who mean business.
        </p>
        <div className="steps-grid">
          {[
            { num: '01', title: 'Add your tasks', desc: 'Enter assignments, exams, or topics with due dates and break them into subtopics.' },
            { num: '02', title: 'Track your debt', desc: 'Your debt score grows daily for overdue or pending tasks. Monitor it in real time.' },
            { num: '03', title: 'Clear it topic by topic', desc: 'Complete topics to reduce your score. Reach zero debt and stay academically free.' },
          ].map((s, i) => (
            <div className="step-card" key={i}>
              <div className="step-number">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <div className="step-connector" />
            </div>
          ))}
        </div>
      </section>

      {/* Marquee section */}
      <section className="marquee-section">
        <div className="marquee-track">
          <div className="marquee-content">
            {Array(3).fill(null).map((_, i) => (
              <span key={i} className="marquee-item">
                <span className="marquee-dot" />
                Debt Tracker
                <span className="marquee-dot" />
                TRACK IT
                <span className="marquee-dot" />
                CLEAR IT
                <span className="marquee-dot" />
                OWN IT
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-card">
          <h2>Ready to clear your debt?</h2>
          <p>Join thousands of students already tracking and paying off their academic debt.</p>
          <Link to="/register" className="btn btn-primary btn-lg btn-glow">Start for free →</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand-block">
            <div className="footer-logo-big">Debt Tracker</div>
            <p className="footer-desc">
              An academic debt tracker that helps students stay on top of their assignments. 
              Your pending tasks generate a debt score that grows daily — pay it off by completing topics.
            </p>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <Link to="/register" className="footer-link">Get Started</Link>
            <a href="#how-it-works" className="footer-link">How It Works</a>
            <Link to="/login" className="footer-link">Login</Link>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <a href="https://github.com/koushikkallamadi" target="_blank" rel="noopener noreferrer" className="footer-link">
              GitHub ↗
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2026 Debt Tracker. Built by Koushik Kallamadi.</span>
          <div className="footer-bottom-links">
            <span className="footer-link">Privacy</span>
            <span className="footer-link">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
