
export class MapLoaderApp {
    constructor() {
        this.selectElement = document.getElementById('mapSelect');
        this.loadedMaps = [];
    }

    async fetchMaps() {
        try {
            const response = await fetch('data/maps.json');
            if (!response.ok) throw new Error('Ошибка сети при получении карт');
            
         
            const data = await response.json();
        
            this.loadedMaps = Array.isArray(data) ? data : (data.maps || []);
            
            this.populateSelect();
        } catch (error) {
            console.error('Не удалось загрузить карты:', error);
            this.populateSelect();
        }
    }

    populateSelect() {
        if (!this.selectElement) return; 
        this.selectElement.innerHTML = '';
        
        this.loadedMaps.forEach((map, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = map.name;
            this.selectElement.appendChild(option);
        });
    }

    getSelectedMapGrid() {
        const index = this.selectElement ? this.selectElement.value : 0;

        if (this.loadedMaps[index]) {
            return this.loadedMaps[index].grid;
        }

        return [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
    }
}