import React, { useEffect, useState } from 'react';

interface Scenario {
    id: number;
    name: string;
    imageUrl: string;
    waterLevel: 'high' | 'normal' | null;
    tempLevel: 'high' | 'moderate' | 'medium' | null;
    snowLevel: 'heavy' | 'light' | 'none' | null;
    rainLevel: 'strong' | 'moderate' | 'none' | null;
    conclusion: string;
}

interface ConclusionDisplay {
    id: number;
    name: string;
    status: string;
}

const scenarios: Scenario[] = [
    {
        id: 1,
        name: 'Ситуація 1',
        imageUrl: '/images/scenario1.jpg',
        waterLevel: 'high',
        tempLevel: null,
        snowLevel: null,
        rainLevel: 'strong',
        conclusion: 'Евакуювати',
    },
    {
        id: 2,
        name: 'Ситуація 2',
        imageUrl: '/images/scenario2.jpg',
        waterLevel: 'high',
        tempLevel: 'high',
        snowLevel: 'heavy',
        rainLevel: 'moderate',
        conclusion: 'Евакуювати',
    },
    {
        id: 3,
        name: 'Ситуація 3',
        imageUrl: '/images/scenario3.jpg',
        waterLevel: 'high',
        tempLevel: 'moderate',
        snowLevel: 'heavy',
        rainLevel: 'moderate',
        conclusion: 'Посилити увагу',
    },
    {
        id: 4,
        name: 'Ситуація 4',
        imageUrl: '/images/scenario4.jpg',
        waterLevel: 'high',
        tempLevel: null,
        snowLevel: 'heavy',
        rainLevel: 'none',
        conclusion: 'Не турбуватися',
    },
    {
        id: 5,
        name: 'Ситуація 5',
        imageUrl: '/images/scenario5.jpg',
        waterLevel: 'high',
        tempLevel: null,
        snowLevel: 'light',
        rainLevel: 'none',
        conclusion: 'Не турбуватися',
    },
    {
        id: 6,
        name: 'Ситуація 6',
        imageUrl: '/images/scenario6.jpg',
        waterLevel: 'normal',
        tempLevel: 'moderate',
        snowLevel: 'heavy',
        rainLevel: 'strong',
        conclusion: 'Посилити увагу',
    },
    {
        id: 7,
        name: 'Ситуація 7',
        imageUrl: '/images/scenario7.jpg',
        waterLevel: 'normal',
        tempLevel: 'moderate',
        snowLevel: 'light',
        rainLevel: 'strong',
        conclusion: 'Не турбуватися',
    },
    {
        id: 8,
        name: 'Ситуація 8',
        imageUrl: '/images/scenario8.jpg',
        waterLevel: 'normal',
        tempLevel: 'moderate',
        snowLevel: 'light',
        rainLevel: 'moderate',
        conclusion: 'Не турбуватися',
    },
    {
        id: 9,
        name: 'Ситуація 9',
        imageUrl: '/images/scenario9.jpg',
        waterLevel: 'high',
        tempLevel: null,
        snowLevel: null,
        rainLevel: 'none',
        conclusion: 'Не турбуватися',
    },
];

const getWaterImage = (level: Scenario['waterLevel']) => {
    if (level === 'high') return '/public/water-high.png';
    if (level === 'normal') return '/public/water-low.png';
    return '';
};

const getTempImage = (level: Scenario['tempLevel']) => {
    if (level === 'high') return '/public/hot-temperature.png';
    if (level === 'moderate') return '/public/moderate-temperature.png';
    if (level === 'medium') return '/public/medium-temperature.png';
    return '';
};

const getSnowImage = (level: Scenario['snowLevel']) => {
    if (level === 'heavy') return '/public/heavy-snow.png';
    if (level === 'light') return '/public/light-snow.png';
    if (level === 'none') return '/public/cloud.png';
    return '';
};

const getRainImage = (level: Scenario['rainLevel']) => {
    if (level === 'strong') return '/public/strong-rain.png';
    if (level === 'moderate') return '/public/moderate-rain.png';
    if (level === 'none') return '/public/cloud.png';
    return '';
};

const translateWaterLevel = (level: Scenario['waterLevel']) => {
    if (level === 'high') return 'Високий рівень води';
    if (level === 'normal') return 'Нормальний рівень води';
    return null;
};

const translateTempLevel = (level: Scenario['tempLevel']) => {
    if (level === 'high') return 'Висока температура';
    if (level === 'moderate') return 'Помірна температура';
    if (level === 'medium') return 'Середня температура';
    return null;
};

const translateSnowLevel = (level: Scenario['snowLevel']) => {
    if (level === 'heavy') return 'Багато снігу';
    if (level === 'light') return 'Мало снігу';
    if (level === 'none') return 'Снігу немає';
    return null;
};

const translateRainLevel = (level: Scenario['rainLevel']) => {
    if (level === 'strong') return 'Сильний дощ';
    if (level === 'moderate') return 'Помірний дощ';
    if (level === 'none') return 'Дощ відсутній';
    return null;
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Евакуювати':
            return 'bg-red-500';
        case 'Посилити увагу':
            return 'bg-yellow-500';
        case 'Не турбуватися':
            return 'bg-green-500';
        default:
            return 'bg-gray-500';
    }
};

