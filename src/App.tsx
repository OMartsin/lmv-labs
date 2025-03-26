import React, { useState } from "react";

interface BusType {
    id: number;
    name: string;
    capacity: number;
    kMin: number;
    kMax: number;
    imageUrl: string;
}

const busTypes: BusType[] = [
    {
        id: 1,
        name: "Mercedes Sprinter",
        capacity: 12,
        kMin: 1,
        kMax: 12,
        imageUrl: "/public/sprinter.png"
    },
    {
        id: 2,
        name: "БАЗ «Волошка»",
        capacity: 15,
        kMin: 1,
        kMax: 5,
        imageUrl: "/public/voloshka.png"
    },
    {
        id: 3,
        name: "«Богдан» А-064",
        capacity: 17,
        kMin: 1,
        kMax: 6,
        imageUrl: "/public/bogdan-a064.png"
    },
    {
        id: 4,
        name: "AeroLAZ",
        capacity: 17,
        kMin: 1,
        kMax: 8,
        imageUrl: "/public/aerolaz.png"
    },
    {
        id: 5,
        name: "«Богдан» А-092",
        capacity: 18,
        kMin: 1,
        kMax: 2,
        imageUrl: "/public/bogdan-a092.png"
    },
    {
        id: 6,
        name: "«Богдан» А-091",
        capacity: 21,
        kMin: 1,
        kMax: 5,
        imageUrl: "/public/bogdan-a091.png"
    },
    {
        id: 7,
        name: "ЗАЗ A10C I-Ван",
        capacity: 23,
        kMin: 1,
        kMax: 2,
        imageUrl: "/public/zaz.png"
    }
];

interface BestCombination {
    leftover: number;
    busesUsed: number;
    combination: number[];
}

