import { useEffect, useRef } from "react";

export default function Kakaomap({ address, className }) {
    const mapRef = useRef(null);

    const waitForKakaoMaps = () => {
        return new Promise((resolve, reject) => {
            const check = setInterval(() => {
                if (
                    window.kakao &&
                    window.kakao.maps &&
                    window.kakao.maps.Map &&
                    window.kakao.maps.services &&
                    window.kakao.maps.services.Geocoder
                ) {
                    clearInterval(check);
                    resolve();
                }
            }, 100);

            // 5초 안에 안 되면 reject (예외 방지)
            setTimeout(() => {
                clearInterval(check);
                reject(new Error("카카오 지도 API가 준비되지 않았습니다."));
            }, 5000);
        });
    };

    const showMap = async (addr) => {
        await waitForKakaoMaps();

        if (!mapRef.current) return;

        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(addr, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                const map = new window.kakao.maps.Map(mapRef.current, {
                    center: coords,
                    level: 3,
                });

                setTimeout(() => {
                    window.kakao.maps.event.trigger(map, "resize");
                }, 200);

                new window.kakao.maps.Marker({
                    map: map,
                    position: coords,
                });
            }
        });
    };

    useEffect(() => {
        if (address) {
            showMap(address);
        }
    }, [address]);

    return <div ref={mapRef} className={className}/>;
}
