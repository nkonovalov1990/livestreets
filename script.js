// Constants
const PLAN_SIZE_MAXIMIZED = 10000;
const VIEWER_ZOOM_RATIO = 0.5;
const VIEWER_LOADING_TIMEOUT = 5000;

// DOM Elements
const mapContainer = document.querySelector('[data-map]');
const setsSelect = document.querySelector('[data-sets-select]');
const mapsListContainer = document.querySelector('[data-maps-list]');
const loader = document.querySelector('[data-loader]');
const loaderText = document.querySelector('[data-loader-text]');

// URL Params handling
const getUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
        setId: params.get('set')
    };
};

const updateUrlParams = (setId) => {
    const url = new URL(window.location);
    url.searchParams.set('set', setId);
    window.history.pushState({}, '', url);
};

// State
const urlParams = getUrlParams();
let currentSet = SETS.find(set => set.id === urlParams.setId) || 
                SETS.find(set => set.default) || 
                SETS[0] ||
                { maps: [] }; // Добавляем пустой набор по умолчанию
let currentMap = currentSet.maps.find(map => map.default) || currentSet.maps[0];
let viewer = null;

// Начальное состояние для нового набора карт
const initialState = {
    zoom: 0.1,
    x: 0,
    y: 0
};

// Текущее состояние просмотрщика
let viewerState = { ...initialState };

// Utils
const showLoader = () => loader.style.display = 'block';
const hideLoader = () => loader.style.display = 'none';
const showLoaderText = () => loaderText.style.display = 'block';
const hideLoaderText = () => loaderText.style.display = 'none';

const getScreenCenter = () => ({
    pageX: window.innerWidth / 2,
    pageY: window.innerHeight / 2
});

// Initialize viewer
const createViewer = (image) => {
    // Очищаем старый просмотрщик
    if (viewer) {
        // Сохраняем состояние перед удалением
        viewerState = {
            zoom: viewer.zoomRatio,
            x: viewer.viewer.translateX,
            y: viewer.viewer.translateY
        };
        viewer.destroy();
        viewer = null;
    }

    // Очищаем все старые контейнеры просмотрщика и изображения
    document.querySelectorAll('.viewer-container').forEach(container => {
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }
    });
    
    // Очищаем все изображения в контейнере карты
    mapContainer.querySelectorAll('img:not(:last-child)').forEach(img => {
        if (img !== image) {
            img.remove();
        }
    });

    // Создаем новый просмотрщик
    viewer = new Viewer(image, {
        inline: true,
        backdrop: false,
        navbar: false,
        title: false,
        toolbar: false,
        tooltip: false,
        movable: true,
        zoomable: true,
        rotatable: false,
        scalable: false,
        transition: false,
        fullscreen: false,
        keyboard: true,
        container: mapContainer,
        ready() {
            // Устанавливаем начальное состояние
            viewer.zoomTo(viewerState.zoom);
            viewer.moveTo(viewerState.x, viewerState.y);
            hideLoader();
            hideLoaderText();
        }
    });
};

// Navigation
const renderSets = () => {
    const setsSelect = document.querySelector('[data-sets-select]');
    setsSelect.innerHTML = '';

    if (!SETS.length) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Нет доступных наборов';
        setsSelect.appendChild(option);
        return;
    }

    SETS.forEach(set => {
        const option = document.createElement('option');
        option.value = set.id;
        option.textContent = set.title;
        option.selected = set === currentSet;
        setsSelect.appendChild(option);
    });
};

const updateMapButtons = () => {
    mapsListContainer.querySelectorAll('.map-button').forEach(button => {
        button.classList.toggle('active', button.dataset.map === currentMap.map);
    });
};

const renderMaps = () => {
    const mapsList = document.querySelector('[data-maps-list]');
    mapsList.innerHTML = '';

    if (!currentSet.maps.length) {
        const message = document.createElement('div');
        message.textContent = 'В этом наборе нет карт';
        message.style.padding = '8px';
        mapsList.appendChild(message);
        return;
    }

    currentSet.maps.forEach(map => {
        const button = document.createElement('button');
        button.className = `map-button${map === currentMap ? ' active' : ''}`;
        button.textContent = map.title;
        button.addEventListener('click', () => {
            if (map !== currentMap) {
                currentMap = map;
                loadMap();
                updateMapButtons();
            }
        });
        mapsList.appendChild(button);
    });
};

