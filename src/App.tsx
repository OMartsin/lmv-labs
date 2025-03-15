import React, { useState, useRef, useEffect } from "react";

interface BusType {
    id: number;
    name: string;
    capacity: number;
    kMax: number;
    imageUrl: string;
}

const busTypes: BusType[] = [
    {
        id: 1,
        name: "Mercedes Sprinter",
        capacity: 12,
        kMax: 12,
        imageUrl: "/public/sprinter.png"
    },
    {
        id: 2,
        name: "БАЗ «Волошка»",
        capacity: 15,
        kMax: 5,
        imageUrl: "/public/voloshka.png"
    },
    {
        id: 3,
        name: "«Богдан» А-064",
        capacity: 17,
        kMax: 6,
        imageUrl: "/public/bogdan-a064.png"
    },
    {
        id: 4,
        name: "AeroLAZ",
        capacity: 17,
        kMax: 8,
        imageUrl: "/public/aerolaz.png"
    },
    {
        id: 5,
        name: "«Богдан» А-092",
        capacity: 18,
        kMax: 2,
        imageUrl: "/public/bogdan-a092.png"
    },
    {
        id: 6,
        name: "«Богдан» А-091",
        capacity: 21,
        kMax: 5,
        imageUrl: "/public/bogdan-a091.png"
    },
    {
        id: 7,
        name: "ЗАЗ A10C I-Ван",
        capacity: 23,
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

    const busWidth = 100;
    const busHeight = 70;
    const margin = 4;
    const canvasWidth = 1230;

    const [canvasHeight, setCanvasHeight] = useState<number>(250);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const handleCalculate = () => {
        setError("");
        if (peopleCount <= 0) {
            setError("Введіть додатне число пасажирів.");
            setBestCombo(null);
            return;
        }
        const result = findBestCombination(peopleCount, busTypes);
        if (!result) {
            setError("Неможливо перевезти таку кількість пасажирів із наявним транспортом.");
            setBestCombo(null);
        } else {
            setBestCombo(result);
        }
    };

    useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        if (!bestCombo) return;

        const totalBusesUsed = bestCombo.combination.reduce((acc, c) => acc + c, 0);

        const rowCapacity = Math.floor(canvasWidth / (busWidth + margin));
        const lines = Math.ceil(totalBusesUsed / rowCapacity);
        // Обчислюємо необхідну висоту (з урахуванням відступів)
        const neededHeight = lines * (busHeight + margin) + margin;

        // Обмежуємо висоту 250 px
        const finalHeight = neededHeight > 250 ? neededHeight : 250;
        setCanvasHeight(finalHeight);

        // Очищаємо і перевстановлюємо розмір canvas
        canvasRef.current.width = canvasWidth;
        canvasRef.current.height = finalHeight;
        ctx.clearRect(0, 0, canvasWidth, finalHeight);

        let xPos = margin;
        let yPos = margin;

        // Малюємо всі автобуси
        const drawAllBuses = async () => {
            for (let i = 0; i < busTypes.length; i++) {
                const countUsed = bestCombo.combination[i];
                if (countUsed === 0) continue;

                for (let c = 0; c < countUsed; c++) {
                    const img = await loadImage(busTypes[i].imageUrl);
                    ctx.drawImage(img, xPos, yPos, busWidth, busHeight);

                    xPos += busWidth + margin;
                    if (xPos + busWidth + margin > canvasWidth) {
                        xPos = margin;
                        yPos += busHeight + margin;
                    }
                }
            }
        };
        drawAllBuses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bestCombo]);

    return (
        <div className="max-w-[1300px] mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Оптимальний розподіл автобусів</h1>

            <div className="bg-white shadow rounded p-4 mb-4">
                <label className="block text-lg font-semibold mb-2">
                    Кількість людей, яких потрібно перевезти:
                </label>
                <input
                    type="number"
                    value={peopleCount}
                    onChange={(e) => setPeopleCount(Number(e.target.value))}
                    className="border border-gray-300 rounded p-2 w-full mb-4"
                />
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
                <div className="bg-white shadow rounded p-4">
                    <h2 className="text-2xl font-bold mb-4">Результати</h2>
                    <p className="mb-2">
                        Використано автобусів: <strong>{bestCombo.busesUsed}</strong>
                    </p>
                    <p className="mb-2">
                        Залишилось порожніх місць: <strong>{bestCombo.leftover}</strong>
                    </p>

                    <div
                        className={`mb-4 ${canvasHeight > 250 ? "overflow-y-auto" : ""}`}
                        style={{ width: canvasWidth, maxHeight: 250, border: "1px solid #ccc" }}
                    >
                        <canvas ref={canvasRef} />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full border">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="px-3 py-2 border">№</th>
                                <th className="px-3 py-2 border">Тип автобуса</th>
                                <th className="px-3 py-2 border">Використано автобусів</th>
                                <th className="px-3 py-2 border">Сумарно зайнятих місць</th>
                            </tr>
                            </thead>
                            <tbody>
                            {busTypes.map((bus, i) => {
                                const countUsed = bestCombo.combination[i];
                                if (countUsed === 0) return null;
                                return (
                                    <tr key={bus.id}>
                                        <td className="px-3 py-2 border">{i + 1}</td>
                                        <td className="px-3 py-2 border">{bus.name}</td>
                                        <td className="px-3 py-2 border">{countUsed}</td>
                                        <td className="px-3 py-2 border">{countUsed * bus.capacity}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
}

/**
 * Пошук оптимальної комбінації автобусів:
 * - Сумарна місткість >= peopleCount
 * - Мінімальний залишок місць
 * - При однаковому залишку – мінімальна кількість автобусів
 */
function findBestCombination(
    peopleCount: number,
    busTypes: BusType[]
): BestCombination | null {
    let best: BestCombination | null = null;

    const maxCounts = busTypes.map((b) => b.kMax);
    const capacities = busTypes.map((b) => b.capacity);

    function backtrack(
        i: number,
        used: number[],
        seatsSoFar: number,
        busesSoFar: number
    ) {
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

        const limit = maxCounts[i];
        const cap = capacities[i];

        for (let count = 0; count <= limit; count++) {
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
