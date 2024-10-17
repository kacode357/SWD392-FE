import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchShirtApi } from '../../util/api';

const Shirtplayer: React.FC = () => {
    const [shirts, setShirts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const defaultImageUrl = 'https://images-cdn.ubuy.com.sa/65e14cc2c9e589405149a28b-error-404-costume-not-found-t-shirt.jpg';

    const fetchShirts = async () => {
        setLoading(true);
        const data = {
            pageNum: 1,
            pageSize: 5,
            keyWord: "",
            status: 1,
        };

        try {
            const response = await searchShirtApi(data);
            if (response?.pageData) {
                const formattedShirts = response.pageData
                    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 5)
                    .map((shirt: any) => ({
                        id: shirt.id,
                        playerId: shirt.playerId, // Lưu playerId
                        playerName: shirt.playerName,
                        imageUrl: shirt.urlImg && shirt.urlImg.startsWith('http') ? shirt.urlImg : defaultImageUrl,
                    }));

                setShirts(formattedShirts);
            }
        } catch (error) {
            console.error("Failed to fetch shirts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShirts();
    }, []);

    const handleShirtClick = (playerId: number, playerName: string) => {
        // Điều hướng tới trang Listshirt với playerId
        navigate(`/listshirt`, { state: { playerId, playerName } });
    };

    return (
        <div className="px-20 py-10">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid grid-cols-5 gap-6">
                    {shirts.map((shirt, index) => (
                        <div key={index} className="text-center" onClick={() => handleShirtClick(shirt.playerId, shirt.playerName)}>
                            <div className="relative w-full h-80 overflow-hidden cursor-pointer">
                                <img
                                    src={shirt.imageUrl}
                                    alt={shirt.playerName}
                                    className="w-full h-full object-cover transition duration-300 hover:scale-110"
                                />
                                <div className="absolute bottom-0 w-full bg-black bg-opacity-40 text-white text-lg p-2">
                                    {shirt.playerName}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Shirtplayer;