const loadMap = () => {
    if (!currentMap) {
        if (viewer) {
            viewer.destroy();
            viewer = null;
        }
        return;
    }

    showLoader();
    showLoaderText();

    // Очищаем все существующие изображения перед загрузкой нового
    mapContainer.querySelectorAll('img').forEach(img => img.remove());
    
    const image = new Image();
    image.src = currentMap.map;
    image.onload = () => {
        // Очищаем контейнер еще раз перед добавлением нового изображения
        mapContainer.querySelectorAll('img').forEach(img => img.remove());
        
        // Добавляем новое изображение
        mapContainer.appendChild(image);
        image.style.opacity = '0';
        image.style.transition = 'opacity 0.3s ease-in-out';
        
        // Создаем новый просмотрщик
        createViewer(image);
        
        // Плавно показываем новое изображение
        requestAnimationFrame(() => {
            image.style.opacity = '1';
            hideLoader();
            hideLoaderText();
        });
    };
    image.onerror = () => {
        hideLoader();
        hideLoaderText();
        console.error('Failed to load image:', currentMap.map);
    };
};

// Reset viewer state
const resetViewerState = () => {
    viewerState = { ...initialState };
};

// Event Listeners
setsSelect.addEventListener('change', (e) => {
    // Удаляем старый просмотрщик перед сменой набора
    if (viewer) {
        viewer.destroy();
        viewer = null;
    }
    currentSet = SETS.find(set => set.id === e.target.value);
    currentMap = currentSet.maps.find(map => map.default) || currentSet.maps[0];
    updateUrlParams(currentSet.id);
    resetViewerState();
    renderMaps();
    
    // Загружаем карту с новым состоянием
    const newImage = new Image();
    newImage.onload = () => {
        mapContainer.querySelectorAll('img').forEach(img => img.remove());
        mapContainer.appendChild(newImage);
        createViewer(newImage, null, false); // Не сохраняем состояние при смене набора
    };
    newImage.onerror = () => {
        console.error(`Failed to load image: ${currentMap.map}`);
        hideLoader();
        hideLoaderText();
    };
    newImage.src = currentMap.map;
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    const { setId } = getUrlParams();
    if (setId && setId !== currentSet.id) {
        // Удаляем старый просмотрщик перед сменой набора
        if (viewer) {
            viewer.destroy();
            viewer = null;
        }
        currentSet = SETS.find(set => set.id === setId) || currentSet;
        currentMap = currentSet.maps.find(map => map.default) || currentSet.maps[0];
        resetViewerState(); // Сбрасываем состояние при навигации
        renderSets();
        renderMaps();
        loadMap();
    }
});

// Zoom controls
const zoomIn = () => viewer.zoom(+VIEWER_ZOOM_RATIO, false, getScreenCenter());
const zoomOut = () => viewer.zoom(-VIEWER_ZOOM_RATIO, false, getScreenCenter());

document.querySelector('[data-plan-zoom-in]').addEventListener('click', zoomIn);
document.querySelector('[data-plan-zoom-out]').addEventListener('click', zoomOut);

// Keyboard controls
document.addEventListener('keyup', ({ shiftKey, key }) => {
    if (!viewer) return;
    
    const { imageData: { ratio = 1 } = {} } = viewer;

    switch (key) {
        case 'ArrowUp':
            shiftKey && viewer.move(0, 250 * ratio);
            break;
        case 'ArrowDown':
            shiftKey && viewer.move(0, -250 * ratio);
            break;
        case 'ArrowLeft':
            shiftKey && viewer.move(250 * ratio, 0);
            break;
        case 'ArrowRight':
            shiftKey && viewer.move(-250 * ratio, 0);
            break;
        case '+':
        case '=':
            zoomIn();
            break;
        case '-':
            zoomOut();
            break;
        case 'Escape':
        case '0':
            resetViewerState();
            viewer.zoomTo(viewerState.zoom);
            viewer.moveTo(viewerState.x, viewerState.y);
            break;
    }
});

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    showLoader();
    showLoaderText();
    
    renderSets();
    renderMaps();

    if (!currentMap) {
        hideLoader();
        hideLoaderText();
        return;
    }
    
    const initialImage = new Image();
    initialImage.onload = () => {
        mapContainer.appendChild(initialImage);
        createViewer(initialImage);
    };
    initialImage.onerror = () => {
        hideLoader();
        hideLoaderText();
        console.error('Failed to load initial image:', currentMap.map);
    };
    initialImage.src = currentMap.map;
}); 