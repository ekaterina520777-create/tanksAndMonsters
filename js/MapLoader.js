class MapLoaderApp {
    constructor() {
        this.selectElement = document.getElementById('mapSelect');
        this.loadedMaps = [];
    }

    async fetchMaps() {
        try {

            const response = await fetch('data/maps.json');
            if (!response.ok) throw new Error('Ошибка сети при получении карт');
            
            const data = await response.getJson ? await response.getJson() : await response.json();
            this.loadedMaps = data.maps;
            this.populateSelect();
        } catch (error) {
            console.error('Не удалось загрузить карты:', error);
            this.populateSelect();
        }
    }

    populateSelect() {
        this.selectElement.innerHTML = '';
        this.loadedMaps.forEach((map, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = map.name;
            this.selectElement.appendChild(option);
        });
    }

    getSelectedMapGrid() {
        const index = this.selectElement.value;
        return this.loadedMaps[index].grid;
    }
}
