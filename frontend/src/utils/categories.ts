const categories = [
    {
        name: "ТЭНы",
        value: "heating-elements",
        //размер {длинна, диаметр трубки(13.5мм, 10мм, 8.5мм. 6.5мм), диаметр штутцера(10мм, 12мм, 14мм, 16мм, 18мм, 1/2дюйма, 22мм)}
        //мощность {0,25 - 15 kw}
        //конфигурация: {бублик, скрепка, U-образные, прямые}
        types: [
            {
                name: "Воздушные ТЭНы",
                value: "heating-elements/air",
                purposes: [
                    {name: "Для водонагревателей", value: 'heating-elements/air/waterheat'},
                    {name: "Для плит", value: 'heating-elements/air/plita'},
                    {name: "Для духовок", value: 'heating-elements/air/duhovka'},
                    {name: "Для саун", value: 'heating-elements/air/sauna'},
                    {name: "Для промышленных установок", value: 'heating-elements/air/promishslennost'},
                    {name: "Прочее", value: 'heating-elements/air/another'}
                ]
            },
            {
                name: "Водяные ТЭНы",
                value: "heating-elements/water",
                purposes: [
                    {name: "Для водонагревателей", value: 'heating-elements/water/waterheat'},
                    {name: "Для электрокотлов", value: 'heating-elements/water/elektrokotly'},
                    {name: "Для стиральных машин", value: 'heating-elements/water/stiralki'},
                    {name: "Для чугунных и алюминиевых батарей", value: 'heating-elements/water/batarei'},
                    {name: "Для промышленных установок", value: 'heating-elements/water/promishslennost'},
                    {name: "Прочее", value: 'heating-elements/water/another'}

                ]
            }
        ]
    },
    {
        name: "Измерительные приборы",
        value: "measuring",
        types: [
            {
                name: "Терморегуляторы",
                //температура (0 - 40 - 85 - 90 - 120 - 150 - 200 - 300 - 320 -350 - 400 цельсия)
                //мощность разное
                //сила тока разное
                value: "measuring/termostats",
                purposes: [
                    {name: "Для духовок", value: 'measuring/termostats/duhovki'},
                    {name: "Для водонагревателей", value: 'measuring/termostats/waterheat'},
                    {name: "Для электрокотлов", value: 'measuring/termostats/elektrokotly'},
                    {name: "Для холодильников", value: 'measuring/termostats/holodolniki'},
                    {name: "Для инкубаторов", value: 'measuring/termostats/inkubators'},
                    {name: "Для промышленных целей", value: 'measuring/termostats/promishslennost'},
                    {name: "Прочее", value: 'measuring/termostats/another'}
                ]
            },
            {
                name: "Термометры",
                //температура (0 -80 -120 -150 -250 -300 -400 -500 цельсия)
                value: "measuring/thermometers",
                purposes: [
                    {name: "Для электрокотлов", value: 'measuring/thermometers/elektrokotly'},
                    {name: "Для водонагревателей", value: 'measuring/thermometers/waterheat'},
                    {name: "Для духовых шкафов", value: 'measuring/thermometers/duhovie_shkafy'},
                    {name: "Прочее", value: 'measuring/thermometers/another'}
                ]
            },
            {
                name: "Манометры",
                //давление разное
                //диаметр разное
                value: "measuring/manometers",
                purposes: []
            },
            {
                name: "Термоманометры",
                //давление разное
                //диаметр разное
                //температура разное
                value: "measuring/termomanometers",
                purposes: []
            },
        ]
    },
    {
        name: "Управляющие приборы",
        value: "control",
        types: [
            {
                name: "Переключатели",
                //размер разное
                //конфигурация разное
                value: "control/switchers",
                purposes: [
                    {name: "Для духовок", value: 'control/switchers/duhovki'},
                    {name: "Для электроплит", value: 'control/switchers/eletroplity'},
                    {name: "Для тепловентиляторов", value: 'control/switchers/teploventilatori'},
                    {name: "Прочее", value: 'control/switchers/another'}
                ]
            },
            {
                name: "Таймеры",
                value: "control/timers",
                //время разное
                purposes: [
                    {name: "Для духовок", value: 'control/timers/duhovki'},
                    {name: "Для электрокотлов", value: 'control/timers/elektroplity'},
                    {name: "Для инкубаторов", value: 'control/timers/inkabotori'},
                    {name: "Для электроплит", value: 'control/timers/elektroplity'},
                    {name: "Для тепловентиляторов ", value: 'control/timers/teploventilatori'},
                    {name: "Для промышленных целей", value: 'control/timers/promishlennost'},
                    {name: "Прочее", value: 'control/timers/another'}
                ]
            }
        ]
    },
    {
        name: "Резервное энергоснабжение",
        value: "energy",
        types: [
            {
                name: "Солнечные панели",
                //мощность разное
                //размер разное
                //напряжение {12 24 36}
                value: "energy/solar",
                purposes: []
            },
            {
                name: "Контроллеры",
                //токи разное
                //напряжение разное
                value: "energy/controllers",
                purposes: []
            },
            {
                name: "Инверторы (ИБП)",
                //мощность разное
                //напряжения аккумуляторов {12, 24, 36, 48}
                value: "energy/invertors",
                purposes: []
            }
        ],
    },
    {
        name: "Аноды",
        // резьба M4 M5 M6 M8
        // длинна разное
        // диаметр разное
        value: "anodes",
        types:[]
    },
    {
        name: "Фланцы",
        //тип разное
        value: "flanges",
        types:[],
        purposes:[
            {name: "Для водонагревателей", value: 'measuring/thermometers/waterheat'}
        ]
    },
    {
        name: "Прокладки",
        // конфигурация {круглая, овальная}
        // материал {резина, селикон}
        value: "gaskets",
        types:[],
        purposes:[
            {name: "Для водонагревателей", value: 'measuring/thermometers/waterheat'},
            {name: "Для водяных тэнов", value: 'measuring/thermometers/waterheat'}
        ]
    },
    {
        name: "Пусковые реле",
        // токи {0.4, 0.5, 0.9, 1.4}
        value: "relays",
        types:[],
        purposes:[
            {name: "Для холодильников", value: 'measuring/thermometers/waterheat'},
            {name: "Для морозильников", value: 'measuring/thermometers/waterheat'}
        ]
    },

]

export default categories