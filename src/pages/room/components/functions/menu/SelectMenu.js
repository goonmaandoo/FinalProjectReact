import axios from "axios";

export default async function selectMenu({
    menu_id,
    menu_name_like,
    store_id,
}) {
    try {
        const response = await axios.post("/api/menu/selectMenu", {
            id: menu_id,
            menuNameLike: menu_name_like,
            storeId: store_id,
        });
        return response.data;
    } catch (error) {
        console.error("API 호출 실패:", error);
        throw error;
    }
}