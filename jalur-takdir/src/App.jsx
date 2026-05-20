import { useState, useEffect, useCallback } from 'react';
import './App.css';
// --- DATA GAME ---
const RACES = [
  { id: 'human', name: 'Human', icon: 'fa-user', bonus: 'Balanced', desc: 'Serba bisa dan adaptif', stats: { str: 8, dex: 8, int: 8, wis: 8 } },
  { id: 'elf', name: 'Elf', icon: 'fa-feather-pointed', bonus: '+2 INT, +1 DEX', desc: 'Ahli sihir dan panah', stats: { str: 6, dex: 9, int: 10, wis: 9 } },
  { id: 'dwarf', name: 'Dwarf', icon: 'fa-hammer', bonus: '+3 STR, +2 CON', desc: 'Tangguh dan kuat', stats: { str: 11, dex: 6, int: 6, wis: 9 } },
  { id: 'halfling', name: 'Halfling', icon: 'fa-shoe-prints', bonus: '+2 DEX, +1 LCK', desc: 'Lincah dan beruntung', stats: { str: 6, dex: 10, int: 7, wis: 8 } }
];
const CLASSES = [
  { id: 'warrior', name: 'Warrior', icon: 'fa-shield-halved', bonus: 'Start: Sword & Shield', desc: 'Petarung jarak dekat', primary: 'str' },
  { id: 'rogue', name: 'Rogue', icon: 'fa-mask', bonus: 'Start: Dagger & Cloak', desc: 'Master stealth & speed', primary: 'dex' },
  { id: 'mage', name: 'Mage', icon: 'fa-hat-wizard', bonus: 'Start: Staff & Tome', desc: 'Pengendali elemen', primary: 'int' },
  { id: 'cleric', name: 'Cleric', icon: 'fa-cross', bonus: 'Start: Mace & Amulet', desc: 'Penyembuh suci', primary: 'wis' }
];
const TILE_TYPES = {
  START: { color: '#4ade80', label: 'START', icon: 'fa-flag' },
  NORMAL: { color: '#6b7280', label: '', icon: '' },
  EVENT: { color: '#fbbf24', label: '?', icon: 'fa-scroll' },
  MERCHANT: { color: '#f472b6', label: '$', icon: 'fa-store' },
  PORTAL: { color: '#a78bfa', label: 'P', icon: 'fa-door-open' },
  BOSS: { color: '#ef4444', label: '!', icon: 'fa-dragon' },
  TREASURE: { color: '#fcd34d', label: '$$$', icon: 'fa-chest' },
  REST: { color: '#34d399', label: 'ZZZ', icon: 'fa-bed' },
  TRAP: { color: '#f87171', label: 'X', icon: 'fa-skull' },
  END: { color: '#f59e0b', label: 'GOAL', icon: 'fa-trophy' }
};
// Generate 120 tiles board
const generateBoard = () => {
  const tiles = [];
  for (let i = 0; i < 120; i++) {
    let type = 'NORMAL';
    if (i === 0) type = 'START';
    else if (i === 119) type = 'END';
    else if (i % 20 === 0) type = 'BOSS';
    else if (i % 15 === 0) type = 'MERCHANT';
    else if (i % 12 === 0) type = 'PORTAL';
    else if (i % 10 === 0) type = 'TREASURE';
    else if (i % 8 === 0) type = 'REST';
    else if (i % 7 === 0) type = 'TRAP';
    else if (i % 5 === 0) type = 'EVENT';
    
    tiles.push({ 
      id: i, 
      type, 
      visited: false,
      region: getRegion(i)
    });
  }
  return tiles;
};
const getRegion = (tileId) => {
  if (tileId < 24) return { name: 'Forest', color: '#22c55e' };
  if (tileId < 48) return { name: 'Mountain', color: '#78716c' };
  if (tileId < 72) return { name: 'City', color: '#3b82f6' };
  if (tileId < 96) return { name: 'Dungeon', color: '#7c3aed' };
  return { name: 'Wasteland', color: '#ea580c' };
};
const EVENTS = [
  { id: 1, text: "Kamu menemukan peti tua terkunci. Apa yang kamu lakukan?", choices: [
    { text: "Buka paksa (STR Check DC 12)", effect: (p) => checkSkill(p, 'str', 12, { success: "Berhasil! Dapat 50 Gold", gold: 50 }, { fail: "Gagal! Tangan terluka", hp: -5 }) },
    { text: "Cari kunci (INT Check DC 10)", effect: (p) => checkSkill(p, 'int', 10, { success: "Dapat Potion!", item: "Potion" }, { fail: "Tidak ada kunci", xp: 5 }) },
    { text: "Abaikan", effect: (p) => ({ msg: "Kamu melanjutkan perjalanan", xp: 2 }) }
  ]},
  { id: 2, text: "Seorang pengemis meminta bantuan. Tindakanmu?", choices: [
    { text: "Beri 10 Gold (WIS Check DC 8)", effect: (p) => p.gold >= 10 ? checkSkill(p, 'wis', 8, { success: "Dia memberimu cincin keberuntungan!", item: "Ring of Luck" }, { fail: "Dia kabur dengan goldmu", gold: -10 }) : { msg: "Gold tidak cukup!", gold: 0 } },
    { text: "Usir dia", effect: (p) => ({ msg: "Orang itu pergi dengan marah", vp: -1 }) },
    { text: "Serang!", effect: (p) => combatEncounter(p, 'Bandit', 15, 10, 20) }
  ]},
  { id: 3, text: "Jalan terbagi dua. Mana yang kamu pilih?", choices: [
    { text: "Jalan kiri (lebih pendek tapi berbahaya)", effect: (p) => ({ msg: "Kamu terjebak ranjau!", hp: -10, move: -2 }) },
    { text: "Jalan kanan (aman tapi memutar)", effect: (p) => ({ msg: "Perjalanan aman", move: 2, xp: 10 }) },
    { text: "Coba terbang (jika bisa)", effect: (p) => checkSkill(p, 'int', 15, { success: "Terbang melewati rintangan!", move: 5 }, { fail: "Jatuh sakit", hp: -8 }) }
  ]}
];
// --- UTILITIES ---
const rollDice = (sides = 6) => Math.floor(Math.random() * sides) + 1;
const rollD20 = () => rollDice(20);
const checkSkill = (player, stat, dc, successEffect, failEffect) => {
  const modifier = Math.floor((player.stats[stat] - 10) / 2);
  const roll = rollD20();
  const total = roll + modifier;
  const success = total >= dc;
  const effect = success ? successEffect : failEffect;
  const result = typeof effect === 'function' ? effect(player) : effect;
  return { ...result, roll, total, dc, success, stat };
};
const combatEncounter = (player, enemyName, enemyHP, enemyATK, rewardXP) => {
  const playerATK = Math.floor(player.stats.str / 2) + rollDice(6);
  const damage = Math.max(0, playerATK - 2);
  return {
    msg: `Melawan ${enemyName}! Kamu deal ${damage} damage`,
    hp: -Math.floor(enemyATK / 3),
    xp: rewardXP,
    combat: true
  };
};
// --- COMPONENTS ---
function Modal({ title, children, onClose, showClose = true }) {
  if (!children) return null;
  return (
    <div className="modal-overlay" onClick={showClose ? onClose : undefined}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3><i className={`fa-solid ${title.includes('Event') ? 'fa-scroll' : title.includes('Character') ? 'fa-user' : 'fa-info-circle'}`}></i> {title}</h3>
          {showClose && <button className="close-btn" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>}
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  const icons = { info: 'fa-info-circle', success: 'fa-check-circle', warning: 'fa-exclamation-triangle', danger: 'fa-times-circle' };
  const colors = { info: '#3b82f6', success: '#22c55e', warning: '#f59e0b', danger: '#ef4444' };
  
  return (
    <div className="toast" style={{ borderLeftColor: colors[type] }}>
      <i className={`fa-solid ${icons[type]}`}></i>
      <span>{message}</span>
    </div>
  );
}
// --- MAIN APP ---
function App() {
  const [gameState, setGameState] = useState('start');
  const [player, setPlayer] = useState(null);
  const [selectedRace, setSelectedRace] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [board, setBoard] = useState([]);
  const [currentTile, setCurrentTile] = useState(0);
  const [diceResult, setDiceResult] = useState(null);
  const [actionPoints, setActionPoints] = useState(3);
  const [toasts, setToasts] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [turn, setTurn] = useState(1);
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);
  const startGame = () => {
    if (!selectedRace || !selectedClass) {
      addToast("Pilih Race dan Class dulu!", "warning");
      return;
    }
    
    const raceData = RACES.find(r => r.id === selectedRace);
    const classData = CLASSES.find(c => c.id === selectedClass);
    
    const newPlayer = {
      name: 'Hero',
      race: raceData,
      class: classData,
      stats: { ...raceData.stats },
      hp: 100,
      maxHp: 100,
      gold: 50,
      xp: 0,
      level: 1,
      vp: 0,
      inventory: ['Basic Supplies'],
      abilities: []
    };
    
    if (classData.id === 'warrior') newPlayer.inventory.push('Iron Sword', 'Wooden Shield');
    if (classData.id === 'rogue') newPlayer.inventory.push('Dagger', 'Thief Cloak');
    if (classData.id === 'mage') newPlayer.inventory.push('Magic Staff', 'Spell Tome');
    if (classData.id === 'cleric') newPlayer.inventory.push('Holy Mace', 'Sacred Amulet');
    
    setPlayer(newPlayer);
    setBoard(generateBoard());
    setCurrentTile(0);
    setGameState('playing');
    addToast(`Selamat datang, ${raceData.name} ${classData.name}!`, 'success');
  };
  const handleRoll = () => {
    if (isRolling || actionPoints <= 0) return;
    
    setIsRolling(true);
    const d1 = rollDice();
    const d2 = rollDice();
    const total = d1 + d2;
    
    setTimeout(() => {
      setDiceResult({ d1, d2, total });
      movePlayer(total);
      setActionPoints(prev => prev - 1);
      setIsRolling(false);
    }, 800);
  };
  const movePlayer = (steps) => {
    let newPos = currentTile + steps;
    if (newPos >= 119) {
      newPos = 119;
      setGameState('gameOver');
      addToast("SELAMAT! Kamu mencapai tujuan!", 'success');
    }
    
    setCurrentTile(newPos);
    const tile = board[newPos];
    
    setTimeout(() => handleTileEffect(tile), 500);
  };
  const handleTileEffect = (tile) => {
    switch(tile.type) {
      case 'EVENT':
        const randomEvent = EVENTS[Math.floor(Math.random() * EVENTS.length)];
        setCurrentEvent(randomEvent);
        setGameState('event');
        break;
      case 'MERCHANT':
        addToast("Merchant: Beli item atau istirahat?", 'info');
        break;
      case 'TREASURE':
        const goldFound = rollDice(6) * 10;
        setPlayer(prev => ({ ...prev, gold: prev.gold + goldFound }));
        addToast(`Dapat ${goldFound} Gold!`, 'success');
        break;
      case 'TRAP':
        const damage = rollDice(8);
        setPlayer(prev => ({ ...prev, hp: prev.hp - damage }));
        addToast(`Terjebak! -${damage} HP`, 'danger');
        break;
      case 'REST':
        const heal = rollDice(6) + 5;
        setPlayer(prev => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + heal) }));
        addToast(`Istirahat: +${heal} HP`, 'success');
        break;
      case 'BOSS':
        addToast("BOSS APPEAR! Siapkan diri!", 'danger');
        break;
      case 'PORTAL':
        const jump = rollDice(6) * 5;
        const dest = Math.min(119, currentTile + jump);
        setCurrentTile(dest);
        addToast(`Portal! Maju ${jump} tiles!`, 'success');
        break;
      default:
        break;
    }
  };
  const handleEventChoice = (choice) => {
    const result = choice.effect(player);
    
    let updates = {};
    if (result.msg) addToast(result.msg, result.success !== false ? 'success' : 'info');
    if (result.gold) updates.gold = (player.gold || 0) + result.gold;
    if (result.hp) updates.hp = Math.max(1, (player.hp || 100) + result.hp);
    if (result.xp) updates.xp = (player.xp || 0) + result.xp;
    if (result.vp) updates.vp = (player.vp || 0) + result.vp;
    if (result.item) updates.inventory = [...player.inventory, result.item];
    
    if (Object.keys(updates).length > 0) {
      setPlayer(prev => ({ ...prev, ...updates }));
    }
    
    setCurrentEvent(null);
    setGameState('playing');
  };
  const handleEndTurn = () => {
    setActionPoints(3);
    setTurn(prev => prev + 1);
    setDiceResult(null);
    addToast(`Turn ${turn + 1} dimulai!`, 'info');
  };
  const renderStartScreen = () => (
    <div className="screen start-screen">
      <div className="title-container">
        <h1 className="game-title"><i className="fa-solid fa-dice-d20"></i> JALUR TAKDIR</h1>
        <p className="subtitle">Epic Board Game Adventure</p>
      </div>
      <button className="btn-primary pulse" onClick={() => setGameState('charCreate')}>
        <i className="fa-solid fa-play"></i> MULAI PETUALANGAN
      </button>
      <div className="features">
        <div className="feature"><i className="fa-solid fa-users"></i> 4 Races Unique</div>
        <div className="feature"><i className="fa-solid fa-chess-classes"></i> 4 Classes Specialized</div>
        <div className="feature"><i className="fa-solid fa-map"></i> 120 Tiles Adventure</div>
        <div className="feature"><i className="fa-solid fa-dragon"></i> Epic Boss Battles</div>
      </div>
    </div>
  );
  const renderCharCreation = () => (
    <div className="screen char-creation">
      <h2><i className="fa-solid fa-user-plus"></i> Buat Karakter</h2>
      
      <div className="selection-section">
        <h3><i className="fa-solid fa-people-group"></i> Pilih Race</h3>
        <div className="cards-grid">
          {RACES.map(race => (
            <div 
              key={race.id} 
              className={`card race-card ${selectedRace === race.id ? 'selected' : ''}`}
              onClick={() => setSelectedRace(race.id)}
            >
              <i className={`fa-solid ${race.icon} card-icon`}></i>
              <h4>{race.name}</h4>
              <p className="bonus">{race.bonus}</p>
              <p className="desc">{race.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="selection-section">
        <h3><i className="fa-solid fa-hat-wizard"></i> Pilih Class</h3>
        <div className="cards-grid">
          {CLASSES.map(cls => (
            <div 
              key={cls.id} 
              className={`card class-card ${selectedClass === cls.id ? 'selected' : ''}`}
              onClick={() => setSelectedClass(cls.id)}
            >
              <i className={`fa-solid ${cls.icon} card-icon`}></i>
              <h4>{cls.name}</h4>
              <p className="bonus">{cls.bonus}</p>
              <p className="desc">{cls.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="actions">
        <button className="btn-secondary" onClick={() => setGameState('start')}>
          <i className="fa-solid fa-arrow-left"></i> Kembali
        </button>
        <button className="btn-primary" onClick={startGame}>
          <i className="fa-solid fa-check"></i> Mulai Petualangan
        </button>
      </div>
    </div>
  );
  const renderGameBoard = () => {
    const tileSize = 30;
    const cols = 10;
    const rows = 12;
    
    return (
      <div className="game-container">
        <div className="top-bar">
          <div className="player-info">
            <div className="avatar">
              <i className={`fa-solid ${player.race.icon}`}></i>
            </div>
            <div className="stats-mini">
              <span>Lvl {player.level}</span>
              <span className="hp-bar"><i className="fa-solid fa-heart"></i> {player.hp}/{player.maxHp}</span>
              <span><i className="fa-solid fa-coins"></i> {player.gold}</span>
              <span><i className="fa-solid fa-star"></i> VP: {player.vp}</span>
            </div>
          </div>
          <div className="turn-info">
            <span>Turn {turn}</span>
            <span className="ap-counter">
              AP: {[...Array(3)].map((_, i) => (
                <i key={i} className={`fa-solid fa-bolt ${i < actionPoints ? 'active' : ''}`}></i>
              ))}
            </span>
          </div>
        </div>
        
        <div className="board-wrapper">
          <div 
            className="game-board" 
            style={{ 
              gridTemplateColumns: `repeat(${cols}, ${tileSize}px)`,
              gridTemplateRows: `repeat(${rows}, ${tileSize}px)`
            }}
          >
            {board.map((tile, idx) => {
              const tileData = TILE_TYPES[tile.type];
              const isCurrent = idx === currentTile;
              const region = tile.region;
              
              return (
                <div 
                  key={idx}
                  className={`tile ${tile.type.toLowerCase()} ${isCurrent ? 'current' : ''}`}
                  style={{ 
                    backgroundColor: tileData.color,
                    border: `2px solid ${region.color}`,
                    width: tileSize,
                    height: tileSize
                  }}
                >
                  {tileData.icon && <i className={`fa-solid ${tileData.icon}`}></i>}
                  {tileData.label && <span className="tile-label">{tileData.label}</span>}
                  {isCurrent && (
                    <div className="player-marker">
                      <i className={`fa-solid ${player.class.icon}`}></i>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="controls">
          <div className="dice-display">
            {diceResult && (
              <div className="dice-result">
                <div className="die"><i className="fa-solid fa-dice-one"></i> {diceResult.d1}</div>
                <div className="die"><i className="fa-solid fa-dice-one"></i> {diceResult.d2}</div>
                <div className="total">Total: {diceResult.total}</div>
              </div>
            )}
          </div>
          
          <div className="buttons">
            <button 
              className="btn-primary btn-roll" 
              onClick={handleRoll}
              disabled={isRolling || actionPoints <= 0 || gameState !== 'playing'}
            >
              <i className={`fa-solid ${isRolling ? 'fa-spinner fa-spin' : 'fa-dice'}`}></i> 
              {isRolling ? 'Rolling...' : `ROLL (${actionPoints} AP)`}
            </button>
            
            <button 
              className="btn-secondary" 
              onClick={handleEndTurn}
              disabled={gameState !== 'playing'}
            >
              <i className="fa-solid fa-hourglass-half"></i> END TURN
            </button>
            
            <button 
              className="btn-info" 
              onClick={() => addToast(`Posisi: ${currentTile}/119 | Region: ${board[currentTile]?.region.name}`, 'info')}
            >
              <i className="fa-solid fa-circle-info"></i>
            </button>
          </div>
        </div>
        
        <div className="status-panel">
          <h4><i className="fa-solid fa-sheet-plastic"></i> Character Sheet</h4>
          <div className="stats-grid">
            <div className="stat"><span>STR:</span> <strong>{player.stats.str}</strong></div>
            <div className="stat"><span>DEX:</span> <strong>{player.stats.dex}</strong></div>
            <div className="stat"><span>INT:</span> <strong>{player.stats.int}</strong></div>
            <div className="stat"><span>WIS:</span> <strong>{player.stats.wis}</strong></div>
          </div>
          <div className="inventory">
            <h5><i className="fa-solid fa-backpack"></i> Inventory</h5>
            <div className="items">
              {player.inventory.map((item, i) => (
                <span key={i} className="item-tag">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  const renderEventModal = () => {
    if (!currentEvent) return null;
    
    return (
      <Modal title="Event!" onClose={() => setCurrentEvent(null)}>
        <div className="event-content">
          <p className="event-text">{currentEvent.text}</p>
          <div className="choices">
            {currentEvent.choices.map((choice, idx) => (
              <button 
                key={idx} 
                className="btn-choice"
                onClick={() => handleEventChoice(choice)}
              >
                <i className="fa-solid fa-arrow-right"></i> {choice.text}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    );
  };
  const renderGameOver = () => (
    <Modal title="Game Over" showClose={false}>
      <div className="game-over-content">
        <i className="fa-solid fa-trophy trophy-icon"></i>
        <h2>Congratulations!</h2>
        <p>Kamu telah menyelesaikan petualangan!</p>
        <div className="final-stats">
          <div className="stat-row"><span>Turns:</span> <strong>{turn}</strong></div>
          <div className="stat-row"><span>VP:</span> <strong>{player.vp}</strong></div>
          <div className="stat-row"><span>Level:</span> <strong>{player.level}</strong></div>
          <div className="stat-row"><span>Gold:</span> <strong>{player.gold}</strong></div>
        </div>
        <button className="btn-primary" onClick={() => window.location.reload()}>
          <i className="fa-solid fa-rotate-right"></i> Main Lagi
        </button>
      </div>
    </Modal>
  );
  return (
    <div className="app">
      <div className="scanlines"></div>
      
      {gameState === 'start' && renderStartScreen()}
      {gameState === 'charCreate' && renderCharCreation()}
      {(gameState === 'playing' || gameState === 'event' || gameState === 'gameOver') && renderGameBoard()}
      
      {gameState === 'event' && renderEventModal()}
      {gameState === 'gameOver' && renderGameOver()}
      
      <div className="toasts-container">
        {toasts.map(toast => (
          <Toast 
            key={toast.id} 
            message={toast.message} 
            type={toast.type} 
            onClose={() => removeToast(toast.id)} 
          />
        ))}
      </div>
    </div>
  );
}
export default App;