// Jalur Takdir - Game Logic

// Game State
const gameState = {
    currentScreen: 'start',
    players: [],
    currentPlayerIndex: 0,
    turn: 1,
    board: [],
    eventDecks: {},
    selectedRace: null,
    selectedClass: null,
    characterName: '',
    diceRolled: false,
    diceValue: 0,
    apUsed: 0
};

// Constants
const BOARD_SIZE = 120;
const TILE_TYPES = {
    START: 'start',
    EMPTY: 'empty',
    EVENT: 'event',
    MERCHANT: 'merchant',
    REST: 'rest',
    PORTAL: 'portal',
    BOSS: 'boss',
    FORK: 'fork',
    END: 'end'
};

const RACES = {
    human: { name: 'Human', icon: '🧑', stats: { str: 3, agi: 3, wis: 3, mst: 3 }, hp: 20, ability: 'Adaptif - Bonus VP di semua region' },
    elf: { name: 'Elf', icon: '🧝', stats: { str: 2, agi: 4, wis: 3, mst: 5 }, hp: 18, ability: '+2 Mistik, +1 Ketangkasan' },
    dwarf: { name: 'Dwarf', icon: '🧔', stats: { str: 5, agi: 2, wis: 4, mst: 2 }, hp: 24, ability: '+2 Kekuatan, +2 HP' },
    halfling: { name: 'Halfling', icon: '🧒', stats: { str: 2, agi: 5, wis: 4, mst: 3 }, hp: 18, ability: '+2 Ketangkasan, +1 Kebijaksanaan' }
};

const CLASSES = {
    warrior: { name: 'Warrior', icon: '⚔️', stats: { str: 5, agi: 2, wis: 2, mst: 2 }, hp: 25, gold: 10, items: ['Health Potion', 'Iron Sword'] },
    rogue: { name: 'Rogue', icon: '🗡️', stats: { str: 2, agi: 5, wis: 3, mst: 2 }, hp: 18, gold: 15, items: ['Health Potion', 'Lockpick'] },
    mage: { name: 'Mage', icon: '🔮', stats: { str: 1, agi: 2, wis: 4, mst: 6 }, hp: 15, gold: 12, items: ['Health Potion', 'Magic Scroll'] },
    cleric: { name: 'Cleric', icon: '✨', stats: { str: 2, agi: 2, wis: 5, mst: 4 }, hp: 20, gold: 10, items: ['Health Potion', 'Holy Symbol'] }
};