const App: React.FC = () => {
    const [peopleCount, setPeopleCount] = useState<number>(0);
    const [error, setError] = useState<string>("");
    const [bestCombo, setBestCombo] = useState<BestCombination | null>(null);

    // Мінімум і максимум для min/max у <input>
    const minCapacity = busTypes.reduce((acc, bus) => acc + bus.kMin * bus.capacity, 0);
    const maxCapacity = busTypes.reduce((acc, bus) => acc + bus.kMax * bus.capacity, 0);

    const handleCalculate = () => {
        setError("");
        if (peopleCount <= 0) {
            setError("Введіть додатне число пасажирів.");
            setBestCombo(null);
            return;
        }
        const result = optimizeTransport(peopleCount, busTypes);
        if (typeof result === "string") {
            setError(result);
            setBestCombo(null);
        } else {
            setBestCombo(result);
        }
    };

    return (
        // Темний градієнтний фон на всю сторінку
        <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6">
            {/* Напівпрозорий блок із темним фоном */}
            <div className="max-w-[1300px] mx-auto bg-white/5 backdrop-blur-md shadow-2xl rounded-xl p-8 text-gray-200">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    Розрахунок логістичного ресурсу
                </h1>

                <div className="bg-gray-900/40 shadow-md rounded p-4 mb-4">
                    <label className="block text-lg font-semibold mb-2">
                        Кількість людей, яких потрібно перевезти:
                    </label>
                    <input
                        type="number"
                        value={peopleCount}
                        onChange={(e) => setPeopleCount(Number(e.target.value))}
                        min={minCapacity}
                        max={maxCapacity}
                        className="border border-gray-700 bg-gray-800 text-gray-100 rounded p-2 w-full mb-4
                                   focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                    {/* Кнопка з блакитно-бірюзовим градієнтом */}
                    <button
                        className="px-4 py-2 rounded text-white
                                   bg-gradient-to-r from-cyan-600 to-teal-600
                                   hover:from-cyan-500 hover:to-teal-500
                                   transition-colors duration-300 shadow-lg"
                        onClick={handleCalculate}
                    >
                        Розрахувати
                    </button>
                </div>

                {error && (
                    <div className="bg-red-900/40 text-red-300 p-3 border border-red-500 rounded mb-4">
                        {error}
                    </div>
                )}

                {bestCombo && (
                    <div className="bg-gray-900/30 shadow-md rounded p-4">
                        <h2 className="text-2xl font-bold mb-4">
                            Результати
                        </h2>
                        <p className="mb-2">
                            Використано автобусів:{" "}
                            <strong>{bestCombo.busesUsed}</strong>
                        </p>
                        <p className="mb-2">
                            Залишилось порожніх місць:{" "}
                            <strong>{bestCombo.leftover}</strong>
                        </p>

                        <div className="overflow-x-auto mt-4">
                            {/* Темна стилізація таблиці */}
                            <table
                                className="min-w-full border-separate table-auto text-gray-200"
                                style={{ borderSpacing: "0 1rem" }}
                            >
                                <thead>
                                <tr className="bg-gray-800 text-gray-200">
                                    <th className="px-4 py-3 text-left rounded-l-md">№</th>
                                    <th className="px-4 py-3 text-left">Ілюстрація</th>
                                    <th className="px-4 py-3 text-left">Тип автобуса</th>
                                    <th className="px-4 py-3 text-center">Використано автобусів</th>
                                    <th className="px-4 py-3 text-center rounded-r-md">Сумарно зайнятих місць</th>
                                </tr>
                                </thead>
                                <tbody>
                                {busTypes.map((bus, i) => {
                                    const countUsed = bestCombo.combination[i];
                                    if (countUsed === 0) return null;
                                    return (
                                        <tr
                                            key={bus.id}
                                            className="bg-gray-800/40 hover:bg-gray-700/40 transition-colors"
                                        >
                                            <td className="px-4 py-3 rounded-l-md">
                                                {i + 1}
                                            </td>
                                            <td className="px-4 py-3">
                                                <img
                                                    src={bus.imageUrl}
                                                    alt={bus.name}
                                                    className="w-12 h-auto mx-auto"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                {bus.name}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {countUsed}
                                            </td>
                                            <td className="px-4 py-3 text-center rounded-r-md">
                                                {countUsed * bus.capacity}
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col pt-6">
                            <div>
                                Мінімальна кількість пасажирів: <strong>{minCapacity}</strong>
                            </div>
                            <div>
                                Максимальна кількість пасажирів: <strong>{maxCapacity}</strong>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Функція для обчислень (не змінюємо)
function optimizeTransport(
    Ncon: number,
    transportData: BusType[]
): BestCombination | string {
    const sumKmaxN = transportData.reduce((sum, t) => sum + t.capacity * t.kMax, 0);
    const sumKminN = transportData.reduce((sum, t) => sum + t.capacity * t.kMin, 0);

    if (Ncon > sumKmaxN) {
        return `Помилка: Недостатньо транспорту! Макс. місткість: ${sumKmaxN}, потрібно: ${Ncon}`;
    }

    const denominator = Ncon - sumKminN;
    if (denominator <= 0) {
        return `Помилка: Ncon < суми мінімальних місткостей (${Ncon} < ${sumKminN}). Перевірте вхідні дані.`;
    }

    const p = (sumKmaxN - sumKminN) / denominator;
    if (p <= 0) {
        return `Помилка: Некоректне значення p (${p}). Перевірте вхідні дані.`;
    }

    let totalCapacity = 0;
    const combination: number[] = [];

    transportData.forEach((t) => {
        const numerator = t.capacity * t.kMax + (p - 1) * t.capacity * t.kMin;
        const Ki = numerator / p;
        const Kt = Math.round(Ki / t.capacity);
        combination.push(Kt);
        totalCapacity += Kt * t.capacity;
    });

    while (totalCapacity < Ncon) {
        const smallest = transportData.reduce((prev, curr) =>
            curr.capacity < prev.capacity ? curr : prev
        );
        const index = transportData.findIndex((b) => b.id === smallest.id);
        combination[index] += 1;
        totalCapacity += smallest.capacity;
    }

    const leftover = totalCapacity - Ncon;
    const busesUsed = combination.reduce((acc, val) => acc + val, 0);

    return {
        leftover,
        busesUsed,
        combination
    };
}

export default App;
