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

// Utils
const showLoader = () => loader.style.display = 'block';
const hideLoader = () => loader.style.display = 'none';
const showLoaderText = () => loaderText.style.display = 'block';
const hideLoaderText = () => loaderText.style.display = 'none';

const getScreenCenter = () => ({
    pageX: window.innerWidth / 2,
    pageY: window.innerHeight / 2
});

// Initialize map image
const mapImage = new Image();
mapImage.src = currentMap.map;
mapContainer.appendChild(mapImage);

// Initialize viewer
const initializeViewer = () => {
    const { innerHeight: windowHeight, innerWidth: windowWidth } = window;
    const maxSideSize = Math.max(windowWidth, windowHeight);
    const minZoomRatio = windowWidth > windowHeight ? 1 : 2;

    viewer = new Viewer(mapImage, {
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
            showLoaderText();
        },
        viewed() {
            mapImage.style.display = 'none';
            const image = document.querySelector('.viewer-canvas img');
            image.style.willChange = 'transform, opacity';
            viewer.zoomTo(0.1);
            viewer.isShown = false;

            const showViewerImage = () => {
                image.style.willChange = 'none';
                image.style.opacity = 1;
                viewer.options.transition = true;
                hideLoaderText();
            };

            const loadingTimeout = setTimeout(showViewerImage, VIEWER_LOADING_TIMEOUT);
            image.addEventListener('animationend', () => {
                showViewerImage();
                clearTimeout(loadingTimeout);
            });
        }
    });
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
    const viewerImage = document.querySelector('.viewer-canvas img');
    if (!viewerImage) {
        console.error('Viewer image element not found');
        return;
    }

    viewerImage.style.opacity = 0.2;
    showLoader();

    // Создаем временное изображение для проверки загрузки
    const tempImage = new Image();
    tempImage.onload = () => {
        viewerImage.src = currentMap.map;
        viewerImage.onload = () => {
            viewerImage.style.opacity = 1;
            hideLoader();
        };
    };
    tempImage.onerror = () => {
        console.error(`Failed to load image: ${currentMap.map}`);
        hideLoader();
        // Можно добавить визуальное уведомление об ошибке
        viewerImage.style.opacity = 1;
    };
    tempImage.src = currentMap.map;
};

// Event Listeners
setsSelect.addEventListener('change', (e) => {
    currentSet = SETS.find(set => set.id === e.target.value);
    currentMap = currentSet.maps.find(map => map.default) || currentSet.maps[0];
    updateUrlParams(currentSet.id);
    renderMaps();
    loadMap();
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    const { setId } = getUrlParams();
    if (setId && setId !== currentSet.id) {
        currentSet = SETS.find(set => set.id === setId) || currentSet;
        currentMap = currentSet.maps.find(map => map.default) || currentSet.maps[0];
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
            viewer.zoomTo(0.1);
            viewer.moveTo(0, -window.innerHeight / 2);
            break;
    }
});

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    initializeViewer();
    renderSets();
    renderMaps();
}); 