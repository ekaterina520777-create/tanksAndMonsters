export class LeaderboardApp {
    constructor() {
        this.logListElement = document.getElementById('battleLog');
        this.clearBtn = document.getElementById('clearLogBtn');
        this.storageKey = 'tank_battle_history';
        
        this.clearBtn.addEventListener('click', () => this.clearHistory());
        this.loadFromStorage();
    }

    addRecord(text) {
        const timestamp = new Date().toLocaleTimeString();
        const fullText = `[${timestamp}] ${text}`;

        this.renderItem(fullText);

        let history = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        history.unshift(fullText);
        localStorage.setItem(this.storageKey, JSON.stringify(history));
    }

    renderItem(text) {
        const li = document.createElement('li');
        li.textContent = text;
        this.logListElement.insertBefore(li, this.logListElement.firstChild);
    }

    loadFromStorage() {
        let history = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        history.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            this.logListElement.appendChild(li);
        });
    }

    clearHistory() {
        while (this.logListElement.firstChild) {
            this.logListElement.removeChild(this.logListElement.firstChild);
        }
        localStorage.removeItem(this.storageKey);
    }
}