const App: React.FC = () => {
    const [conclusions, setConclusions] = useState<ConclusionDisplay[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(1);
    const SCENARIO_DURATION = 2500;
    const totalTime = scenarios.length * SCENARIO_DURATION;
    const steps = 99;
    const stepTime = totalTime / steps;

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | undefined;
        if (isPlaying && currentIndex < scenarios.length) {
            timer = setTimeout(() => {
                const scenario = scenarios[currentIndex];
                setConclusions((prev) => [
                    ...prev,
                    { id: scenario.id, name: scenario.name, status: scenario.conclusion },
                ]);
                setCurrentIndex((prevIndex) => prevIndex + 1);
            }, SCENARIO_DURATION);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isPlaying, currentIndex]);

    useEffect(() => {
        if (!isPlaying) return;
        let currentProgress = Math.round(currentIndex / scenarios.length * 100);
        const interval = setInterval(() => {
            currentProgress++;
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(interval);
            }
            setProgress(currentProgress);
        }, stepTime);
        return () => clearInterval(interval);
    }, [currentIndex, isPlaying, stepTime]);

    const handlePlay = () => {
        if (currentIndex >= scenarios.length) {
            setConclusions([]);
            setCurrentIndex(0);
            setProgress(1);
        }
        setIsPlaying(true);
    };

    const handlePause = () => {
        setIsPlaying(false);
    };

    const currentScenario: Scenario | undefined = currentIndex < scenarios.length
        ? scenarios[currentIndex]
        : undefined;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-4">Моніторинг погодних умов</h1>
            <div className="flex space-x-2 mb-6">
                <button
                    onClick={handlePlay}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Play
                </button>
                <button
                    onClick={handlePause}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                    Pause
                </button>
            </div>

            {currentScenario ? (
                <div className="bg-white shadow-md rounded p-4 flex flex-col items-center mb-8">
                    <h2 className="text-xl font-bold mb-4">{`Ситуація ${currentIndex + 1}`}</h2>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {translateWaterLevel(currentScenario.waterLevel) && (
                            <div className="flex flex-col items-center border p-2 rounded">
                                <img
                                    src={getWaterImage(currentScenario.waterLevel)}
                                    alt={`water-${currentScenario.waterLevel}`}
                                    className="w-24 h-24 mb-1"
                                />
                                <p className="text-sm">
                                    {translateWaterLevel(currentScenario.waterLevel)}
                                </p>
                            </div>
                        )}

                        {translateTempLevel(currentScenario.tempLevel) && (
                            <div className="flex flex-col items-center border p-2 rounded">
                                <img
                                    src={getTempImage(currentScenario.tempLevel)}
                                    alt={`temperature-${currentScenario.tempLevel}`}
                                    className="w-24 h-24 mb-1"
                                />
                                <p className="text-sm">
                                    {translateTempLevel(currentScenario.tempLevel)}
                                </p>
                            </div>
                        )}

                        {translateSnowLevel(currentScenario.snowLevel) && (
                            <div className="flex flex-col items-center border p-2 rounded">
                                <img
                                    src={getSnowImage(currentScenario.snowLevel)}
                                    alt={`snow-${currentScenario.snowLevel}`}
                                    className="w-24 h-24 mb-1"
                                />
                                <p className="text-sm">
                                    {translateSnowLevel(currentScenario.snowLevel)}
                                </p>
                            </div>
                        )}

                        {translateRainLevel(currentScenario.rainLevel) && (
                            <div className="flex flex-col items-center border p-2 rounded">
                                <img
                                    src={getRainImage(currentScenario.rainLevel)}
                                    alt={`rain-${currentScenario.rainLevel}`}
                                    className="w-24 h-24 mb-1"
                                />
                                <p className="text-sm">
                                    {translateRainLevel(currentScenario.rainLevel)}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-white shadow-md rounded p-4 mb-8">
                    <h2 className="text-xl font-bold mb-2">Усі ситуації завершено</h2>
                    <p className="text-gray-600">Натисніть "Play", щоб почати спочатку.</p>
                </div>
            )}

            <div className="bg-white shadow-md rounded p-4 mb-4">
                <h2 className="text-xl font-bold mb-4">Висновки</h2>
                <ul className="space-y-2">
                    {conclusions.map((c) => {
                        const colorClass = getStatusColor(c.status);
                        return (
                            <li key={c.id} className="flex items-center">
                <span
                    className={`inline-block w-4 h-4 mr-2 rounded-full ${colorClass}`}
                ></span>
                                <p>
                                    <strong>{c.name}:</strong> {c.status}
                                </p>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="bg-white shadow-md rounded p-4 mb-4">
                <h2 className="text-xl font-bold mb-4">Прогрес симуляції</h2>
                <div className="relative w-full h-4 bg-gray-300 rounded mb-2 overflow-hidden">
                    <div
                        className="absolute left-0 top-0 h-4 bg-blue-500"
                        style={{
                            width: `${progress}%`,
                            transition: 'width 0.3s linear',
                        }}
                    />
                </div>
                <p className="text-center">{progress}%</p>
            </div>
        </div>
    );
};

export default App;
