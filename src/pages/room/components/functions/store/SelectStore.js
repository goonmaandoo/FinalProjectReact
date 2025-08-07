import axios from "axios";

export default async function selectStore({
    store_id,
    store_name_like,
    category_id,
}) {
    try {
        const response = await axios.post("/api/store/selectStore", {
            id: store_id,
            storeNameLike: store_name_like,
            menuCategoryId: category_id,
        });
        const data = response.data;
        return data;
    } catch (error) {
        console.error("가게 조회 실패", error);
        throw error;
    }
}
