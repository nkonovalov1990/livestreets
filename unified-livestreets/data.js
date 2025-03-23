
// Определяем базовый путь в зависимости от окружения
const BASE_PATH = location.hostname === 'localhost' || location.hostname === '127.0.0.1' 
    ? '.' 
    : '/livestreets';

// Преобразуем пути к изображениям
const SETS = [
    {
        "id": "25-03 Тест",
        "title": "25-03 Тест",
        "default": true,
        "maps": [
            {
                "title": "Тест 1",
                "map": "/images/25-03%20%D0%A2%D0%B5%D1%81%D1%82/%D0%A2%D0%B5%D1%81%D1%82%201.jpg",
                "default": true
            },
            {
                "title": "Тест 2",
                "map": "/images/25-03%20%D0%A2%D0%B5%D1%81%D1%82/%D0%A2%D0%B5%D1%81%D1%82%202.jpg",
                "default": false
            }
        ]
    },
    {
        "id": "24-12",
        "title": "24-12",
        "default": false,
        "maps": [
            {
                "title": "Егоршинский",
                "map": "/images/24-12/egorshynsky.jpg",
                "default": true
            },
            {
                "title": "Линии справа",
                "map": "/images/24-12/lines-right.jpg",
                "default": false
            },
            {
                "title": "План",
                "map": "/images/24-12/plan.jpg",
                "default": false
            },
            {
                "title": "Проект",
                "map": "/images/24-12/project.jpg",
                "default": false
            }
        ]
    },
    {
        "id": "24-04",
        "title": "24-04",
        "default": false,
        "maps": [
            {
                "title": "Проект планировки 2023",
                "map": "/images/24-04/Project_planning_2023.jpg",
                "default": true
            },
            {
                "title": "Предложения 2024",
                "map": "/images/24-04/Proposals_2024.jpg",
                "default": false
            },
            {
                "title": "Предложения 2024 без БРТ",
                "map": "/images/24-04/Proposals_2024_without_BRT.jpg",
                "default": false
            },
            {
                "title": "Исходный проект",
                "map": "/images/24-04/Source_project.jpg",
                "default": false
            }
        ]
    },
    {
        "id": "23-07",
        "title": "23-07",
        "default": false,
        "maps": [
            {
                "title": "Предложения Живых улиц",
                "map": "/images/23-07/Tatishcheva-Predlozheniya-Zhivyh-ulic-min.jpg",
                "default": true
            },
            {
                "title": "Проект планировки",
                "map": "/images/23-07/Tatishcheva-proekt-min.jpg",
                "default": false
            },
            {
                "title": "Исходная ситуация",
                "map": "/images/23-07/Tatishcheva-situaciya-min.jpg",
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