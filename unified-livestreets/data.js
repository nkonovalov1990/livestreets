
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
                "title": "Егоршинский",
                "map": "/unified-livestreets/images/24-12%20%D0%9C%D0%B0%D0%BB%D1%8B%D1%88%D0%B5%D0%B2%D0%B0-%D0%95%D0%B3%D0%BE%D1%80%D1%88%D0%B8%D0%BD%D1%81%D0%BA%D0%B8%D0%B9%20%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4/egorshynsky.jpg",
                "default": true
            },
            {
                "title": "Линии справа",
                "map": "/unified-livestreets/images/24-12%20%D0%9C%D0%B0%D0%BB%D1%8B%D1%88%D0%B5%D0%B2%D0%B0-%D0%95%D0%B3%D0%BE%D1%80%D1%88%D0%B8%D0%BD%D1%81%D0%BA%D0%B8%D0%B9%20%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4/lines-right.jpg",
                "default": false
            },
            {
                "title": "План",
                "map": "/unified-livestreets/images/24-12%20%D0%9C%D0%B0%D0%BB%D1%8B%D1%88%D0%B5%D0%B2%D0%B0-%D0%95%D0%B3%D0%BE%D1%80%D1%88%D0%B8%D0%BD%D1%81%D0%BA%D0%B8%D0%B9%20%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4/plan.jpg",
                "default": false
            },
            {
                "title": "Проект",
                "map": "/unified-livestreets/images/24-12%20%D0%9C%D0%B0%D0%BB%D1%8B%D1%88%D0%B5%D0%B2%D0%B0-%D0%95%D0%B3%D0%BE%D1%80%D1%88%D0%B8%D0%BD%D1%81%D0%BA%D0%B8%D0%B9%20%D0%BF%D0%BE%D0%B4%D1%85%D0%BE%D0%B4/project.jpg",
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
                "title": "Проект планировки 2023",
                "map": "/unified-livestreets/images/24-04%20%D0%90%D0%BC%D1%83%D0%BD%D0%B4%D1%81%D0%B5%D0%BD%D0%B0%20%D0%BE%D0%B1%D1%8A%D0%B5%D0%B7%D0%B4%D0%BD%D0%B0%D1%8F/Project_planning_2023.jpg",
                "default": true
            },
            {
                "title": "Предложения 2024",
                "map": "/unified-livestreets/images/24-04%20%D0%90%D0%BC%D1%83%D0%BD%D0%B4%D1%81%D0%B5%D0%BD%D0%B0%20%D0%BE%D0%B1%D1%8A%D0%B5%D0%B7%D0%B4%D0%BD%D0%B0%D1%8F/Proposals_2024.jpg",
                "default": false
            },
            {
                "title": "Предложения 2024 без БРТ",
                "map": "/unified-livestreets/images/24-04%20%D0%90%D0%BC%D1%83%D0%BD%D0%B4%D1%81%D0%B5%D0%BD%D0%B0%20%D0%BE%D0%B1%D1%8A%D0%B5%D0%B7%D0%B4%D0%BD%D0%B0%D1%8F/Proposals_2024_without_BRT.jpg",
                "default": false
            },
            {
                "title": "Исходный проект",
                "map": "/unified-livestreets/images/24-04%20%D0%90%D0%BC%D1%83%D0%BD%D0%B4%D1%81%D0%B5%D0%BD%D0%B0%20%D0%BE%D0%B1%D1%8A%D0%B5%D0%B7%D0%B4%D0%BD%D0%B0%D1%8F/Source_project.jpg",
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
                "title": "Предложения Живых улиц",
                "map": "/unified-livestreets/images/23-07%20%D0%A2%D0%B0%D1%82%D0%B8%D1%89%D0%B5%D0%B2%D0%B0/Tatishcheva-Predlozheniya-Zhivyh-ulic-min.jpg",
                "default": true
            },
            {
                "title": "Проект планировки",
                "map": "/unified-livestreets/images/23-07%20%D0%A2%D0%B0%D1%82%D0%B8%D1%89%D0%B5%D0%B2%D0%B0/Tatishcheva-proekt-min.jpg",
                "default": false
            },
            {
                "title": "Исходная ситуация",
                "map": "/unified-livestreets/images/23-07%20%D0%A2%D0%B0%D1%82%D0%B8%D1%89%D0%B5%D0%B2%D0%B0/Tatishcheva-situaciya-min.jpg",
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
                "title": "amundsena_obezdnaya_2013",
                "map": "/unified-livestreets/images/23-04%20%D0%90%D0%BC%D1%83%D0%BD%D0%B4%D1%81%D0%B5%D0%BD%D0%B0%20%D0%BE%D0%B1%D1%8A%D0%B5%D0%B7%D0%B4%D0%BD%D0%B0%D1%8F/amundsena_obezdnaya_2013.jpg",
                "default": true
            },
            {
                "title": "amundsena_obezdnaya_iskhodnaya_situacziya",
                "map": "/unified-livestreets/images/23-04%20%D0%90%D0%BC%D1%83%D0%BD%D0%B4%D1%81%D0%B5%D0%BD%D0%B0%20%D0%BE%D0%B1%D1%8A%D0%B5%D0%B7%D0%B4%D0%BD%D0%B0%D1%8F/amundsena_obezdnaya_iskhodnaya_situacziya.jpg",
                "default": false
            },
            {
                "title": "amundsena_obezdnaya_predlozheniya_zhivykh_ulicz",
                "map": "/unified-livestreets/images/23-04%20%D0%90%D0%BC%D1%83%D0%BD%D0%B4%D1%81%D0%B5%D0%BD%D0%B0%20%D0%BE%D0%B1%D1%8A%D0%B5%D0%B7%D0%B4%D0%BD%D0%B0%D1%8F/amundsena_obezdnaya_predlozheniya_zhivykh_ulicz.jpg",
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
                "title": "iset2023_initial",
                "map": "/unified-livestreets/images/23-02%20%D0%9D%D0%B0%D0%B1%D0%B5%D1%80%D0%B5%D0%B6%D0%BD%D0%B0%D1%8F%20%D0%98%D1%81%D0%B5%D1%82%D0%B8/iset2023_initial.jpg",
                "default": true
            },
            {
                "title": "iset2023_project",
                "map": "/unified-livestreets/images/23-02%20%D0%9D%D0%B0%D0%B1%D0%B5%D1%80%D0%B5%D0%B6%D0%BD%D0%B0%D1%8F%20%D0%98%D1%81%D0%B5%D1%82%D0%B8/iset2023_project.jpg",
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