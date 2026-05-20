# 🎲 Jalur Takdir - Web Game

**Perjalanan Epik di Dunia Aethoria**

Jalur Takdir adalah board game bertema fantasi RPG yang menggabungkan mekanik pergerakan klasik ala Ular Tangga dengan kedalaman naratif dan sistem pilihan dari Tabletop Role-Playing Game (TTRPG).

## 🎮 Fitur Game

### Karakter & Customization
- **4 Race Pilihan**: Human, Elf, Dwarf, Halfling - masing-masing dengan bonus statistik unik
- **4 Starting Class**: Warrior, Rogue, Mage, Cleric - dengan item dan kemampuan awal berbeda
- **Sistem Statistik**: STR (Kekuatan), AGI (Ketangkasan), WIS (Kebijaksanaan), MST (Mistik)

### Gameplay
- **Board 120 Tile**: Dengan berbagai jenis tile (Event, Merchant, Rest, Portal, Boss, Fork)
- **5 Region Dunia Aethoria**: Starting Area, Forest, Mountain, City, Dungeon, Final Region
- **Sistem Dadu 2d6**: Dengan Action Points untuk modifikasi hasil
- **Critical Roll**: Bonus saat mendapat angka ganda
- **Portal Takdir**: Menggantikan konsep ular-tangga dengan narasi yang lebih bermakna

### Event System
- **Event Cards Berbasis Region**: Setiap region memiliki deck event tersendiri
- **Skill Check System**: Roll d20 + stat vs DC untuk menentukan keberhasilan
- **Pilihan Bercabang**: Setiap event menawarkan 2-4 opsi dengan konsekuensi berbeda
- **Victory Points**: Sistem kemenangan alternatif selain mencapai finish

### UI/UX
- **Responsive Design**: Optimal untuk desktop maupun mobile
- **Animasi Smooth**: Dice roll, movement, toast notifications
- **Modal Event**: Interface interaktif untuk memilih aksi dalam event
- **Real-time Stats**: Update HP, Gold, VP, dan statistik secara langsung

## 🚀 Cara Memainkan

### Desktop
1. Buka folder `jalurtakdir-game` 
2. Buka `index.html` di browser modern (Chrome, Firefox, Edge, Safari)
3. Atau jalankan local server: `python -m http.server 8080 --directory jalurtakdir-game`
4. Akses di `http://localhost:8080`

### Mobile
- Upload ke web hosting atau gunakan layanan seperti GitHub Pages, Netlify, Vercel
- Game otomatis responsive untuk layar sentuh

## 🎯 Alur Permainan

1. **Start Screen**: Klik "Mulai Petualangan"
2. **Character Creation**: 
   - Masukkan nama karakter
   - Pilih Race (Human/Elf/Dwarf/Halfling)
   - Pilih Class (Warrior/Rogue/Mage/Cleric)
3. **Gameplay Loop**:
   - **Dawn Phase**: Dapat 2 Action Points
   - **Movement Phase**: Lempar dadu (2d6), gunakan AP jika perlu
   - **Event Phase**: Hadapi event di tile yang dituju
   - **Dusk Phase**: Akhiri giliran
4. **Win Condition**: Capai tile 120 ATAU kumpulkan Victory Points terbanyak

## 📁 Struktur File

```
jalurtakdir-game/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Responsive styling
├── js/
│   └── game.js         # Game logic & mechanics
└── assets/             # (Optional) Images, sounds
```

## 🛠️ Teknologi

- **HTML5**: Semantic structure
- **CSS3**: Flexbox, Grid, Animations, Responsive breakpoints
- **Vanilla JavaScript**: ES6+ features, no dependencies
- **LocalStorage**: (Future) Save game progress

## 📜 Berdasarkan GDD

Game ini dikembangkan sesuai dengan **Jalur_Takdir_Game_Design_Document.docx** yang mencakup:
- Dunia Aethoria dengan 5 region
- Sistem 4 race dan 4 class
- Mekanik dadu + action points
- Portal Takdir (pengganti ular-tangga)
- Event cards dengan skill checks
- Multiple endings dan victory conditions
- Replayability melalui procedural variation

## 🎨 Future Enhancements

- [ ] Multiplayer hot-seat (2-4 players)
- [ ] Save/Load system
- [ ] More event cards (target: 200+)
- [ ] Companion system
- [ ] Prestige class progression
- [ ] Achievement system
- [ ] Sound effects & background music
- [ ] Tutorial mode
- [ ] AI opponents for solo play

---

**Developed as a web-based prototype for playtesting and design iteration.**
