
// Определяем базовый путь в зависимости от окружения
const BASE_PATH = location.hostname === 'localhost' || location.hostname === '127.0.0.1' 
    ? '.' 
    : '/livestreets';

// Преобразуем пути к изображениям
const SETS = [
    {
        "id": "24-12 Малышева-Егоршинский подход",
        "title": "24-12 Малышева-Егоршинский подход",
        "default": true,
        "maps": [
            {
                "title": "Выделенки справа",
                "map": "images/24-12%20%D0%9C%D0%B0%D0%BB%D1%8B%D1%88%D0%B5%D0%B2%D0%B0-%D0%95%D0%B3%D0%BE%D1%80%D1%88%D0%B8%D0%BD%D1%81%D0%BA%D0%B8%D0%B9%20%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4/%D0%92%D1%8B%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%BA%D0%B8%20%D1%81%D0%BF%D1%80%D0%B0%D0%B2%D0%B0.jpg",
                "default": true
            },
            {
                "title": "Исходная ситуация",
                "map": "images/24-12%20%D0%9C%D0%B0%D0%BB%D1%8B%D1%88%D0%B5%D0%B2%D0%B0-%D0%95%D0%B3%D0%BE%D1%80%D1%88%D0%B8%D0%BD%D1%81%D0%BA%D0%B8%D0%B9%20%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4/%D0%98%D1%81%D1%85%D0%BE%D0%B4%D0%BD%D0%B0%D1%8F%20%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D1%8F.jpg",
                "default": false
            },
            {
                "title": "Предложения Живых улиц",
                "map": "images/24-12%20%D0%9C%D0%B0%D0%BB%D1%8B%D1%88%D0%B5%D0%B2%D0%B0-%D0%95%D0%B3%D0%BE%D1%80%D1%88%D0%B8%D0%BD%D1%81%D0%BA%D0%B8%D0%B9%20%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4/%D0%9F%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%96%D0%B8%D0%B2%D1%8B%D1%85%20%D1%83%D0%BB%D0%B8%D1%86.jpg",
                "default": false
            },
            {
                "title": "Съезды на Егоршинский",
                "map": "images/24-12%20%D0%9C%D0%B0%D0%BB%D1%8B%D1%88%D0%B5%D0%B2%D0%B0-%D0%95%D0%B3%D0%BE%D1%80%D1%88%D0%B8%D0%BD%D1%81%D0%BA%D0%B8%D0%B9%20%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4/%D0%A1%D1%8A%D0%B5%D0%B7%D0%B4%D1%8B%20%D0%BD%D0%B0%20%D0%95%D0%B3%D0%BE%D1%80%D1%88%D0%B8%D0%BD%D1%81%D0%BA%D0%B8%D0%B9.jpg",
                "default": false
            }
        ]
    },
    {
        "id": "24-04 Амундсена объездная",
        "title": "24-04 Амундсена объездная",
        "default": false,
        "maps": [
            {
                "title": "Предложения 2023",
                "map": "images/24-04%20%D0%90%D0%BC%D1%83%D0%BD%D0%B4%D1%81%D0%B5%D0%BD%D0%B0%20%D0%BE%D0%B1%D1%8A%D0%B5%D0%B7%D0%B4%D0%BD%D0%B0%D1%8F/%D0%9F%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F%202023.jpg",
                "default": true
            },
            {
                "title": "Предложения 2024 без БРТ",
                "map": "images/24-04%20%D0%90%D0%BC%D1%83%D0%BD%D0%B4%D1%81%D0%B5%D0%BD%D0%B0%20%D0%BE%D0%B1%D1%8A%D0%B5%D0%B7%D0%B4%D0%BD%D0%B0%D1%8F/%D0%9F%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F%202024%20%D0%B1%D0%B5%D0%B7%20%D0%91%D0%A0%D0%A2.jpg",
                "default": false
            },
            {
                "title": "Предложения 2024",
                "map": "images/24-04%20%D0%90%D0%BC%D1%83%D0%BD%D0%B4%D1%81%D0%B5%D0%BD%D0%B0%20%D0%BE%D0%B1%D1%8A%D0%B5%D0%B7%D0%B4%D0%BD%D0%B0%D1%8F/%D0%9F%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F%202024.jpg",
                "default": false
            },
            {
                "title": "Проект",
                "map": "images/24-04%20%D0%90%D0%BC%D1%83%D0%BD%D0%B4%D1%81%D0%B5%D0%BD%D0%B0%20%D0%BE%D0%B1%D1%8A%D0%B5%D0%B7%D0%B4%D0%BD%D0%B0%D1%8F/%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82.jpg",
                "default": false
            }
        ]
    },
    {
        "id": "23-07 Татищева",
        "title": "23-07 Татищева",
        "default": false,
        "maps": [
            {
                "title": "Исходная ситуация",
                "map": "images/23-07%20%D0%A2%D0%B0%D1%82%D0%B8%D1%89%D0%B5%D0%B2%D0%B0/%D0%98%D1%81%D1%85%D0%BE%D0%B4%D0%BD%D0%B0%D1%8F%20%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D1%8F.jpg",
                "default": true
            },
            {
                "title": "Предложения Живых улиц",
                "map": "images/23-07%20%D0%A2%D0%B0%D1%82%D0%B8%D1%89%D0%B5%D0%B2%D0%B0/%D0%9F%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%96%D0%B8%D0%B2%D1%8B%D1%85%20%D1%83%D0%BB%D0%B8%D1%86.jpg",
                "default": false
            },
            {
                "title": "Проект",
                "map": "images/23-07%20%D0%A2%D0%B0%D1%82%D0%B8%D1%89%D0%B5%D0%B2%D0%B0/%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82.jpg",
                "default": false
            }
        ]
    },
    {
        "id": "23-04 Амундсена объездная",
        "title": "23-04 Амундсена объездная",
        "default": false,
        "maps": [
            {
                "title": "Исходная ситуация",
                "map": "images/23-04%20%D0%90%D0%BC%D1%83%D0%BD%D0%B4%D1%81%D0%B5%D0%BD%D0%B0%20%D0%BE%D0%B1%D1%8A%D0%B5%D0%B7%D0%B4%D0%BD%D0%B0%D1%8F/%D0%98%D1%81%D1%85%D0%BE%D0%B4%D0%BD%D0%B0%D1%8F%20%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D1%8F.jpg",
                "default": true
            },
            {
                "title": "Предложения Живых улиц",
                "map": "images/23-04%20%D0%90%D0%BC%D1%83%D0%BD%D0%B4%D1%81%D0%B5%D0%BD%D0%B0%20%D0%BE%D0%B1%D1%8A%D0%B5%D0%B7%D0%B4%D0%BD%D0%B0%D1%8F/%D0%9F%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%96%D0%B8%D0%B2%D1%8B%D1%85%20%D1%83%D0%BB%D0%B8%D1%86.jpg",
                "default": false
            },
            {
                "title": "Проект",
                "map": "images/23-04%20%D0%90%D0%BC%D1%83%D0%BD%D0%B4%D1%81%D0%B5%D0%BD%D0%B0%20%D0%BE%D0%B1%D1%8A%D0%B5%D0%B7%D0%B4%D0%BD%D0%B0%D1%8F/%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82.jpg",
                "default": false
            }
        ]
    },
    {
        "id": "23-02 Набережная Исети",
        "title": "23-02 Набережная Исети",
        "default": false,
        "maps": [
            {
                "title": "Предложения Живых улиц",
                "map": "images/23-02%20%D0%9D%D0%B0%D0%B1%D0%B5%D1%80%D0%B5%D0%B6%D0%BD%D0%B0%D1%8F%20%D0%98%D1%81%D0%B5%D1%82%D0%B8/%D0%9F%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%96%D0%B8%D0%B2%D1%8B%D1%85%20%D1%83%D0%BB%D0%B8%D1%86.jpg",
                "default": true
            },
            {
                "title": "Проект",
                "map": "images/23-02%20%D0%9D%D0%B0%D0%B1%D0%B5%D1%80%D0%B5%D0%B6%D0%BD%D0%B0%D1%8F%20%D0%98%D1%81%D0%B5%D1%82%D0%B8/%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82.jpg",
                "default": false
            }
        ]
    }
].map(set => ({
    ...set,
    maps: set.maps.map(map => ({
        ...map,
        map: BASE_PATH + map.map
    }))
}));