import React from 'react';
import { Card, Button } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';

interface ShirtProps {
    id: number;
    name: string;
    price: string;
    salePrice: string;
    imageUrl: string;
    isLiked: boolean;
}

const shirts: ShirtProps[] = [
    {
        id: 1,
        name: 'Nike Liverpool Dri-Fit Pre-Match Top - Wolf Grey 2023',
        price: '£45.83',
        salePrice: '£31.66',
        imageUrl: 'https://static1.cdn-subsidesports.com/2/media/catalog/product/cache/8c1d2c81075bec58441bdd78446b18bb/9/b/9bb152f21df6b5dea91118ac442719f71a81c98f847c2b4f9ebff199ff6e6b0f.jpeg',
        isLiked: false,
    },
    {
        id: 2,
        name: 'Nike Liverpool Dri-Fit Pre-Match Top - Wolf Grey 2023',
        price: '£45.83',
        salePrice: '£31.66',
        imageUrl: 'https://static1.cdn-subsidesports.com/2/media/catalog/product/cache/8c1d2c81075bec58441bdd78446b18bb/9/b/9bb152f21df6b5dea91118ac442719f71a81c98f847c2b4f9ebff199ff6e6b0f.jpeg',
        isLiked: false,
    },
    // Add more shirts here
];

const Listshirt: React.FC = () => {
    return (
        <div className="grid grid-cols-4 gap-4 p-8">
            {shirts.map((shirt) => (
                <Card
                    key={shirt.id}
                    className="relative border border-gray-200 shadow-sm"
                    cover={<img alt={shirt.name} src={shirt.imageUrl} />}
                >
                    <div className="absolute top-2 right-2">
                        {shirt.isLiked ? (
                            <HeartFilled className="text-red-500" />
                        ) : (
                            <HeartOutlined />
                        )}
                    </div>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500 line-through">{shirt.price}</p>
                        <p className="text-xl font-semibold text-red-600">{shirt.salePrice}</p>
                        <p className="text-sm text-gray-700 mt-2">{shirt.name}</p>
                    </div>

                </Card>
            ))}
        </div>
    );
};

export default Listshirt;
