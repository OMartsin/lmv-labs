import React, { useEffect, useState } from 'react';

interface Room {
    id: number;
    name: string;
    imageUrl: string;
    waterLevel: number;   // рівень води (м)
    waterSpeed: number;  // швидкість зміни рівня (м/хв)
}

interface Conclusion {
    id: number;
    name: string;
    status: string;
}

const App: React.FC = () => {
    // Хардкоджені дані кімнат
    const rooms: Room[] = [
        {
            id: 1,
            name: 'Кімната 1',
            imageUrl: 'public/12_flooded_room.jpg',
            waterLevel: 1.2,
            waterSpeed: 0.0,
        },
        {
            id: 2,
            name: 'Кімната 2',
            imageUrl: 'public/05_flooded_room.jpg',
            waterLevel: 0.5,
            waterSpeed: 0.2,
        },
        {
            id: 3,
            name: 'Кімната 3',
            imageUrl: 'public/05_flooded_room_2.jpg',
            waterLevel: 0.5,
            waterSpeed: 0.05,
        },
        {
            id: 4,
            name: 'Кімната 4',
            imageUrl: 'public/0_room.jpg',
            waterLevel: 0,
            waterSpeed: 0,
        },
    ];

    // Стан з висновками (статусами), які поступово додаються
    const [conclusions, setConclusions] = useState<Conclusion[]>([]);

    // Зберігаємо індекс кімнати, яку будемо додавати наступною
    const [currentIndex, setCurrentIndex] = useState(0);

    // Стан прогресу (від 1% до 100%)
    const [progress, setProgress] = useState(1);

    // Визначаємо статус кімнати за хардкодженими правилами
    const getRoomStatus = (room: Room): string => {
        const { waterLevel, waterSpeed } = room;
        // Правила:
        // 1. Якщо waterLevel > 1 -> 'Тривога'
        // 2. Якщо 0 < waterLevel < 1 і waterSpeed > 0.1 -> 'Тривога'
        // 3. Якщо 0 < waterLevel < 1 і waterSpeed < 0.1 -> 'Попередження'
        // 4. Якщо waterLevel === 0 і waterSpeed === 0 -> 'Все добре'
        // 5. Інакше -> 'Попередження'
        if (waterLevel > 1) {
            return 'Потрібна евакуація';
        } else if (waterLevel > 0 && waterLevel < 1 && waterSpeed > 0.1) {
            return 'Потрібна евакуація';
        } else if (waterLevel > 0 && waterLevel < 1 && waterSpeed < 0.1) {
            return 'Потрібно звернути увагу';
        } else if (waterLevel === 0 && waterSpeed === 0) {
            return 'Все добре';
        } else {
            return 'Потрібно звернути увагу';
        }
    };

    // Колір фону для кожного статусу
    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'Потрібна евакуація':
                return 'bg-red-500';
            case 'Все добре':
                return 'bg-green-500';
            case 'Потрібно звернути увагу':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    // Покрокове додавання статусів: що 1 секунду додаємо по одній кімнаті
    useEffect(() => {
        if (currentIndex < rooms.length) {
            const timer = setTimeout(() => {
                const room = rooms[currentIndex];
                const status = getRoomStatus(room);
                setConclusions((prev) => [
                    ...prev,
                    { id: room.id, name: room.name, status },
                ]);
                setCurrentIndex((prevIndex) => prevIndex + 1);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [currentIndex]);

    // Налаштування загальної тривалості (враховуємо, що кожна кімната дає 1 секунду таймауту)
    const totalTime = rooms.length * 1000; // у мілісекундах (4 кімнати -> 4 сек)
    // Кількість кроків, які будемо здійснювати, щоб заповнити прогрес з 1% до 100%
    const steps = 99; // оскільки починаємо з 1, а завершити хочемо на 100
    const stepTime = totalTime / steps;

    // Плавний рух Progress Bar від 1% до 100%
    useEffect(() => {
        let currentProgress = 1;
        setProgress(1);

        const interval = setInterval(() => {
            currentProgress++;
            // Якщо дійшли до 100%, зупиняємо
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(interval);
            }
            setProgress(currentProgress);
        }, stepTime);

        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6">Моніторинг рівня затоплення</h1>

            {/* Відображення карток кімнат у верхній частині */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {rooms.map((room) => (
                    <div
                        key={room.id}
                        className="bg-white shadow-md rounded p-4 flex flex-col items-center"
                    >
                        <img
                            src={room.imageUrl}
                            alt={room.name}
                            className="w-full h-48 object-cover rounded mb-4"
                        />
                        <h2 className="text-lg font-semibold mb-2">{room.name}</h2>
                        <p className="text-sm">
                            <strong>Рівень води:</strong> {room.waterLevel} м
                        </p>
                        <p className="text-sm mb-2">
                            <strong>Швидкість зміни:</strong> {room.waterSpeed} м/хв
                        </p>
                    </div>
                ))}
            </div>

            {/* Висновки */}
            <div className="bg-white shadow-md rounded p-4 mb-4">
                <h2 className="text-xl font-bold mb-4">Висновки</h2>
                <ul className="space-y-2">
                    {conclusions.map((conclusion) => {
                        const colorClass = getStatusColor(conclusion.status);
                        const textColor =
                            colorClass === 'bg-red-500'
                                ? 'text-red-600'
                                : colorClass === 'bg-green-500'
                                    ? 'text-green-600'
                                    : 'text-yellow-600';

                        return (
                            <li key={conclusion.id}>
                                <p>
                                    <strong>{conclusion.name}:</strong>{' '}
                                    <span className={`font-semibold ${textColor}`}>
                    {conclusion.status}
                  </span>
                                </p>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Прогрес завантаження (Progress Bar) */}
            <div className="bg-white shadow-md rounded p-4">
                <h2 className="text-xl font-bold mb-4">Завантаження висновків</h2>
                <div className="relative w-full h-4 bg-gray-300 rounded mb-2 overflow-hidden">
                    {/* Заповнена частина progress bar */}
                    <div
                        className="absolute left-0 top-0 h-4 bg-blue-500"
                        style={{
                            width: `${progress}%`,
                            transition: 'width 0.1s linear'  // робимо плавний перехід
                        }}
                    ></div>
                </div>
                <p className="text-center">{progress}%</p>
            </div>
        </div>
    );
};

export default App;
