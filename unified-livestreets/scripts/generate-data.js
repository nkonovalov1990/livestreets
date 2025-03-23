const fs = require('fs');
const path = require('path');

// Конфигурация названий карт (если имя файла соответствует определенному паттерну)
const MAP_TITLES = {
    'Source_project': 'Исходный проект',
    'Proposals_2024': 'Предложения 2024',
    'Proposals_2024_without_BRT': 'Предложения 2024 без БРТ',
    'Project_planning_2023': 'Проект планировки 2023',
    'project': 'Проект',
    'plan': 'План',
    'lines-right': 'Линии справа',
    'egorshynsky': 'Егоршинский',
    'Tatishcheva-situaciya-min': 'Исходная ситуация',
    'Tatishcheva-proekt-min': 'Проект планировки',
    'Tatishcheva-Predlozheniya-Zhivyh-ulic-min': 'Предложения Живых улиц'
};

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

    setDirs.forEach((setDir, index) => {
        const setPath = path.join(imagesDir, setDir);
        console.log('Processing directory:', setDir);

        const images = fs.readdirSync(setPath)
            .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
            .sort();

        console.log('Found images:', images);

        if (images.length > 0) {
            const maps = images.map((image, imageIndex) => ({
                title: getTitleFromFilename(image),
                map: `/unified-livestreets/images/${encodeURIComponent(setDir)}/${encodeURIComponent(image)}`,
                default: imageIndex === 0 // Первое изображение будет default
            }));

            sets.push({
                id: setDir,
                title: setDir,
                default: index === 0, // Первый набор будет default
                maps
            });
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