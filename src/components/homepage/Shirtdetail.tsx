import React, { useState, useEffect } from "react";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { getShirtByIdApi, addToCartApi } from "../../util/api"; // Import API thực tế

const Shirtdetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Lấy id từ URL
  const [shirtData, setShirtData] = useState<any>(null); // State để lưu trữ dữ liệu áo
  const [mainImage, setMainImage] = useState<string>(""); // State cho ảnh chính
  const [quantity, setQuantity] = useState<number>(1); // State cho số lượng

  useEffect(() => {
    const fetchShirtDetail = async () => {
      try {
        // Gọi API thực tế với id từ URL
        const data = await getShirtByIdApi(Number(id));
        console.log("Shirt Data:", data); // Log dữ liệu ra console
        setShirtData(data); // Lưu dữ liệu áo vào state
        setMainImage(data.urlImg); // Đặt hình ảnh từ dữ liệu API làm ảnh chính
      } catch (error) {
        console.error("Error fetching shirt data:", error);
      }
    };

    if (id) {
      fetchShirtDetail(); // Gọi API nếu id tồn tại
    }
  }, [id]);

  const handleAddToBasket = async () => {
    try {
      const cartData = {
        shirtId: Number(id),
        quantity: quantity,
      };
      const response = await addToCartApi(cartData); // Gọi API thêm vào giỏ hàng
      console.log("Add to cart success:", response); // Kiểm tra phản hồi từ API
      alert("Item added to basket!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to basket.");
    }
  };

  if (!shirtData) {
    return <div>Loading...</div>; // Hiển thị loading khi chưa có dữ liệu
  }

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            href: "/",
            title: (
              <>
                <HomeOutlined />
                <span>Home</span>
              </>
            ),
          },
          {
            title: "Detail",
          },
        ]}
      />

      {/* Thông tin chi tiết áo */}
      <div className="flex flex-col lg:flex-row items-start p-4 max-w-6xl mx-auto">
        {/* Ảnh chính */}
        <div className="w-full lg:w-1/2 p-4">
          <div className="relative w-full h-80"> {/* Thay đổi h-64 thành chiều cao mong muốn */}
            <img
              src={mainImage}
              alt={shirtData.name}
              className="w-full h-full object-cover" // Dùng object-cover để ảnh chiếm toàn bộ khung
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 p-4">
          <h1 className="text-2xl font-bold">{shirtData.name}</h1>
          <p className="text-3xl font-semibold mt-4">£{shirtData.price}</p>
          <p className="text-lg mt-4">Player: {shirtData.playerName}</p>
          <p className="text-lg mt-4">Type: {shirtData.typeShirtName}</p>

          <div className="flex items-center space-x-4 mt-6">
            {/* Input số lượng */}
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-16 p-2 border rounded"
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
              onClick={handleAddToBasket}
            >
              Add to Basket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shirtdetail;
