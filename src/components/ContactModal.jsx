import React, { useState } from 'react';
import { RESUME_DATA } from '../data/resumeData';
import { playPop, playBoop, playChime } from '../utils/audio';
import { X, Mail, Phone, MapPin, Copy, Check, Radio, Shield } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';

export function ContactModal({ isOpen, onClose }) {
  const [copiedField, setCopiedField] = useState(null);

  if (!isOpen) return null;

  const handleCopy = (text, fieldName) => {
    playChime();
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '2.2rem', maxWidth: '560px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div className="p3-banner-title" style={{ fontSize: '1.1rem', padding: '0.15rem 0.8rem', marginBottom: '0.6rem' }}>
              <span>COMM LINK // S.E.E.S. TRANSMISSION</span>
            </div>
            <h3 style={{ fontSize: '2.2rem', color: 'var(--p3-white)', lineHeight: 1 }}>DIRECT CONTACT</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--p3-cyan)', fontFamily: 'var(--font-p3-tech)' }}>
              Open for full-time AI engineering, agentic architecture, and enterprise missions.
            </p>
          </div>

          <button
            onClick={() => {
              playPop();
              onClose();
            }}
            aria-label="Close modal"
            style={{
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--p3-bg-surface)',
              border: '2px solid var(--p3-border)',
              color: 'var(--p3-white)',
              cursor: 'pointer',
              transform: 'skewX(-8deg)',
              boxShadow: '3px 3px 0 #000',
            }}
          >
            <span style={{ transform: 'skewX(8deg)' }}><X size={18} /></span>
          </button>
        </div>

        {/* Contact Channels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.8rem' }}>
          {/* Email */}
          <div
            className="p3-card"
            style={{
              padding: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--p3-bg-surface)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  background: 'rgba(0, 210, 255, 0.15)',
                  border: '1.5px solid var(--p3-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--p3-cyan)',
                  transform: 'skewX(-8deg)',
                }}
              >
                <span style={{ transform: 'skewX(8deg)' }}><Mail size={20} /></span>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontFamily: 'var(--font-p3-mono)' }}>SECURE EMAIL</div>
                <a
                  href={`mailto:${RESUME_DATA.email}`}
                  style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFF', fontFamily: 'var(--font-p3-tech)' }}
                >
                  {RESUME_DATA.email}
                </a>
              </div>
            </div>

            <button
              onClick={() => handleCopy(RESUME_DATA.email, 'email')}
              className="p3-btn p3-btn-sm"
              style={{ fontSize: '1rem', minHeight: '34px', padding: '0.3rem 0.8rem' }}
            >
              <span>{copiedField === 'email' ? 'COPIED!' : 'COPY'}</span>
            </button>
          </div>

          {/* Phone */}
          <div
            className="p3-card"
            style={{
              padding: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--p3-bg-surface)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  background: 'rgba(255, 30, 68, 0.15)',
                  border: '1.5px solid var(--p3-crimson)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--p3-crimson)',
                  transform: 'skewX(-8deg)',
                }}
              >
                <span style={{ transform: 'skewX(8deg)' }}><Phone size={20} /></span>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontFamily: 'var(--font-p3-mono)' }}>VOICE / WHATSAPP</div>
                <a
                  href={`tel:${RESUME_DATA.phone}`}
                  style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFF', fontFamily: 'var(--font-p3-tech)' }}
                >
                  {RESUME_DATA.phone}
                </a>
              </div>
            </div>

            <button
              onClick={() => handleCopy(RESUME_DATA.phone, 'phone')}
              className="p3-btn p3-btn-sm"
              style={{ fontSize: '1rem', minHeight: '34px', padding: '0.3rem 0.8rem' }}
            >
              <span>{copiedField === 'phone' ? 'COPIED!' : 'COPY'}</span>
            </button>
          </div>

          {/* Location */}
          <div
            className="p3-card"
            style={{
              padding: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              background: 'var(--p3-bg-surface)',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                background: 'rgba(255, 230, 0, 0.15)',
                border: '1.5px solid var(--p3-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--p3-gold)',
                transform: 'skewX(-8deg)',
              }}
            >
              <span style={{ transform: 'skewX(8deg)' }}><MapPin size={20} /></span>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontFamily: 'var(--font-p3-mono)' }}>OPERATIONAL BASE</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>
                {RESUME_DATA.location} (Open to Relocation / Hybrid / Remote)
              </div>
            </div>
          </div>
        </div>

        {/* Social / Profiles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem', marginBottom: 0 }}>
          <a
            href={RESUME_DATA.linkedin}
            target="_blank"
            rel="noreferrer"
            onClick={() => playPop()}
            className="p3-btn p3-btn-secondary"
            style={{ textDecoration: 'none', fontSize: '1.1rem' }}
          >
            <LinkedinIcon size={18} color="#00D2FF" />
            <span>LINKEDIN</span>
          </a>

          <a
            href={RESUME_DATA.github}
            target="_blank"
            rel="noreferrer"
            onClick={() => playPop()}
            className="p3-btn p3-btn-secondary"
            style={{ textDecoration: 'none', fontSize: '1.1rem' }}
          >
            <GithubIcon size={18} />
            <span>GITHUB</span>
          </a>
        </div>
      </div>
    </div>
  );
}
