
// Определяем базовый путь в зависимости от окружения
const BASE_PATH = location.hostname === 'localhost' || location.hostname === '127.0.0.1' 
    ? '.' 
    : '/livestreets';

// Преобразуем пути к изображениям
const SETS = [
    {
        "id": "24-12-malysheva-egorshinsky",
        "title": "24-12 Малышева-Егоршинский подход",
        "default": true,
        "maps": [
            {
                "title": "Выделенки справа",
                "map": "/images/24-12-malysheva-egorshinsky/dedicated_lanes_right.jpg",
                "default": true
            },
            {
                "title": "Съезды на Егоршинский",
                "map": "/images/24-12-malysheva-egorshinsky/exits_to_egorshinsky.jpg",
                "default": false
            },
            {
                "title": "Исходная ситуация",
                "map": "/images/24-12-malysheva-egorshinsky/initial_situation.jpg",
                "default": false
            },
            {
                "title": "Предложения Живых улиц",
                "map": "/images/24-12-malysheva-egorshinsky/living_streets_proposals.jpg",
                "default": false
            }
        ]
    },
    {
        "id": "24-04-amundsena-bypass",
        "title": "24-04 Амундсена объездная",
        "default": false,
        "maps": [
            {
                "title": "Проект",
                "map": "/images/24-04-amundsena-bypass/project.jpg",
                "default": true
            },
            {
                "title": "Предложения 2023",
                "map": "/images/24-04-amundsena-bypass/proposals_2023.jpg",
                "default": false
            },
            {
                "title": "Предложения 2024",
                "map": "/images/24-04-amundsena-bypass/proposals_2024.jpg",
                "default": false
            },
            {
                "title": "Предложения 2024 без БРТ",
                "map": "/images/24-04-amundsena-bypass/proposals_2024_without_brt.jpg",
                "default": false
            }
        ]
    },
    {
        "id": "23-07-tatischeva",
        "title": "23-07 Татищева",
        "default": false,
        "maps": [
            {
                "title": "Исходная ситуация",
                "map": "/images/23-07-tatischeva/initial_situation.jpg",
                "default": true
            },
            {
                "title": "Предложения Живых улиц",
                "map": "/images/23-07-tatischeva/living_streets_proposals.jpg",
                "default": false
            },
            {
                "title": "Проект",
                "map": "/images/23-07-tatischeva/project.jpg",
                "default": false
            }
        ]
    },
    {
        "id": "23-04-amundsena-bypass",
        "title": "23-04 Амундсена объездная",
        "default": false,
        "maps": [
            {
                "title": "Исходная ситуация",
                "map": "/images/23-04-amundsena-bypass/initial_situation.jpg",
                "default": true
            },
            {
                "title": "Предложения Живых улиц",
                "map": "/images/23-04-amundsena-bypass/living_streets_proposals.jpg",
                "default": false
            },
            {
                "title": "Проект",
                "map": "/images/23-04-amundsena-bypass/project.jpg",
                "default": false
            }
        ]
    },
    {
        "id": "23-02-naberezhnaya-iseti",
        "title": "23-02 Набережная Исети",
        "default": false,
        "maps": [
            {
                "title": "Предложения Живых улиц",
                "map": "/images/23-02-naberezhnaya-iseti/living_streets_proposals.jpg",
                "default": true
            },
            {
                "title": "Проект",
                "map": "/images/23-02-naberezhnaya-iseti/project.jpg",
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