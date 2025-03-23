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
    // Транслитерация русских букв
    const translitMap = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'E',
        'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
        'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
        'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch',
        'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
    };

    return dirName
        .split('')
        .map(char => translitMap[char] || char) // транслитерация
        .join('')
        .replace(/[\s\/\\]/g, '-') // заменяем пробелы и слеши на дефисы
        .replace(/[^a-zA-Z0-9-]/g, '') // оставляем только латиницу, цифры и дефисы
        .replace(/-+/g, '-') // заменяем множественные дефисы на один
        .replace(/^-|-$/g, '') // удаляем дефисы в начале и конце
        .toLowerCase();
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

    console.log('Scanning directory:', imagesDir);

    // Получаем список поддиректорий (наборов)
    const setDirs = fs.readdirSync(imagesDir)
        .filter(file => {
            const fullPath = path.join(imagesDir, file);
            const isDir = fs.statSync(fullPath).isDirectory();
            console.log('Found:', file, 'isDirectory:', isDir);
            return isDir;
        })
        .sort((a, b) => b.localeCompare(a)); // Сортируем в обратном порядке, чтобы новые были вверху

    console.log('Found directories:', setDirs);

    setDirs.forEach((setDir, index) => {
        const setPath = path.join(imagesDir, setDir);
        const normalizedDirName = normalizeDirectoryName(setDir);
        console.log('Processing directory:', setDir);
        console.log('Normalized name:', normalizedDirName);

        const images = fs.readdirSync(setPath)
            .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
            .sort();

        console.log('Found images:', images);

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

    console.log('Generated sets:', JSON.stringify(sets, null, 2));
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