import React, { useState } from 'react';
import { X, Play, RefreshCw, Send, Sparkles, CheckCircle2, AlertTriangle, Activity, ArrowRight, ShieldCheck, Database, Bot, Cpu } from 'lucide-react';
import { playPop, playBoop, playChime } from '../utils/audio';

export function ProjectModal({ project, onClose }) {
  if (!project) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '2rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div className="p3-banner-title" style={{ fontSize: '1.1rem', padding: '0.15rem 0.8rem', marginBottom: '0.6rem' }}>
              <span>TACTICAL SIMULATION BENCH // VERIFIED</span>
            </div>
            <h3 style={{ fontSize: '2rem', color: 'var(--p3-white)', lineHeight: 1 }}>{project.title}</h3>
            <p style={{ fontSize: '1rem', color: 'var(--p3-cyan)', fontFamily: 'var(--font-p3-tech)' }}>{project.subtitle}</p>
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

        {/* Dynamic Simulator based on demoType */}
        {project.demoType === 'ecommerce' && <EcommerceSimulator />}
        {project.demoType === 'telecom' && <TelecomSimulator />}
        {project.demoType === 'sentiment' && <SentimentSimulator />}

        {/* Footer info */}
        <div
          style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '2px solid var(--p3-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-p3-mono)',
            color: '#64748B',
          }}
        >
          <span>S.E.E.S. PRODUCTION ARCHITECTURE</span>
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            onClick={() => playPop()}
            style={{
              color: 'var(--p3-cyan)',
              fontWeight: 700,
              textDecoration: 'underline',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            REPOSITORY LINK <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 1. ECOMMERCE BOT (LANGGRAPH & HITL) SIMULATOR
// -------------------------------------------------------------
function EcommerceSimulator() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "TACTICAL SUPPORT TERMINAL ENGAGED. LangGraph state machine standing by. Choose a test scenario or transmit custom query.",
      node: 'InitializationNode'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const simulateQuery = (queryText) => {
    playBoop();
    const userMsg = { sender: 'user', text: queryText };
    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    setTimeout(() => {
      let botResponse = '';
      let nodeName = 'LangGraphAgentNode';

      const lower = queryText.toLowerCase();
      if (lower.includes('refund') || lower.includes('human') || lower.includes('supervisor')) {
        nodeName = 'HITL_Middleware_Escalation';
        botResponse = '⚠️ HIGH-SEVERITY TRANSACTION DETECTED. LangGraph state checkpoint paused. Diverting to Human Supervisor desk via secure middleware. Zero data leaks permitted.';
        playChime();
      } else if (lower.includes('order') || lower.includes('ord-') || lower.includes('status')) {
        nodeName = 'SQLQueryCheckpointerNode';
        botResponse = '📦 Order #ORD-9821 status: In Transit with FedEx Hub. Estimated delivery: Tomorrow 14:00. Automated Gmail notification transmitted via API.';
      } else if (lower.includes('headphone') || lower.includes('product') || lower.includes('recommend')) {
        nodeName = 'ChromaDBVectorRAGNode';
        botResponse = '🎧 ChromaDB semantic vector search matched 3 top items: Sony WH-1000XM5 (98% cosine similarity), Bose QC45 (94%), and Anker Q30 (91%).';
      } else {
        nodeName = 'LangChainDialogueNode';
        botResponse = `Received instruction "${queryText}". Multi-turn LangGraph state serialized in SQLite graph checkpoint.`;
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botResponse, node: nodeName }]);
      setIsProcessing(false);
      playPop();
    }, 600);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    simulateQuery(inputVal.trim());
    setInputVal('');
  };

  return (
    <div>
      {/* LangGraph Node Status Bar */}
      <div
        style={{
          background: 'rgba(5, 12, 34, 0.95)',
          padding: '0.75rem 1rem',
          border: '2px solid var(--p3-border)',
          marginBottom: '1rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.2rem',
          fontSize: '0.82rem',
          fontFamily: 'var(--font-p3-mono)',
          alignItems: 'center',
          transform: 'skewX(-6deg)',
        }}
      >
        <span style={{ transform: 'skewX(6deg)', color: 'var(--p3-cyan)', fontWeight: 700 }}>
          ⚡ STATE: ACTIVE
        </span>
        <span style={{ transform: 'skewX(6deg)', color: '#38BDF8' }}>
          CHECKPOINT: SQLite
        </span>
        <span style={{ transform: 'skewX(6deg)', color: 'var(--p3-crimson)' }}>
          HITL: ARMED
        </span>
      </div>

      {/* Chat Messages Log */}
      <div
        style={{
          height: '240px',
          overflowY: 'auto',
          background: '#040716',
          border: '2px solid var(--p3-border)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          marginBottom: '1rem',
        }}
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              background: m.sender === 'user' ? 'var(--p3-cyan)' : 'var(--p3-bg-surface)',
              color: m.sender === 'user' ? '#000000' : 'var(--p3-ice)',
              padding: '0.65rem 0.95rem',
              border: m.sender === 'user' ? '2px solid #000' : '1.5px solid var(--p3-border)',
              boxShadow: '3px 3px 0 #000',
              fontSize: '0.92rem',
              transform: 'skewX(-6deg)',
            }}
          >
            <div style={{ transform: 'skewX(6deg)' }}>
              {m.node && (
                <div style={{ fontSize: '0.7rem', opacity: 0.8, marginBottom: '0.2rem', fontFamily: 'var(--font-p3-mono)', fontWeight: 700 }}>
                  [NODE: {m.node}]
                </div>
              )}
              <div>{m.text}</div>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div style={{ fontSize: '0.85rem', color: 'var(--p3-cyan)', fontStyle: 'italic', fontFamily: 'var(--font-p3-mono)' }}>
            LangGraph state machine processing transitions...
          </div>
        )}
      </div>

      {/* Preset Test Prompts */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--p3-cyan)', marginBottom: '0.4rem', fontFamily: 'var(--font-p3-mono)' }}>
          TRANSMIT TEST COMMANDS:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {[
            "Where is order #ORD-9821?",
            "Request $250 refund (Trigger HITL)",
            "Recommend noise canceling headphones"
          ].map((promptText) => (
            <button
              key={promptText}
              onClick={() => simulateQuery(promptText)}
              className="p3-tag"
              style={{
                cursor: 'pointer',
                background: 'var(--p3-bg-surface)',
                color: '#FFF',
                border: '1.5px solid var(--p3-cyan)',
              }}
            >
              <span>&gt; {promptText}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Transmit support query to LangGraph agent..."
          style={{
            flex: 1,
            padding: '0.65rem 1rem',
            border: '2px solid var(--p3-border)',
            background: 'var(--p3-bg-surface)',
            color: '#FFF',
            fontSize: '0.95rem',
            fontFamily: 'var(--font-p3-tech)',
            transform: 'skewX(-6deg)',
          }}
        />
        <button type="submit" className="p3-btn p3-btn-sm">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

// -------------------------------------------------------------
// 2. TELECOM NETWORK INTELLIGENCE SIMULATOR
// -------------------------------------------------------------
function TelecomSimulator() {
  const [towers, setTowers] = useState([
    { id: 'ALPHA-01', region: 'Hyderabad North Sector', latency: '18ms', packetLoss: '0.02%', temp: '42°C', status: 'STABLE' },
    { id: 'BETA-02', region: 'Secunderabad Core Hub', latency: '24ms', packetLoss: '0.05%', temp: '45°C', status: 'STABLE' },
    { id: 'GAMMA-03', region: 'Cyberabad Zone 4', latency: '142ms', packetLoss: '4.8%', temp: '68°C', status: 'CRITICAL RISK' },
    { id: 'DELTA-04', region: 'Gachibowli Ring Cluster', latency: '21ms', packetLoss: '0.01%', temp: '39°C', status: 'STABLE' }
  ]);
  const [predictionRun, setPredictionRun] = useState(false);
  const [loading, setLoading] = useState(false);

  const runRandomForestModel = () => {
    playBoop();
    setLoading(true);
    setTimeout(() => {
      setPredictionRun(true);
      setLoading(false);
      playChime();
    }, 700);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <span style={{ fontWeight: 800, fontSize: '1.2rem', fontFamily: 'var(--font-p3-display)', color: 'var(--p3-white)' }}>
            SECTOR 01 TELEMETRY // PYSPARK STREAM
          </span>
          <p style={{ fontSize: '0.82rem', color: '#94A3B8', fontFamily: 'var(--font-p3-mono)' }}>
            Airflow DAG Orchestration · 99.9% Reliability
          </p>
        </div>
        <button
          onClick={runRandomForestModel}
          disabled={loading}
          className="p3-btn p3-btn-sm"
        >
          {loading ? <RefreshCw size={14} className="spin" /> : <Play size={14} />}
          <span>{loading ? 'ANALYZING...' : 'RUN RF CLASSIFIER'}</span>
        </button>
      </div>

      {/* Tower Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0.8rem', marginBottom: '1rem' }}>
        {towers.map((t) => {
          const isAtRisk = t.status === 'CRITICAL RISK';
          return (
            <div
              key={t.id}
              className="p3-card"
              style={{
                padding: '0.9rem',
                border: isAtRisk ? '2px solid var(--p3-crimson)' : '2px solid var(--p3-border)',
                background: isAtRisk ? 'rgba(255, 30, 68, 0.1)' : 'var(--p3-bg-surface)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span style={{ fontWeight: 800, fontFamily: 'var(--font-p3-mono)', fontSize: '0.95rem' }}>{t.id}</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: isAtRisk ? '#FFF' : 'var(--p3-cyan)',
                    background: isAtRisk ? 'var(--p3-crimson)' : 'rgba(0, 210, 255, 0.15)',
                    padding: '0.15rem 0.5rem',
                    fontFamily: 'var(--font-p3-mono)',
                  }}
                >
                  {t.status}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '0.5rem' }}>{t.region}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem', fontSize: '0.8rem', fontFamily: 'var(--font-p3-mono)' }}>
                <div>PING: <strong>{t.latency}</strong></div>
                <div>LOSS: <strong>{t.packetLoss}</strong></div>
                <div>TEMP: <strong>{t.temp}</strong></div>
                <div>LOAD: <strong>84%</strong></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Random Forest Output */}
      {predictionRun && (
        <div
          style={{
            background: 'rgba(0, 210, 255, 0.08)',
            border: '2px solid var(--p3-cyan)',
            padding: '1rem',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--p3-cyan)', fontWeight: 800, fontSize: '1.1rem', fontFamily: 'var(--font-p3-display)', marginBottom: '0.4rem' }}>
            <Activity size={18} />
            <span>RANDOM FOREST CLASSIFICATION (90.4% CONFIDENCE)</span>
          </div>
          <p style={{ fontSize: '0.92rem', color: '#FFF', marginBottom: '0.5rem' }}>
            🚩 <strong>Tower GAMMA-03: 92% Failure Probability detected</strong> within 48 hours.
          </p>
          <div style={{ fontSize: '0.82rem', color: '#CBD5E1', background: '#020617', padding: '0.6rem 0.8rem', border: '1px solid var(--p3-border)', fontFamily: 'var(--font-p3-mono)' }}>
            ⚡ <strong>Automated Airflow Action:</strong> Diverted packet flow to BETA-02. Network downtime reduced by 20%. User education ticket averted.
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 3. SENTIMENT NLP ANALYSIS SIMULATOR
// -------------------------------------------------------------
function SentimentSimulator() {
  const [text, setText] = useState("Automated telecom AI solved my outage in 30 seconds, phenomenal work!");
  const [result, setResult] = useState({
    sentiment: 'VERY POSITIVE',
    confidence: '96.2%',
    emoji: '🤩',
    entities: ['telecom AI', '30 seconds', 'phenomenal work'],
    color: 'var(--p3-cyan)',
  });

  const analyze = (sampleText) => {
    playBoop();
    setText(sampleText);

    const lower = sampleText.toLowerCase();
    let sentiment = 'NEUTRAL RESONANCE';
    let confidence = '78.2%';
    let emoji = '😐';
    let color = '#38BDF8';
    let entities = ['customer transmission'];

    if (lower.includes('phenomenal') || lower.includes('great') || lower.includes('30 seconds') || lower.includes('brilliant') || lower.includes('love')) {
      sentiment = 'HIGH POSITIVE RESONANCE';
      confidence = '96.4%';
      emoji = '🤩';
      color = 'var(--p3-cyan)';
      entities = ['automated AI bot', 'fast resolution', 'customer delight'];
    } else if (lower.includes('dropped') || lower.includes('unacceptable') || lower.includes('frustrat') || lower.includes('terrible')) {
      sentiment = 'CRITICAL NEGATIVE // SEV-1';
      confidence = '94.1%';
      emoji = '😡';
      color = 'var(--p3-crimson)';
      entities = ['call drop', '45 min hold', 'system latency'];
    }

    setResult({ sentiment, confidence, emoji, color, entities });
    playPop();
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--p3-cyan)', marginBottom: '0.4rem', fontFamily: 'var(--font-p3-mono)' }}>
          SELECT REVIEWS (VOICE CALL & TEXT CORPUS):
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {[
            "Automated telecom AI solved my outage in 30 seconds, phenomenal work!",
            "Waited 45 minutes on hold and call dropped. Completely unacceptable.",
            "The service is functional, but the mobile dashboard takes time to update."
          ].map((sample) => (
            <button
              key={sample}
              onClick={() => analyze(sample)}
              style={{
                textAlign: 'left',
                padding: '0.6rem 0.8rem',
                border: '1.5px solid var(--p3-border)',
                background: text === sample ? 'rgba(0, 210, 255, 0.15)' : 'var(--p3-bg-surface)',
                color: '#FFF',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-p3-tech)',
              }}
            >
              &gt; "{sample}"
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Result Card */}
      <div
        style={{
          padding: '1.2rem',
          background: '#040717',
          border: `2px solid ${result.color}`,
          boxShadow: `4px 4px 0 #000, 0 0 20px ${result.color}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.4rem', fontFamily: 'var(--font-p3-display)', color: result.color }}>
              {result.sentiment} [{result.confidence}]
            </div>
            <div style={{ color: '#94A3B8', fontSize: '0.85rem', fontFamily: 'var(--font-p3-mono)' }}>
              TensorFlow + SpaCy NLP Baseline: 89% Target Exceeded
            </div>
          </div>
          <span style={{ fontSize: '2.5rem' }}>{result.emoji}</span>
        </div>

        <div style={{ fontSize: '0.82rem', color: '#94A3B8', fontFamily: 'var(--font-p3-mono)' }}>
          <strong style={{ color: '#FFF' }}>EXTRACTED PSYCHE ENTITIES:</strong>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.3rem' }}>
            {result.entities.map((ent) => (
              <span key={ent} className="p3-tag" style={{ fontSize: '0.78rem' }}>
                <span>🏷️ {ent}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
