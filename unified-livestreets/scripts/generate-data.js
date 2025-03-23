const fs = require('fs');
const path = require('path');

// Конфигурация названий наборов
const SET_TITLES = {
    'apr-2024': 'Апрель 2024',
    'jul-2023': 'Июль 2023',
    'dec-2024': 'Декабрь 2024',
    '23-03-test': 'Март 2023 Тест'
};

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

// Функция для нормализации имени директории
function normalizeDirectoryName(dirName) {
    // Заменяем пробелы и специальные символы на дефисы
    return dirName.replace(/[\s\/\\]/g, '-').toLowerCase();
}

// Функция для получения человекочитаемого названия из имени файла
function getTitleFromFilename(filename) {
    const basename = path.basename(filename, path.extname(filename));
    return MAP_TITLES[basename] || basename;
}

// Функция для получения человекочитаемого названия набора
function getSetTitle(dirName, normalizedDirName) {
    return SET_TITLES[normalizedDirName] || dirName;
}

// Функция для сканирования директории с изображениями
function scanImagesDirectory() {
    const imagesDir = path.join(__dirname, '..', 'images');
    const sets = [];

    // Получаем список поддиректорий (наборов)
    const setDirs = fs.readdirSync(imagesDir)
        .filter(file => fs.statSync(path.join(imagesDir, file)).isDirectory())
        .sort((a, b) => b.localeCompare(a)); // Сортируем в обратном порядке, чтобы новые были вверху

    setDirs.forEach((setDir, index) => {
        const setPath = path.join(imagesDir, setDir);
        const normalizedDirName = normalizeDirectoryName(setDir);
        const images = fs.readdirSync(setPath)
            .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
            .sort();

        if (images.length > 0) {
            const maps = images.map((image, imageIndex) => ({
                title: getTitleFromFilename(image),
                map: `./images/${encodeURIComponent(setDir)}/${encodeURIComponent(image)}`,
                default: imageIndex === 0 // Первое изображение будет default
            }));

            sets.push({
                id: normalizedDirName,
                title: getSetTitle(setDir, normalizedDirName),
                default: index === 0, // Первый набор будет default
                maps
            });
        }
    });

    return sets;
}

// Генерируем data.js
function generateDataFile() {
    const sets = scanImagesDirectory();
    const content = `const SETS = ${JSON.stringify(sets, null, 4)};`;
    fs.writeFileSync(path.join(__dirname, '..', 'data.js'), content);
}

// Запускаем генерацию
generateDataFile(); 