// Event Cards Database (Sample -可扩展到 200+)
const EVENT_CARDS = {
    forest: [
        {
            title: '🐺 Serigala Terluka',
            description: 'Seekor serigala terluka menghalangi jalanmu. Darahnya menggenang di tanah hutan.',
            choices: [
                { text: 'Sembuhkan dengan skill Healing', skill: 'mst', dc: 12, success: 'Serigala menjadi ally-mu! +2 VP, dapat companion Serigala', fail: 'Gagal menyembuhkan, serigala menggigitmu! -3 HP', vp: 2, hp: 0 },
                { text: 'Usir dengan Intimidasi', skill: 'str', dc: 10, success: 'Serigala lari ketakutan. +1 VP', fail: 'Serigala menyerang! -5 HP', vp: 1, hp: -5 },
                { text: 'Hindari dengan Stealth', skill: 'agi', dc: 11, success: 'Berhasil lewat tanpa ketahuan. +1 VP', fail: 'Terdeteksi! Serigala mengejar. -2 HP', vp: 1, hp: -2 }
            ]
        },
        {
            title: '🌲 Pohon Ancient',
            description: 'Pohon raksasa berusia ribuan tahun berbisik kepadamu dalam bahasa kuno.',
            choices: [
                { text: 'Dengarkan dengan seksama', skill: 'wis', dc: 10, success: 'Pohon memberimu pengetahuan kuno! +2 MST permanen, +3 VP', fail: 'Tidak mengerti apa-apa. -1 VP', vp: 3, mst: 2 },
                { text: 'Potong cabang untuk kayu', skill: 'str', dc: 12, success: 'Dapat Wood of Power! Item langka', fail: 'Pohon marah! Kutukan -2 HP per giliran selama 3 giliran', vp: 0, hp: -6 },
                { text: 'Lanjutkan perjalanan', skill: null, dc: null, success: 'Memilih tidak berinteraksi', fail: null, vp: 0, hp: 0 }
            ]
        }
    ],
    mountain: [
        {
            title: '🏔️ Longsor!',
            description: 'Batu-batu besar mulai jatuh dari atas tebing!',
            choices: [
                { text: 'Cari perlindungan', skill: 'wis', dc: 10, success: 'Menemukan gua kecil. Selamat! +1 VP', fail: 'Terkena batu! -4 HP', vp: 1, hp: -4 },
                { text: 'Lari cepat!', skill: 'agi', dc: 13, success: 'Berhasil lolos! +2 VP', fail: 'Terlambat! -6 HP', vp: 2, hp: -6 },
                { text: 'Tahan dengan kekuatan', skill: 'str', dc: 15, success: 'Menghancurkan batu yang jatuh! +3 VP, +1 STR', fail: 'Tertimbun! -8 HP', vp: 3, str: 1, hp: -8 }
            ]
        }
    ],
    city: [
        {
            title: '🏪 Merchant Asing',
            description: 'Seorang merchant dari negeri jauh menawarkan barang langka.',
            choices: [
                { text: 'Beli Health Potion (5 Gold)', skill: null, dc: null, cost: 5, effect: 'health_potion', vp: 0 },
                { text: 'Beli Magic Scroll (8 Gold)', skill: null, dc: null, cost: 8, effect: 'magic_scroll', vp: 1 },
                { text: 'Tawar harga', skill: 'wis', dc: 12, success: 'Diskon 50%! Beli item lebih murah', fail: 'Merchant marah, pergi!', vp: 0 },
                { text: 'Abaikan', skill: null, dc: null, success: 'Melanjutkan perjalanan', fail: null, vp: 0 }
            ]
        }
    ],
    dungeon: [
        {
            title: '💀 Jebakan!',
            description: 'Klik! Kamu menginjak pelat tekanan...',
            choices: [
                { text: 'Loncat mundur!', skill: 'agi', dc: 14, success: 'Berhasil menghindari! +2 VP', fail: 'Terjebak! -5 HP', vp: 2, hp: -5 },
                { text: 'Tahan dengan perisai', skill: 'str', dc: 13, success: 'Perisai menahan damage! +1 VP', fail: 'Perisai hancur! -7 HP', vp: 1, hp: -7 },
                { text: 'Deteksi sihir', skill: 'mst', dc: 11, success: 'Menonaktifkan jebakan! +3 VP', fail: 'Sihir memantul! -3 HP', vp: 3, hp: -3 }
            ]
        }
    ],
    generic: [
        {
            title: '🎲 Keberuntungan',
            description: 'Kamu menemukan kantong emas tersembunyi!',
            choices: [
                { text: 'Ambil semua', skill: null, dc: null, gold: 10, vp: 1 },
                { text: 'Ambil setengah, sisakan untuk yang lain', skill: null, dc: null, gold: 5, vp: 3 },
                { text: 'Biarkan saja', skill: null, dc: null, gold: 0, vp: 2 }
            ]
        },
        {
            title: '🧙‍♂️ Penyihir Misterius',
            description: 'Seorang penyihir tua menawarkan untuk meningkatkan statismu.',
            choices: [
                { text: 'Terima peningkatan STR', skill: null, dc: null, str: 1, vp: 1 },
                { text: 'Terima peningkatan AGI', skill: null, dc: null, agi: 1, vp: 1 },
                { text: 'Terima peningkatan WIS', skill: null, dc: null, wis: 1, vp: 1 },
                { text: 'Terima peningkatan MST', skill: null, dc: null, mst: 1, vp: 1 },
                { text: 'Tolak dengan sopan', skill: null, dc: null, vp: 0 }
            ]
        }
    ]
};

// Initialize Game
function initGame() {
    setupEventListeners();
    generateBoard();
    shuffleEventDecks();
}

