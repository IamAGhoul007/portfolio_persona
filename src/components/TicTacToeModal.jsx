import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Trophy, Sparkles } from 'lucide-react';
import { playPop, playBoop, playChime, playOneMore } from '../utils/audio';

export function TicTacToeModal({ isOpen, onClose }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [scores, setScores] = useState({ player: 0, shadow: 0, draws: 0 });

  useEffect(() => {
    if (isOpen) {
      resetGame();
    }
  }, [isOpen]);

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    if (squares.every((sq) => sq !== null)) {
      return { winner: 'Draw', line: [] };
    }
    return null;
  };

  const handleCellClick = (index) => {
    if (board[index] || winner || !isXNext) return;

    playPop();
    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      handleGameEnd(result);
      return;
    }

    setIsXNext(false);
  };

  // Shadow AI move
  useEffect(() => {
    if (!isXNext && !winner) {
      const timer = setTimeout(() => {
        makeAiMove();
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [isXNext, winner, board]);

  const makeAiMove = () => {
    playBoop();
    const emptyIndices = board.map((val, idx) => (val === null ? idx : null)).filter((val) => val !== null);
    if (emptyIndices.length === 0) return;

    // Smart logic: Check if AI can win or block player
    let chosenIdx = null;

    // 1. Can AI win?
    for (const idx of emptyIndices) {
      const testBoard = [...board];
      testBoard[idx] = 'O';
      if (checkWinner(testBoard)?.winner === 'O') {
        chosenIdx = idx;
        break;
      }
    }

    // 2. Can AI block player?
    if (chosenIdx === null) {
      for (const idx of emptyIndices) {
        const testBoard = [...board];
        testBoard[idx] = 'X';
        if (checkWinner(testBoard)?.winner === 'X') {
          chosenIdx = idx;
          break;
        }
      }
    }

    // 3. Take center if available
    if (chosenIdx === null && board[4] === null) {
      chosenIdx = 4;
    }

    // 4. Random available
    if (chosenIdx === null) {
      chosenIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }

    const newBoard = [...board];
    newBoard[chosenIdx] = 'O';
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      handleGameEnd(result);
    } else {
      setIsXNext(true);
    }
  };

  const handleGameEnd = (result) => {
    setWinner(result.winner);
    setWinningLine(result.line);
    if (result.winner === 'X') {
      playOneMore();
      setScores((s) => ({ ...s, player: s.player + 1 }));
    } else if (result.winner === 'O') {
      playPop();
      setScores((s) => ({ ...s, shadow: s.shadow + 1 }));
    } else {
      playChime();
      setScores((s) => ({ ...s, draws: s.draws + 1 }));
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine([]);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '480px',
          background: 'rgba(5, 12, 36, 0.96)',
          border: '3px solid var(--p3-cyan)',
          padding: '2rem',
          boxShadow: '0 0 50px rgba(0, 210, 255, 0.4), 8px 8px 0 #000',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div className="p3-banner-title" style={{ fontSize: '1.1rem', padding: '0.15rem 0.8rem', marginBottom: '0.4rem' }}>
              <span>TACTICS // TIC-TAC-TOE</span>
            </div>
            <h3 style={{ fontSize: '2rem', color: '#FFF', lineHeight: 1 }}>SHADOW MATCH</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--p3-cyan)', fontFamily: 'var(--font-p3-tech)' }}>
              Operative Aman (X) vs Tartarus Shadow (O)
            </p>
          </div>

          <button
            onClick={() => {
              playPop();
              onClose();
            }}
            aria-label="Close"
            style={{
              width: '36px',
              height: '36px',
              background: 'var(--p3-bg-surface)',
              border: '2px solid var(--p3-border)',
              color: '#FFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'skewX(-8deg)',
            }}
          >
            <span style={{ transform: 'skewX(8deg)' }}><X size={18} /></span>
          </button>
        </div>

        {/* Score Board */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '0.6rem',
            textAlign: 'center',
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-p3-display)',
          }}
        >
          <div className="p3-card" style={{ padding: '0.6rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--p3-cyan)' }}>AMAN (X)</div>
            <div style={{ fontSize: '1.8rem', color: '#FFF', lineHeight: 1 }}>{scores.player}</div>
          </div>
          <div className="p3-card" style={{ padding: '0.6rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>DRAWS</div>
            <div style={{ fontSize: '1.8rem', color: '#FFF', lineHeight: 1 }}>{scores.draws}</div>
          </div>
          <div className="p3-card" style={{ padding: '0.6rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--p3-crimson)' }}>SHADOW (O)</div>
            <div style={{ fontSize: '1.8rem', color: '#FFF', lineHeight: 1 }}>{scores.shadow}</div>
          </div>
        </div>

        {/* 3x3 Battle Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            marginBottom: '1.5rem',
            aspectRatio: '1/1',
            maxWidth: '340px',
            margin: '0 auto 1.5rem auto',
          }}
        >
          {board.map((cell, idx) => {
            const isWinningCell = winningLine.includes(idx);

            return (
              <button
                key={idx}
                onClick={() => handleCellClick(idx)}
                disabled={cell !== null || winner !== null}
                style={{
                  background: isWinningCell
                    ? 'var(--p3-cyan)'
                    : cell
                    ? 'rgba(10, 24, 64, 0.9)'
                    : 'rgba(5, 14, 42, 0.75)',
                  border: isWinningCell ? '3px solid #FFF' : '2px solid var(--p3-border)',
                  boxShadow: isWinningCell ? '0 0 25px var(--p3-cyan-glow)' : '3px 3px 0 #000',
                  color: isWinningCell
                    ? '#000'
                    : cell === 'X'
                    ? 'var(--p3-cyan)'
                    : 'var(--p3-crimson)',
                  fontFamily: 'var(--font-p3-display)',
                  fontSize: '3.2rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: cell === null && !winner ? 'pointer' : 'default',
                  transform: 'skewX(-6deg)',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ transform: 'skewX(6deg)', lineHeight: 1 }}>
                  {cell}
                </span>
              </button>
            );
          })}
        </div>

        {/* Status / Results */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', minHeight: '32px' }}>
          {winner ? (
            <div style={{ fontFamily: 'var(--font-p3-display)', fontSize: '1.6rem', color: winner === 'X' ? 'var(--p3-cyan)' : winner === 'O' ? 'var(--p3-crimson)' : 'var(--p3-gold)' }}>
              {winner === 'X' && '★ ONE MORE! AMAN WINS! ★'}
              {winner === 'O' && 'SHADOW COUNTERED! TRY AGAIN.'}
              {winner === 'Draw' && 'STALEMATE // DRAW'}
            </div>
          ) : (
            <div style={{ fontFamily: 'var(--font-p3-mono)', fontSize: '0.85rem', color: 'var(--p3-cyan)' }}>
              {isXNext ? '> AMAN TURN [CLICK EMPTY TILE]' : '> SHADOW EVALUATING TACTICS...'}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
          <button onClick={resetGame} className="p3-btn p3-btn-sm" style={{ flex: 1 }}>
            <RefreshCw size={16} />
            <span>REMATCH</span>
          </button>
          <button onClick={onClose} className="p3-btn p3-btn-secondary p3-btn-sm" style={{ flex: 1 }}>
            <span>CLOSE [B]</span>
          </button>
        </div>
      </div>
    </div>
  );
}
