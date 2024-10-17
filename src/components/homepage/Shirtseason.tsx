import React from 'react';

const Shirtseason: React.FC = () => {
    const categories = [
        {
            title: 'Champions League',
            img: 'https://static1.cdn-subsidesports.com/2/media/pixiemedia/featureblocks/fblock/image//h/o/hompage500x500_cl2324b.jpg',
        },
        {
            title: 'Premier League',
            img: 'https://static1.cdn-subsidesports.com/2/media/pixiemedia/featureblocks/fblock/image//m/a/mag2-banner500x500_prem2425_5.jpg',
        },
        {
            title: 'Bundesliga',
            img: 'https://static1.cdn-subsidesports.com/2/media/pixiemedia/featureblocks/fblock/image//m/a/mag2-banner500x500_bundes2425_5.jpg',
        },
    ];

    return (
        <div className="px-20 py-10">
            <div className="grid grid-cols-3 gap-4"> {/* Grid adjusted for 3 columns */}
                {categories.map((category, index) => (
                    <div key={index} className="text-center">
                        <div className="relative w-full h-100 overflow-hidden"> {/* Same height as Shirtclub */}
                            <img
                                src={category.img}
                                alt={category.title}
                                className="w-full h-full object-cover transition duration-300 hover:scale-110"
                            />
                            <div className="absolute bottom-0 w-full bg-black bg-opacity-40 text-white text-lg p-2">
                                {category.title}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Shirtseason;
