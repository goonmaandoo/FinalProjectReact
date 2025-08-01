// initUserMap.js

export const initUserMap = ({
    userAddress,
    userCoords,
    mapRef,
    mapInstance,
    geocoder,
    userMarker,
    onUserLocationUpdate, // ⭐️ 부모의 상태 업데이트 함수로 이름을 변경합니다.
    updateAddress,
}) => {
    console.log("사용할 유저 좌표, 주소",userAddress,userCoords);
    if (!userCoords || !userAddress || !window.kakao?.maps) {
      console.log("유저 좌표 주소 windowkakaomp 체킹 안됨");
      return;
    }
      

    if (!mapInstance.current) {
      mapInstance.current = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(userCoords.lat, userCoords.lng),
        level: 3,
      });
      geocoder.current = new window.kakao.maps.services.Geocoder();
    }
    
    mapInstance.current.setCenter(new window.kakao.maps.LatLng(userCoords.lat, userCoords.lng));
    
    if (!userMarker.current) {
        userMarker.current = new window.kakao.maps.Marker({
            map: mapInstance.current,
            position: new window.kakao.maps.LatLng(userCoords.lat, userCoords.lng),
            title: "내 위치",
            draggable: true,
            image: new window.kakao.maps.MarkerImage(
                "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                new window.kakao.maps.Size(24, 35)
            ),
        });

        window.kakao.maps.event.addListener(userMarker.current, "dragend", () => {
            const newPos = userMarker.current.getPosition();
            
            geocoder.current.coord2Address(newPos.getLng(), newPos.getLat(), (res, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const newAddress = res[0].address.address_name;
                
                // ⭐️ 부모 컴포넌트의 상태를 주소와 좌표 모두 업데이트
                onUserLocationUpdate(newAddress, { lat: newPos.getLat(), lng: newPos.getLng() });
                
                // 백엔드에 주소 업데이트 요청
                updateAddress(newAddress);
              }
            });
        });
    } else {
        userMarker.current.setPosition(new window.kakao.maps.LatLng(userCoords.lat, userCoords.lng));
    }
};