import React, { useEffect, useState } from 'react';

interface Room {
    id: number;
    name: string;
    imageUrl: string;
    coLevel: number;
    temperature: number;
}

interface Conclusion {
    id: number;
    name: string;
    status: string;
}

const App: React.FC = () => {
    const rooms: Room[] = [
        {
            id: 1,
            name: 'Кімната 1',
            imageUrl: 'public/fire_room1.jpg',
            temperature: 65,
            coLevel: 80,
        },
        {
            id: 2,
            name: 'Кімната 2',
            imageUrl: 'public/fire_room2.jpg',
            temperature: 45,
            coLevel: 55,
        },
        {
            id: 3,
            name: 'Кімната 3',
            imageUrl: 'public/0_room.jpg',
            temperature: 35,
            coLevel: 30,
        },
        {
            id: 4,
            name: 'Кімната 4',
            imageUrl: 'public/fire_room4.jpg',
            temperature: 50,
            coLevel: 105,
        },
    ];

    const [conclusions, setConclusions] = useState<Conclusion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(1);

    const getRoomStatus = (room: Room): string => {
        if (room.temperature > 60 || room.coLevel > 100) {
            return 'Критична небезпека';
        } else if (room.temperature >= 40 || room.coLevel >= 50) {
            return 'Попередження';
        } else if (room.temperature < 40 && room.coLevel < 50) {
            return 'Все добре';
        } else {
            return 'Попередження';
        }
    };

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'Критична небезпека':
                return 'bg-red-500';
            case 'Все добре':
                return 'bg-green-500';
            case 'Попередження':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

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

    const totalTime = rooms.length * 1000;
    const steps = 99;
    const stepTime = totalTime / steps;

    useEffect(() => {
        let currentProgress = 1;
        setProgress(1);
        const interval = setInterval(() => {
            currentProgress++;
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(interval);
            }
            setProgress(currentProgress);
        }, stepTime);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6">Моніторинг пожежної небезпеки</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {rooms.map(room => (
                    <div key={room.id} className="bg-white shadow-md rounded p-4 flex flex-col items-center">
                        <img src={room.imageUrl} alt={room.name} className="w-full h-48 object-cover rounded mb-4" />
                        <h2 className="text-lg font-semibold mb-2">{room.name}</h2>
                        <p className="text-sm"><strong>Температура:</strong> {room.temperature}°C</p>
                        <p className="text-sm mb-2"><strong>Концентрація СО:</strong> {room.coLevel} ppm</p>
                        <div className={`w-4 h-4 rounded-full ${getStatusColor(getRoomStatus(room))}`} />
                    </div>
                ))}
            </div>
            <div className="bg-white shadow-md rounded p-4 mb-4">
                <h2 className="text-xl font-bold mb-4">Висновки</h2>
                <ul className="space-y-2">
                    {conclusions.map(conclusion => {
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
                                    <span className={`font-semibold ${textColor}`}>{conclusion.status}</span>
                                </p>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className="bg-white shadow-md rounded p-4">
                <h2 className="text-xl font-bold mb-4">Завантаження висновків</h2>
                <div className="relative w-full h-4 bg-gray-300 rounded mb-2 overflow-hidden">
                    <div className="absolute left-0 top-0 h-4 bg-blue-500" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
                </div>
                <p className="text-center">{progress}%</p>
            </div>
        </div>
    );
};

export default App;
