import axios from "axios";

export async function deleteOrder(orderId, totalPrice, token) {
    try {
        const response = await axios.delete(`/api/orders/delete/${orderId}`);
        const charge = await axios.post(
            "/api/users/cash/charge",
            { cash: totalPrice },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("주문삭제 성공", response);
        return response;
    } catch (error) {
        console.error("주문삭제 실패", error);
        throw error;
    }
}