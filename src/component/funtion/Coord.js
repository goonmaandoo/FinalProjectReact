/**
 * Retrieves the geographical coordinates (latitude and longitude) for a given address using the Kakao Maps API.
 *
 * @param {string} address - The address for which to retrieve coordinates.
 * @returns {Promise<{lat: number, lng: number} | null>} A promise that resolves to an object containing the latitude and longitude of the address, or null if coordinates cannot be found.
 */
export async function getCoordinates(address) {
    console.log("[getCoordinates] 호출됨, 주소:", address); // 로그 추가

    return new Promise((resolve, reject) => { // await는 제거
        if (!window.kakao || !window.kakao.maps) {
            console.error(`[getCoordinates] Kakao Maps API is not loaded for address: ${address}`);
            return resolve(null); // API 로드 안된 경우에도 Promise 완료 (null 반환)
        }

        const geocoder = new window.kakao.maps.services.Geocoder();

        // 1차: 주소 검색 시도
        geocoder.addressSearch(address, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const coord = {
                    lat: result[0].y,
                    lng: result[0].x
                };
                console.log(`[getCoordinates] 1차 주소 검색 성공 (${address}):`, coord);
                resolve(coord);
            } else {
                console.warn(`[getCoordinates] 1차 주소 검색 실패 (${address}), Status: ${status}. 2차 장소 검색 시도...`);

                // 2차: 장소 검색 시도
                const ps = new window.kakao.maps.services.Places(); // window.kakao 붙여주세요

                ps.keywordSearch(address, (data, status) => { // pagination 매개변수는 사용하지 않으면 제거
                    if (status === window.kakao.maps.services.Status.OK) {
                        const coord = {
                            lat: data[0].y,
                            lng: data[0].x
                        };
                        console.log(`[getCoordinates] 2차 장소 검색 성공 (${address}):`, coord);
                        resolve(coord);
                    } else {
                        // 1차, 2차 검색 모두 실패한 경우
                        console.error(`[getCoordinates] 주소/장소 검색 최종 실패 (${address}), Status: ${status}`);
                        resolve(null); // !!! 중요: Promise를 null로 resolve하여 완료시킴
                    }
                });
            }
        });
    });
}