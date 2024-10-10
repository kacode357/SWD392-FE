import React from 'react';

const Shirtclub: React.FC = () => {
    const clubs = [
        {
            name: "Arsenal",
            imageUrl: "https://static1.cdn-subsidesports.com/2/media/pixiemedia/featureblocks/fblock/image//a/r/arsenal_calafiori_shirt_2.jpg"
        },
        {
            name: "Bayern Munich",
            imageUrl: "https://static1.cdn-subsidesports.com/2/media/pixiemedia/featureblocks/fblock/image//b/a/bayern_munich_neuer_goalkeeper_jersey.jpg"
        },
        {
            name: "Liverpool",
            imageUrl: "https://static1.cdn-subsidesports.com/2/media/pixiemedia/featureblocks/fblock/image//l/i/liverpool_away_szoboszlai_shirt_5.jpg"
        },
        {
            name: "Barcelona",
            imageUrl: "https://static1.cdn-subsidesports.com/2/media/pixiemedia/featureblocks/fblock/image//b/a/barcelona_lamine_yamal_kit_9.jpg"
        },
        {
            name: "Real Madrid",
            imageUrl: "https://static1.cdn-subsidesports.com/2/media/pixiemedia/featureblocks/fblock/image//r/e/real_madrid_mbappe_champions_league_kit_4.jpg"
        }
    ];

    return (
        <div className="px-20 py-10">
            <div className="grid grid-cols-5 gap-6"> {/* Increased gap for larger images */}
                {clubs.map((club, index) => (
                    <div key={index} className="text-center">
                        <div className="relative w-full h-80 overflow-hidden"> {/* Increased height */}
                            <img
                                src={club.imageUrl}
                                alt={club.name}
                                className="w-full h-full object-cover transition duration-300 hover:scale-110"
                            />
                            <div className="absolute bottom-0 w-full bg-black bg-opacity-40 text-white text-lg p-2">
                                {club.name}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Shirtclub;
