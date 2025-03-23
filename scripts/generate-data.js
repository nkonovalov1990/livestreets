const fs = require('fs');
const path = require('path');

// Конфигурация названий наборов
const SET_TITLES = {
    '24-12-malysheva-egorshinsky': '24-12 Малышева-Егоршинский подход',
    '24-04-amundsena-bypass': '24-04 Амундсена объездная',
    '23-07-tatischeva': '23-07 Татищева',
    '23-04-amundsena-bypass': '23-04 Амундсена объездная',
    '23-02-naberezhnaya-iseti': '23-02 Набережная Исети'
};

// Конфигурация названий карт (если имя файла соответствует определенному паттерну)
const MAP_TITLES = {
    'initial_situation': 'Исходная ситуация',
    'current_situation': 'Исходная ситуация',
    'dedicated_lanes_right': 'Выделенки справа',
    'exits_to_egorshinsky': 'Съезды на Егоршинский',
    'living_streets_proposals': 'Предложения Живых улиц',
    'proposals_2023': 'Предложения 2023',
    'proposals_2024': 'Предложения 2024',
    'proposals_2024_without_brt': 'Предложения 2024 без БРТ',
    'project': 'Проект',
    'planning_project': 'Проект планировки'
};

// Функция для нормализации русских символов в пути
function normalizePathComponent(str) {
    // Нормализуем Unicode-символы (например, комбинированные символы)
    const normalized = str.normalize('NFKC');
    // Заменяем пробелы на дефисы
    return encodeURIComponent(normalized);
}

// Функция для получения человекочитаемого названия из имени файла
function getTitleFromFilename(filename) {
    const basename = path.basename(filename, path.extname(filename));
    return MAP_TITLES[basename] || basename;
}

// Функция для сканирования директории с изображениями
function scanImagesDirectory() {
    const imagesDir = path.join(__dirname, '..', 'images');
    const sets = [];

    console.log('Scanning directory:', imagesDir);

    // Получаем список поддиректорий (наборов)
    const setDirs = fs.readdirSync(imagesDir)
        .filter(file => {
            const fullPath = path.join(imagesDir, file);
            const isDir = fs.statSync(fullPath).isDirectory();
            console.log('Found:', file, 'isDirectory:', isDir);
            return isDir;
        })
        .sort((a, b) => b.localeCompare(a)); // Сортируем в обратном порядке

    console.log('Found directories:', setDirs);

    setDirs.forEach(setDir => {
        console.log('Processing directory:', setDir);
        const setPath = path.join(imagesDir, setDir);
        const images = fs.readdirSync(setPath)
            .filter(file => file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg') || file.toLowerCase().endsWith('.png'));

        console.log('Found images:', images);

        if (images.length > 0) {
            const set = {
                id: setDir,
                title: SET_TITLES[setDir] || setDir, // Используем русское название из конфигурации
                default: setDir === setDirs[0],
                maps: images.map(image => ({
                    title: getTitleFromFilename(image),
                    map: `/images/${normalizePathComponent(setDir)}/${normalizePathComponent(image)}`,
                    default: image === images[0]
                }))
            };
            sets.push(set);
        }
    });

    console.log('Generated sets:', JSON.stringify(sets, null, 2));
    return sets;
}

// Генерируем data.js
function generateDataFile() {
    const sets = scanImagesDirectory();
    const content = `
// Определяем базовый путь в зависимости от окружения
const BASE_PATH = location.hostname === 'localhost' || location.hostname === '127.0.0.1' 
    ? '.' 
    : '/livestreets';

// Преобразуем пути к изображениям
const SETS = ${JSON.stringify(sets, null, 4)}.map(set => ({
    ...set,
    maps: set.maps.map(map => ({
        ...map,
        map: BASE_PATH + map.map
    }))
}));`;
    fs.writeFileSync(path.join(__dirname, '..', 'data.js'), content);
}

// Запускаем генерацию
generateDataFile(); 