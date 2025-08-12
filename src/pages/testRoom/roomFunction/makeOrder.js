import axios from "axios";

export async function makeOrder(myOrder) {
   try {
        const response = await axios.post('/api/orders/insertOrder', myOrder);
        console.log("오더 insert 성공:", response.data); // 응답 데이터도 출력
        return response.data; // 필요하다면 호출한 곳에서 결과 활용 가능하게 반환
    } catch (error) {
        console.error("오더 insert 실패:", error);
        throw error; // 호출한 쪽에서도 에러를 처리할 수 있도록 다시 던짐
    }
}