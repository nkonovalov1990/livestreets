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
                SETS[0];
let currentMap = currentSet.maps.find(map => map.default) || currentSet.maps[0];
let viewer = null;
let viewerState = {
    zoom: 0.1,
    x: 0,
    y: 0
};

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
const createViewer = (image, oldViewer = null) => {
    const { innerHeight: windowHeight, innerWidth: windowWidth } = window;
    const maxSideSize = Math.max(windowWidth, windowHeight);
    const minZoomRatio = windowWidth > windowHeight ? 1 : 2;

    if (oldViewer) {
        // Сохраняем текущее состояние
        viewerState = {
            zoom: oldViewer.imageData.ratio,
            x: oldViewer.imageData.x,
            y: oldViewer.imageData.y
        };
    }

    viewer = new Viewer(image, {
        title: false,
        navbar: false,
        backdrop: false,
        toolbar: false,
        fullscreen: false,
        button: false,
        inline: true,
        keyboard: false,
        zIndexInline: 1,
        rotatable: false,
        scalable: false,
        toggleOnDblclick: false,
        slideOnTouch: false,
        tooltip: false,
        transition: false,
        zoomRatio: VIEWER_ZOOM_RATIO,
        maxZoomRatio: PLAN_SIZE_MAXIMIZED / maxSideSize,
        minZoomRatio: 0.1,
        ready() {
            hideLoader();
        },
        viewed() {
            // Удаляем оригинальное изображение после того, как просмотрщик создал свою копию
            image.remove();
            
            const viewerImage = document.querySelector('.viewer-canvas img:last-child');
            viewerImage.style.willChange = 'transform, opacity';
            viewerImage.style.opacity = '0';
            
            // Восстанавливаем состояние просмотра
            viewer.zoomTo(viewerState.zoom);
            viewer.moveTo(viewerState.x, viewerState.y);
            
            viewer.isShown = false;

            // Плавно показываем новое изображение
            requestAnimationFrame(() => {
                viewerImage.style.opacity = '1';
                viewerImage.style.transition = 'opacity 0.3s ease-in-out';
                hideLoaderText(); // Скрываем текст загрузки сразу при начале анимации
                
                viewerImage.addEventListener('transitionend', () => {
                    // После появления новой карты удаляем старую
                    if (oldViewer) {
                        oldViewer.destroy();
                    }
                    
                    viewerImage.style.willChange = 'none';
                    viewer.options.transition = true;
                }, { once: true });
            });
        }
    });

    return viewer;
};

// Navigation
const renderSets = () => {
    setsSelect.innerHTML = '';
    SETS.forEach(set => {
        const option = document.createElement('option');
        option.value = set.id;
        option.textContent = set.title;
        option.selected = set.id === currentSet.id;
        setsSelect.appendChild(option);
    });
};

const updateMapButtons = () => {
    mapsListContainer.querySelectorAll('.map-button').forEach(button => {
        button.classList.toggle('active', button.dataset.map === currentMap.map);
    });
};

const renderMaps = () => {
    mapsListContainer.innerHTML = '';
    currentSet.maps.forEach(map => {
        const button = document.createElement('button');
        button.className = 'map-button';
        button.textContent = map.title;
        button.dataset.map = map.map;
        if (map.map === currentMap.map) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            currentMap = map;
            updateMapButtons();
            loadMap();
        });
        mapsListContainer.appendChild(button);
    });
};

const loadMap = () => {
    showLoader();
    showLoaderText(); // Показываем текст загрузки при начале загрузки новой карты
    
    // Создаем новое изображение
    const newImage = new Image();
    newImage.onload = () => {
        // Сохраняем старый просмотрщик для плавного перехода внутри набора
        const oldViewer = viewer;
        
        // Очищаем контейнер от всех изображений
        mapContainer.querySelectorAll('img').forEach(img => img.remove());
        
        // Добавляем новое изображение
        mapContainer.appendChild(newImage);
        
        // Создаем новый viewer, передавая старый для сохранения состояния
        createViewer(newImage, oldViewer);
    };
    
    newImage.onerror = () => {
        console.error(`Failed to load image: ${currentMap.map}`);
        hideLoader();
        hideLoaderText(); // Скрываем текст загрузки при ошибке
    };
    
    newImage.src = currentMap.map;
};

// Reset viewer state
const resetViewerState = () => {
    viewerState = {
        zoom: 0.1,
        x: 0,
        y: 0
    };
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
    resetViewerState(); // Сбрасываем состояние при смене набора
    renderMaps();
    loadMap();
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
    
    const initialImage = new Image();
    initialImage.onload = () => {
        mapContainer.appendChild(initialImage);
        createViewer(initialImage);
        renderSets();
        renderMaps();
    };
    initialImage.src = currentMap.map;
}); 