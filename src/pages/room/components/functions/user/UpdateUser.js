import supabase from "../../config/supabaseClient";

export default async function updateUser({
    user_id,
    nickname,
    user_rating,
    cash,
}) {
    if (typeof user_id === "undefined") throw new Error("user_id is required");

  try {
    const response = await axios.put("/api/users/update", {
      id: user_id,
      nickname,
      userRating: user_rating,
      cash,
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error("User update failed:", error);
    throw error;
  }
}