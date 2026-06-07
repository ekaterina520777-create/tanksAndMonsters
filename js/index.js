import { Game } from './Game.js';
import { LeaderboardApp } from './LeaderboardApp.js';
import { MapLoaderApp } from './MapLoaderApp.js';

let leaderboardApp;
let game;
let mapLoaderApp;

(function() {

    window.addEventListener('load', init);

    function init() {
        leaderboardApp = new LeaderboardApp();
        game = new Game('gameCanvas', leaderboardApp);
        mapLoaderApp = new MapLoaderApp();

        initFormController();
        initThemeSelector();
        initMobileControls();

        window.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'SELECT') {
                    e.preventDefault();
                }
            }
        });

        game.loop();
        mapLoaderApp.fetchMaps();
    }

    function initFormController() {
        const form = document.getElementById('gameSettingsForm');
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const mapGrid = mapLoaderApp.getSelectedMapGrid();
            const speed = document.getElementById('speedSelect').value;
            const monsterDamage = document.getElementById('difficultySelect').value;
            const lives = document.getElementById('livesSelect').value;

            game.setupLevel(mapGrid, speed, monsterDamage, lives);
        });
    }

    function initThemeSelector() {
        const toggleBtn = document.getElementById('themeToggle');
        
        if (!toggleBtn) return;

        if (localStorage.getItem('theme') === 'light') {
            document.body.classList.add('light-theme');
        }

        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            
            const isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }

    function initMobileControls() {
        const touchButtons = [
            { id: 'p1Up', key: 'ArrowUp' },
            { id: 'p1Down', key: 'ArrowDown' },
            { id: 'p1Left', key: 'ArrowLeft' },
            { id: 'p1Right', key: 'ArrowRight' },
            { id: 'p1Shoot', key: 'Enter' },

            { id: 'p2Up', key: 'KeyW' },
            { id: 'p2Down', key: 'KeyS' },
            { id: 'p2Left', key: 'KeyA' },
            { id: 'p2Right', key: 'KeyD' },
            { id: 'p2Shoot', key: 'Space' }
        ];

        touchButtons.forEach(btn => {
            const element = document.getElementById(btn.id);
            if (element) {
                element.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    game.keys[btn.key] = true;
                });
                element.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    game.keys[btn.key] = false;
                });

                element.addEventListener('mousedown', (e) => {
                    game.keys[btn.key] = true;
                });
                element.addEventListener('mouseup', (e) => {
                    game.keys[btn.key] = false;
                });
                element.addEventListener('mouseleave', (e) => {
                    game.keys[btn.key] = false;
                });
            }
        });

        const pauseBtn = document.getElementById('btnPause');
        if (pauseBtn) {
            pauseBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (game.isRunning) game.togglePause();
            });
            pauseBtn.addEventListener('click', (e) => {
                if (game.isRunning) game.togglePause();
            });
        }
    }

})();