// Setup Event Listeners
function setupEventListeners() {
    // Start Screen
    document.getElementById('btn-start-game').addEventListener('click', () => {
        showScreen('character');
    });

    // Character Creation
    document.querySelectorAll('.race-option').forEach(option => {
        option.addEventListener('click', () => selectRace(option.dataset.race));
    });

    document.querySelectorAll('.class-option').forEach(option => {
        option.addEventListener('click', () => selectClass(option.dataset.class));
    });

    document.getElementById('btn-confirm-char').addEventListener('click', createCharacter);

    // Game Actions
    document.getElementById('btn-roll-dice').addEventListener('click', rollDice);
    document.getElementById('btn-move').addEventListener('click', movePlayer);
    document.getElementById('btn-end-turn').addEventListener('click', endTurn);
    document.getElementById('btn-use-ap-plus').addEventListener('click', () => modifyAP(1));
    document.getElementById('btn-use-ap-minus').addEventListener('click', () => modifyAP(-1));

    // Game Over
    document.getElementById('btn-play-again').addEventListener('click', resetGame);
}

// Screen Management
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById(`${screenName}-screen`).classList.add('active');
    gameState.currentScreen = screenName;
}

// Character Creation
function selectRace(race) {
    gameState.selectedRace = race;
    document.querySelectorAll('.race-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelector(`[data-race="${race}"]`).classList.add('selected');
    checkCharacterReady();
}

function selectClass(classType) {
    gameState.selectedClass = classType;
    document.querySelectorAll('.class-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelector(`[data-class="${classType}"]`).classList.add('selected');
    checkCharacterReady();
}

function checkCharacterReady() {
    const btn = document.getElementById('btn-confirm-char');
    btn.disabled = !(gameState.selectedRace && gameState.selectedClass && document.getElementById('char-name').value.trim());
}

document.getElementById('char-name').addEventListener('input', checkCharacterReady);

function createCharacter() {
    const race = RACES[gameState.selectedRace];
    const charClass = CLASSES[gameState.selectedClass];
    
    const player = {
        name: document.getElementById('char-name').value.trim(),
        race: gameState.selectedRace,
        class: gameState.selectedClass,
        position: 0,
        hp: race.hp + charClass.hp - 20, // Base 20
        maxHp: race.hp + charClass.hp - 20,
        gold: charClass.gold,
        vp: 0,
        stats: {
            str: race.stats.str + charClass.stats.str - 3,
            agi: race.stats.agi + charClass.stats.agi - 3,
            wis: race.stats.wis + charClass.stats.wis - 3,
            mst: race.stats.mst + charClass.stats.mst - 3
        },
        ap: 2,
        items: [...charClass.items],
        completedQuests: []
    };

    gameState.players = [player];
    gameState.currentPlayerIndex = 0;
    
    renderBoard();
    updatePlayerStats();
    showScreen('game');
}

// Board Generation
function generateBoard() {
    gameState.board = [];
    
    for (let i = 0; i < BOARD_SIZE; i++) {
        let type = TILE_TYPES.EMPTY;
        const rand = Math.random();
        
        if (i === 0) {
            type = TILE_TYPES.START;
        } else if (i === BOARD_SIZE - 1) {
            type = TILE_TYPES.END;
        } else if (rand < 0.05) {
            type = TILE_TYPES.BOSS;
        } else if (rand < 0.12) {
            type = TILE_TYPES.PORTAL;
        } else if (rand < 0.20) {
            type = TILE_TYPES.FORK;
        } else if (rand < 0.35) {
            type = TILE_TYPES.EVENT;
        } else if (rand < 0.42) {
            type = TILE_TYPES.MERCHANT;
        } else if (rand < 0.50) {
            type = TILE_TYPES.REST;
        }
        
        gameState.board.push({
            index: i,
            type: type,
            region: getRegion(i),
            visited: false
        });
    }
}

function getRegion(tileIndex) {
    if (tileIndex < 20) return 'starting';
    if (tileIndex < 40) return 'forest';
    if (tileIndex < 60) return 'mountain';
    if (tileIndex < 80) return 'city';
    if (tileIndex < 100) return 'dungeon';
    return 'final';
}

function shuffleEventDecks() {
    Object.keys(EVENT_CARDS).forEach(region => {
        gameState.eventDecks[region] = [...EVENT_CARDS[region]];
        // Fisher-Yates shuffle
        for (let i = gameState.eventDecks[region].length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [gameState.eventDecks[region][i], gameState.eventDecks[region][j]] = 
            [gameState.eventDecks[region][j], gameState.eventDecks[region][i]];
        }
    });
}

// Render Board
function renderBoard() {
    const boardEl = document.getElementById('game-board');
    boardEl.innerHTML = '';
    
    gameState.board.forEach((tile, index) => {
        const tileEl = document.createElement('div');
        tileEl.className = `tile ${tile.type}`;
        tileEl.textContent = getTileIcon(tile.type);
        tileEl.dataset.index = index;
        
        // Add player marker
        gameState.players.forEach((player, pIndex) => {
            if (player.position === index) {
                const marker = document.createElement('div');
                marker.className = 'tile player-marker';
                marker.textContent = pIndex + 1;
                tileEl.appendChild(marker);
            }
        });
        
        boardEl.appendChild(tileEl);
    });
    
    scrollToCurrentPlayer();
}

function getTileIcon(type) {
    const icons = {
        start: '🏁',
        empty: '',
        event: '❓',
        merchant: '💰',
        rest: '💤',
        portal: '🌀',
        boss: '👹',
        fork: '🔀',
        end: '👑'
    };
    return icons[type] || '';
}

function scrollToCurrentPlayer() {
    const player = gameState.players[gameState.currentPlayerIndex];
    const tileEl = document.querySelector(`[data-index="${player.position}"]`);
    if (tileEl) {
        tileEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Dice Rolling
function rollDice() {
    if (gameState.diceRolled) return;
    
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    gameState.diceValue = die1 + die2;
    
    // Animate dice
    const diceDisplay = document.getElementById('dice-display');
    diceDisplay.innerHTML = `<span class="die">🎲</span><span class="die">🎲</span>`;
    
    setTimeout(() => {
        const dieIcons = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        diceDisplay.innerHTML = `<span class="die">${dieIcons[die1-1]}</span><span class="die">${dieIcons[die2-1]}</span>`;
        
        // Check for critical roll (doubles)
        if (die1 === die2) {
            showMessage(`🎯 Critical Roll! Angka ganda ${die1}!`, 'success');
        }
        
        gameState.diceRolled = true;
        updateMoveDisplay();
        document.getElementById('btn-move').disabled = false;
    }, 500);
}

function modifyAP(change) {
    const player = getCurrentPlayer();
    if (change > 0 && player.ap > 0) {
        player.ap--;
        gameState.apUsed++;
    } else if (change < 0 && gameState.apUsed > 0) {
        player.ap++;
        gameState.apUsed--;
    }
    updateAPDisplay();
    updateMoveDisplay();
}

function updateAPDisplay() {
    const player = getCurrentPlayer();
    document.getElementById('ap-display').textContent = `${player.ap} (+${gameState.apUsed})`;
}

function updateMoveDisplay() {
    const totalMove = gameState.diceValue + gameState.apUsed;
    document.getElementById('move-display').textContent = `Langkah: ${totalMove}`;
}

// Movement
function movePlayer() {
    if (!gameState.diceRolled) return;
    
    const player = getCurrentPlayer();
    const moveAmount = gameState.diceValue + gameState.apUsed;
    const newPosition = Math.min(player.position + moveAmount, BOARD_SIZE - 1);
    
    player.position = newPosition;
    
    // Animate movement
    animateMovement(player, newPosition);
}

function animateMovement(player, targetPosition) {
    const startPos = player.position;
    let currentPos = startPos;
    const interval = setInterval(() => {
        if (currentPos >= targetPosition) {
            clearInterval(interval);
            renderBoard();
            handleTileEvent();
            return;
        }
        currentPos++;
        player.position = currentPos;
        renderBoard();
    }, 100);
}

// Tile Events
function handleTileEvent() {
    const player = getCurrentPlayer();
    const tile = gameState.board[player.position];
    
    setTimeout(() => {
        switch (tile.type) {
            case TILE_TYPES.EVENT:
                triggerEvent(tile.region);
                break;
            case TILE_TYPES.REST:
                restTile();
                break;
            case TILE_TYPES.MERCHANT:
                merchantTile();
                break;
            case TILE_TYPES.PORTAL:
                portalTile();
                break;
            case TILE_TYPES.BOSS:
                bossTile();
                break;
            case TILE_TYPES.END:
                endGame();
                break;
            default:
                // Empty or other tiles, just continue
                break;
        }
    }, 500);
}

function triggerEvent(region) {
    const deck = gameState.eventDecks[region] || gameState.eventDecks.generic;
    if (deck.length === 0) {
        // Reshuffle generic deck
        if (region !== 'generic') {
            triggerEvent('generic');
            return;
        }
        showMessage('Tidak ada event tersisa di region ini', 'info');
        return;
    }
    
    const event = deck.pop();
    showEventModal(event);
}

function showEventModal(event) {
    const modal = document.getElementById('event-modal');
    document.getElementById('event-title').textContent = event.title;
    document.getElementById('event-description').textContent = event.description;
    
    const choicesContainer = document.getElementById('event-choices');
    choicesContainer.innerHTML = '';
    
    event.choices.forEach((choice, index) => {
        const choiceEl = document.createElement('div');
        choiceEl.className = 'event-choice';
        
        let html = `<strong>${index + 1}. ${choice.text}</strong>`;
        if (choice.skill) {
            html += `<div class="skill-check">Skill Check: ${choice.skill.toUpperCase()} DC ${choice.dc}</div>`;
        }
        if (choice.cost) {
            html += `<div class="skill-check">Cost: ${choice.cost} Gold</div>`;
        }
        
        choiceEl.innerHTML = html;
        choiceEl.addEventListener('click', () => resolveEventChoice(choice));
        choicesContainer.appendChild(choiceEl);
    });
    
    modal.classList.add('active');
}

function resolveEventChoice(choice) {
    const player = getCurrentPlayer();
    let success = true;
    
    // Skill check if required
    if (choice.skill) {
        const roll = Math.floor(Math.random() * 20) + 1;
        const statValue = player.stats[choice.skill];
        const total = roll + statValue;
        success = total >= choice.dc;
        
        showMessage(`Skill Check ${choice.skill.toUpperCase()}: Roll ${roll} + ${statValue} = ${total} vs DC ${choice.dc} - ${success ? 'SUCCESS!' : 'FAILED'}`, success ? 'success' : 'error');
    }
    
    // Apply effects
    if (success && choice.success) {
        showMessage(choice.success, 'success');
    } else if (!success && choice.fail) {
        showMessage(choice.fail, 'error');
    }
    
    if (choice.vp) player.vp += choice.vp;
    if (choice.hp) player.hp = Math.max(0, player.hp + choice.hp);
    if (choice.gold) player.gold += choice.gold;
    if (choice.str) player.stats.str += choice.str;
    if (choice.agi) player.stats.agi += choice.agi;
    if (choice.wis) player.stats.wis += choice.wis;
    if (choice.mst) player.stats.mst += choice.mst;
    
    // Handle purchases
    if (choice.cost && player.gold >= choice.cost) {
        player.gold -= choice.cost;
        if (choice.effect === 'health_potion') {
            player.items.push('Health Potion');
        } else if (choice.effect === 'magic_scroll') {
            player.items.push('Magic Scroll');
            player.vp += 1;
        }
    }
    
    document.getElementById('event-modal').classList.remove('active');
    updatePlayerStats();
    
    // Check for game over (HP = 0)
    if (player.hp <= 0) {
        endGame();
    }
}

function restTile() {
    const player = getCurrentPlayer();
    const healAmount = 5;
    player.hp = Math.min(player.maxHp, player.hp + healAmount);
    player.ap = 2;
    showMessage(`💤 Beristirahat... HP +${healAmount}, AP dipulihkan`, 'success');
    updatePlayerStats();
}

function merchantTile() {
    showMessage('🏪 Merchant: "Selamat datang! Silakan beli barang atau istirahat."', 'info');
    // Could add merchant interaction here
}

function portalTile() {
    const player = getCurrentPlayer();
    const direction = Math.random() > 0.5 ? 'forward' : 'backward';
    const distance = Math.floor(Math.random() * 10) + 5;
    
    if (direction === 'forward') {
        player.position = Math.min(player.position + distance, BOARD_SIZE - 1);
        showMessage(`🌀 Portal Takdir! Terlempar ${distance} tile ke depan!`, 'success');
    } else {
        player.position = Math.max(player.position - distance, 0);
        showMessage(`🌀 Portal Takdir! Terlempar ${distance} tile ke belakang!`, 'error');
    }
    
    renderBoard();
    updatePlayerStats();
}

function bossTile() {
    const player = getCurrentPlayer();
    const bossDC = 15;
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + player.stats.str;
    
    if (total >= bossDC) {
        const vpReward = 10;
        player.vp += vpReward;
        showMessage(`👹 Boss defeated! Roll: ${roll} + STR: ${player.stats.str} = ${total} vs DC ${bossDC}. Menang! +${vpReward} VP`, 'success');
    } else {
        const damage = 10;
        player.hp = Math.max(0, player.hp - damage);
        showMessage(`👹 Boss fight! Roll: ${roll} + STR: ${player.stats.str} = ${total} vs DC ${bossDC}. Kalah! -${damage} HP`, 'error');
    }
    
    updatePlayerStats();
    
    if (player.hp <= 0) {
        endGame();
    }
}

// Turn Management
function endTurn() {
    const player = getCurrentPlayer();
    
    // Reset turn state
    player.ap = 2;
    gameState.diceRolled = false;
    gameState.apUsed = 0;
    gameState.diceValue = 0;
    
    // Update UI
    document.getElementById('dice-display').innerHTML = '<span class="die">🎲</span><span class="die">🎲</span>';
    document.getElementById('move-display').textContent = 'Langkah: 0';
    document.getElementById('btn-move').disabled = true;
    updateAPDisplay();
    
    // Next player or next turn
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    if (gameState.currentPlayerIndex === 0) {
        gameState.turn++;
    }
    
    document.getElementById('turn-display').textContent = `Giliran ${gameState.turn}`;
    document.getElementById('player-display').textContent = getCurrentPlayer().name;
    
    renderBoard();
}

function getCurrentPlayer() {
    return gameState.players[gameState.currentPlayerIndex];
}

function updatePlayerStats() {
    const player = getCurrentPlayer();
    document.getElementById('hp-display').textContent = `${player.hp}/${player.maxHp}`;
    document.getElementById('gold-display').textContent = player.gold;
    document.getElementById('vp-display').textContent = player.vp;
    document.getElementById('str-display').textContent = player.stats.str;
    document.getElementById('agi-display').textContent = player.stats.agi;
    document.getElementById('wis-display').textContent = player.stats.wis;
    document.getElementById('mst-display').textContent = player.stats.mst;
    updateAPDisplay();
}

// Game End
function endGame() {
    const player = getCurrentPlayer();
    showScreen('game-over');
    
    const statsEl = document.getElementById('game-over-stats');
    let ending = '';
    
    if (player.hp <= 0) {
        ending = '☠️ Karakter gugur dalam petualangan...';
    } else if (player.position >= BOARD_SIZE - 1) {
        ending = '👑 Mencapai akhir perjalanan! Legendamu akan dikenang!';
    } else {
        ending = '🏁 Petualangan berakhir.';
    }
    
    statsEl.innerHTML = `
        <div class="game-over-stat"><span>Nama:</span><span>${player.name}</span></div>
        <div class="game-over-stat"><span>Race:</span><span>${RACES[player.race].name}</span></div>
        <div class="game-over-stat"><span>Class:</span><span>${CLASSES[player.class].name}</span></div>
        <div class="game-over-stat"><span>Victory Points:</span><span>${player.vp}</span></div>
        <div class="game-over-stat"><span>Gold:</span><span>${player.gold}</span></div>
        <div class="game-over-stat"><span>Tile Reached:</span><span>${player.position + 1}/${BOARD_SIZE}</span></div>
        <div class="game-over-stat" style="margin-top: 20px; font-size: 1.5rem; color: #f39c12;"><span>${ending}</span></div>
    `;
}

function resetGame() {
    gameState.players = [];
    gameState.currentPlayerIndex = 0;
    gameState.turn = 1;
    gameState.selectedRace = null;
    gameState.selectedClass = null;
    gameState.characterName = '';
    gameState.diceRolled = false;
    gameState.diceValue = 0;
    gameState.apUsed = 0;
    
    document.getElementById('char-name').value = '';
    document.querySelectorAll('.race-option, .class-option').forEach(opt => opt.classList.remove('selected'));
    document.getElementById('btn-confirm-char').disabled = true;
    
    generateBoard();
    shuffleEventDecks();
    
    showScreen('start');
}

// Utility Functions
function showMessage(text, type = 'info') {
    // Create toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 8px;
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    toast.textContent = text;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize on load
window.addEventListener('DOMContentLoaded', initGame);
