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

            game.setupLevel(mapGrid, speed, monsterDamage);

        
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

})();