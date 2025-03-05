import { useState } from 'react';

const App = () => {
    const [rooms, setRooms] = useState([
        { id: 1, name: 'Кімната 1', status: 0 },
        { id: 2, name: 'Кімната 2', status: 0 },
        { id: 3, name: 'Кімната 3', status: 0 },
        { id: 4, name: 'Кімната 4', status: 0 },
        { id: 5, name: 'Кімната 5', status: 0 },
    ]);

    const [selectedRoom, setSelectedRoom] = useState({
        id: 0,
        name: '',
        status: 0
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState('home');

    const hasAlarm = rooms.some(room => room.status === 2);

    const updateRoomStatus = (status: number) => {
        if (selectedRoom) {
            const updatedRooms = rooms.map(room =>
                room.id === selectedRoom.id ? { ...room, status } : room
            );
            setRooms(updatedRooms);
            setIsModalOpen(false);
        }
    };

    // Отримання кольору статусу
    const getStatusColor = (status: number) => {
        switch(status) {
            case 0: return 'bg-green-500';
            case 1: return 'bg-yellow-500';
            case 2: return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    // Отримання назви статусу
    const getStatusName = (status: number) => {
        switch(status) {
            case 0: return 'Все добре';
            case 1: return 'Потрібно звернути увагу';
            case 2: return 'Тривога';
            default: return 'Невідомо';
        }
    };

    // Компонент головної сторінки
    const HomePage = () => (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Моніторинг затоплення приміщень</h1>

            {hasAlarm && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <p className="font-bold">⚠️ УВАГА! В одному або кількох приміщеннях виявлено тривожний стан!</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rooms.map(room => (
                    <div
                        key={room.id}
                        className="border rounded p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                            setSelectedRoom(room);
                            setIsModalOpen(true);
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-medium">{room.name}</h2>
                            <div className={`${getStatusColor(room.status)} w-4 h-4 rounded-full`}></div>
                        </div>
                        <p className="mt-2">{getStatusName(room.status)}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    // Компонент сторінки інформації
    const InfoPage = () => (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Інформація про систему</h1>
            <div className="bg-gray-50 p-4 rounded border">
                <h2 className="text-lg font-medium mb-2">Про систему моніторингу</h2>
                <p className="mb-4">
                    Система моніторингу затоплення приміщень дозволяє оперативно відстежувати стан різних приміщень
                    та реагувати на потенційні проблеми.
                </p>
                <h3 className="font-medium mb-2">Типи станів:</h3>
                <ul className="list-disc pl-5 mb-4">
                    <li className="mb-1">
                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                        <strong>Все добре</strong> - приміщення в нормальному стані
                    </li>
                    <li className="mb-1">
                        <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                        <strong>Потрібно звернути увагу</strong> - виявлено незначні відхилення
                    </li>
                    <li className="mb-1">
                        <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                        <strong>Тривога</strong> - виявлено критичну ситуацію, потрібне негайне втручання
                    </li>
                </ul>
            </div>
        </div>
    );

    // Компонент сторінки контактів
    const ContactPage = () => (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Контакти для екстрених ситуацій</h1>
            <div className="bg-gray-50 p-4 rounded border">
                <div className="mb-4">
                    <h2 className="text-lg font-medium">Аварійна служба</h2>
                    <p className="text-lg">📞 0-800-123-456</p>
                </div>
                <div className="mb-4">
                    <h2 className="text-lg font-medium">Технічна підтримка</h2>
                    <p className="text-lg">📞 0-800-999-000</p>
                </div>
                <div>
                    <h2 className="text-lg font-medium">Електронна пошта</h2>
                    <p className="text-lg">✉️ support@floodmonitor.com</p>
                </div>
            </div>
        </div>
    );

    // Компонент модального вікна
    const StatusModal = () => {
        if (!selectedRoom) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                    <h2 className="text-xl font-bold mb-4">{selectedRoom.name} - Статус</h2>

                    <div className="mb-6">
                        <p className="mb-2 font-medium">Поточний статус:</p>
                        <div className="flex items-center">
                            <div className={`${getStatusColor(selectedRoom.status)} w-4 h-4 rounded-full mr-2`}></div>
                            <span>{getStatusName(selectedRoom.status)}</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="mb-2 font-medium">Змінити статус:</p>
                        <div className="grid grid-cols-1 gap-2">
                            <button
                                className="p-2 bg-green-100 hover:bg-green-200 rounded flex items-center"
                                onClick={() => updateRoomStatus(0)}
                            >
                                <div className="bg-green-500 w-4 h-4 rounded-full mr-2"></div>
                                Все добре
                            </button>

                            <button
                                className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded flex items-center"
                                onClick={() => updateRoomStatus(1)}
                            >
                                <div className="bg-yellow-500 w-4 h-4 rounded-full mr-2"></div>
                                Потрібно звернути увагу
                            </button>

                            <button
                                className="p-2 bg-red-100 hover:bg-red-200 rounded flex items-center"
                                onClick={() => updateRoomStatus(2)}
                            >
                                <div className="bg-red-500 w-4 h-4 rounded-full mr-2"></div>
                                Тривога
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Закрити
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Навігація */}
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex space-x-4 items-center">
                            <div className="font-bold text-lg">Система моніторингу</div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                className={`px-3 py-2 rounded ${currentPage === 'home' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                                onClick={() => setCurrentPage('home')}
                            >
                                Головна
                            </button>
                            <button
                                className={`px-3 py-2 rounded ${currentPage === 'info' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                                onClick={() => setCurrentPage('info')}
                            >
                                Інформація
                            </button>
                            <button
                                className={`px-3 py-2 rounded ${currentPage === 'contact' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                                onClick={() => setCurrentPage('contact')}
                            >
                                Контакти
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Основний контент */}
            <main className="max-w-7xl mx-auto bg-white shadow rounded-lg my-6">
                {currentPage === 'home' && <HomePage />}
                {currentPage === 'info' && <InfoPage />}
                {currentPage === 'contact' && <ContactPage />}
            </main>

            {/* Модальне вікно */}
            {isModalOpen && <StatusModal />}
        </div>
    );
};

export default App;