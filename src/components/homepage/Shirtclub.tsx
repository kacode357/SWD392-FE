import { Skeleton } from 'antd'; // Import Skeleton từ Ant Design
import { searchClientShirtApi } from '../../util/api'; // Giả sử hàm searchShirtApi nằm trong file api.ts hoặc api.js
import { useNavigate } from 'react-router-dom'; // Import useNavigate để điều hướng
import { useEffect, useState } from 'react';

const Shirtclub: React.FC = () => {
    const [shirts, setShirts] = useState<any[]>([]); // State lưu trữ danh sách áo
    const [loading, setLoading] = useState<boolean>(true); // State để quản lý trạng thái loading
    const [error, setError] = useState<string | null>(null); // State để quản lý lỗi
    const navigate = useNavigate(); // Khởi tạo hook để điều hướng

    useEffect(() => {
        const fetchShirts = async () => {
            try {
                const response = await searchClientShirtApi({ pageNum: 1, pageSize: 5, keyWord: '', status: 1 });
                console.log(response);
                if (response.pageData && Array.isArray(response.pageData)) {
                    setShirts(response.pageData); // Đảm bảo chỉ setShirts khi pageData là một mảng
                } else {
                    setShirts([]); // Đặt về mảng rỗng nếu dữ liệu không phải mảng
                }
                setLoading(false); // Ngừng trạng thái loading sau khi fetch xong
            } catch (error) {
                setError('Failed to fetch shirts.');
                setLoading(false);
            }
        };

        fetchShirts(); // Gọi hàm fetch dữ liệu
    }, []);

    if (loading) {
        // Hiển thị skeleton khi dữ liệu đang tải
        return (
            <div className="px-20 py-10">
                <div className="grid grid-cols-5 gap-6">
                    {Array(5).fill(0).map((_, index) => (
                        <div key={index} className="text-center">
                            <Skeleton.Image active={true} className="w-full h-80" />
                            <Skeleton.Input style={{ width: '100%' }} active={true} size="default" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) return <div>{error}</div>; // Hiển thị nếu có lỗi

    return (
        <div className="px-20 py-10">
            <div className="grid grid-cols-5 gap-6"> {/* Increased gap for larger images */}
                {shirts.map((shirt, index) => (
                    <div
                        key={index}
                        className="text-center cursor-pointer" // Thêm class cursor-pointer để có hiệu ứng trỏ chuột
                        onClick={() => navigate(`/shirt-details/${shirt.id}`)} // Điều hướng đến trang chi tiết của áo
                    >
                        <div className="relative w-full h-80 overflow-hidden"> {/* Increased height */}
                            <img
                                src={shirt.urlImg} // Giả sử response chứa trường urlImg
                                alt={shirt.name} // Giả sử response chứa trường name
                                className="w-full h-full object-cover transition duration-300 hover:scale-110"
                            />
                            <div className="absolute bottom-0 w-full bg-black bg-opacity-40 text-white text-lg p-2">
                                {shirt.name}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Shirtclub;
