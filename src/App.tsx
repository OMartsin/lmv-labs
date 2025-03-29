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

    // Мінімум і максимум для атрибутів min/max
    const minCapacity = busTypes.reduce((acc, bus) => acc + bus.kMin * bus.capacity, 0);
    const maxCapacity = busTypes.reduce((acc, bus) => acc + bus.kMax * bus.capacity, 0);

    const handleCalculate = () => {
        setError("");
        if (peopleCount <= 0) {
            setError("Введіть додатне число пасажирів.");
            setBestCombo(null);
            return;
        }
        const result = findBestCombination(peopleCount, busTypes);
        if(minCapacity > peopleCount) {
            setError(`Мінімальна кількість пасажирів: ${minCapacity}`);
            setBestCombo(null);
            return;
        }
        if(maxCapacity < peopleCount) {
            setError(`Максимальна кількість пасажирів: ${maxCapacity}`);
            setBestCombo(null);
            return;
        }
        setBestCombo(result);
    };

    return (
        // Фон для сторінки
        <div className="min-h-screen bg-gradient-to-br from-green-200 via-green-100 to-blue-200 p-6">
            {/* Напівпрозорий білий блок */}
            <div className="max-w-[1300px] mx-auto bg-white/80 backdrop-blur-md shadow-2xl rounded-xl p-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
                    Розрахунок логістичного ресурсу
                </h1>

                <div className="bg-white/70 shadow-md rounded p-4 mb-4">
                    <label className="block text-lg font-semibold mb-2 text-gray-700">
                        Кількість людей, яких потрібно перевезти:
                    </label>
                    <input
                        type="number"
                        value={peopleCount}
                        onChange={(e) => setPeopleCount(Number(e.target.value))}
                        min={minCapacity}
                        max={maxCapacity}
                        className="border border-gray-300 rounded p-2 w-full mb-4
                                   focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <button
                        className="px-4 py-2 rounded text-white
                                   bg-gradient-to-r from-purple-500 to-indigo-500
                                   hover:from-purple-600 hover:to-indigo-600
                                   transition-colors duration-300 shadow-lg"
                        onClick={handleCalculate}
                    >
                        Розрахувати
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 border border-red-400 rounded mb-4">
                        {error}
                    </div>
                )}

                {bestCombo && (
                    <div className="bg-white/70 shadow-md rounded p-4">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">
                            Результати
                        </h2>
                        <p className="mb-2 text-gray-700">
                            Використано автобусів:{" "}
                            <strong>{bestCombo.busesUsed}</strong>
                        </p>
                        <p className="mb-2 text-gray-700">
                            Залишилось порожніх місць:{" "}
                            <strong>{bestCombo.leftover}</strong>
                        </p>

                        <div className="overflow-x-auto mt-4">
                            {/**
                             * Нова стилізація таблиці:
                             * border-separate для відступів між клітинками,
                             * border-spacing для відстаней,
                             * закруглення в thead і hover-ефекти на рядках.
                             */}
                            <table
                                className="min-w-full border-separate table-auto"
                                style={{ borderSpacing: "0 1rem" }}
                            >
                                <thead>
                                <tr className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-md">
                                    <th className="px-4 py-3 text-left rounded-l-md">№</th>
                                    <th className="px-4 py-3 text-left">Ілюстрація</th>
                                    <th className="px-4 py-3 text-left">Тип автобуса</th>
                                    <th className="px-4 py-3 text-center">Використано автобусів</th>
                                    <th className="px-4 py-3 text-center rounded-r-md">
                                        Сумарно зайнятих місць
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {busTypes.map((bus, i) => {
                                    const countUsed = bestCombo.combination[i];
                                    if (countUsed === 0) return null;
                                    return (
                                        <tr
                                            key={bus.id}
                                            className="bg-white shadow-sm hover:shadow-lg transition-shadow"
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
                                            <td className="px-4 py-3">{bus.name}</td>
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

                        <div className="flex flex-col pt-6 text-gray-700">
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

function findBestCombination(
    peopleCount: number,
    busTypes: BusType[]
): BestCombination | null {
    let best: BestCombination | null = null;
    const maxCounts = busTypes.map(b => b.kMax);
    const minCounts = busTypes.map(b => b.kMin);
    const capacities = busTypes.map(b => b.capacity);
    function backtrack(i: number, used: number[], seatsSoFar: number, busesSoFar: number) {
        if (i === busTypes.length) {
            if (seatsSoFar >= peopleCount) {
                const leftover = seatsSoFar - peopleCount;
                if (
                    !best ||
                    leftover < best.leftover ||
                    (leftover === best.leftover && busesSoFar < best.busesUsed)
                ) {
                    best = {
                        leftover,
                        busesUsed: busesSoFar,
                        combination: [...used]
                    };
                }
            }
            return;
        }
        const cap = capacities[i];
        const minCount = minCounts[i];
        const maxCount = maxCounts[i];
        for (let count = 0; count <= maxCount; count++) {
            if (count > 0 && count < minCount) continue;
            used[i] = count;
            const newSeats = seatsSoFar + count * cap;
            const newBuses = busesSoFar + count;
            backtrack(i + 1, used, newSeats, newBuses);
            used[i] = 0;
        }
    }
    backtrack(0, Array(busTypes.length).fill(0), 0, 0);
    return best;
}


export default App;
