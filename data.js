// Определяем базовый путь в зависимости от окружения
const BASE_PATH = location.hostname === 'localhost' || location.hostname === '127.0.0.1' 
    ? '.' 
    : '/livestreets';

// Преобразуем пути к изображениям
const SETS = [];