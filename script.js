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
const createViewer = (image, oldViewer = null, shouldKeepState = true) => {
    const { innerHeight: windowHeight, innerWidth: windowWidth } = window;
    const maxSideSize = Math.max(windowWidth, windowHeight);
    const minZoomRatio = windowWidth > windowHeight ? 1 : 2;

    // Сохраняем состояние только если это переключение внутри набора
    if (oldViewer && shouldKeepState) {
        viewerState = {
            zoom: oldViewer.imageData.ratio,
            x: oldViewer.imageData.x,
            y: oldViewer.imageData.y
        };
    }

    // Очищаем все старые элементы просмотрщика
    document.querySelectorAll('.viewer-container').forEach(container => {
        if (container !== oldViewer?.container) {
            container.remove();
        }
    });

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
                hideLoaderText();
                
                // Если есть старый просмотрщик, начинаем его плавное скрытие
                if (oldViewer) {
                    const oldViewerContainer = oldViewer.container;
                    const oldViewerImage = oldViewerContainer.querySelector('.viewer-canvas img');
                    if (oldViewerImage) {
                        // Добавляем задержку в 1 секунду
                        setTimeout(() => {
                            oldViewerImage.style.transition = 'opacity 0.3s ease-in-out';
                            oldViewerImage.style.opacity = '0';
                            
                            oldViewerImage.addEventListener('transitionend', () => {
                                oldViewer.destroy();
                                oldViewerContainer.remove();
                            }, { once: true });
                        }, 1000);
                    } else {
                        oldViewer.destroy();
                        oldViewerContainer.remove();
                    }
                }
                
                viewerImage.addEventListener('transitionend', () => {
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

    const image = new Image();
    image.src = currentMap.map;
    image.onload = () => {
        createViewer(image);
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
    
    const initialImage = new Image();
    initialImage.onload = () => {
        mapContainer.appendChild(initialImage);
        createViewer(initialImage);
        renderSets();
        renderMaps();
    };
    initialImage.src = currentMap.map;
}); 