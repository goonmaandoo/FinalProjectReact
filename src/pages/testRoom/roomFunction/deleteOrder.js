import axios from "axios";

export async function deleteOrder (orderId) {
    try {
        const response = await axios.delete(`/api/orders/delete/${orderId}`);
        console.log("주문삭제 성공",response);
        return response;
    } catch (error) {
        console.error("주문삭제 실패",error);
        throw error;
    }
}