
export const initUserMap = ({
  userAddress,
  mapRef,
  mapInstance,
  geocoder,
  userMarker,
  setUserCoords,
  setUserAddress,
  updateAddress,
}) => {
  if (!userAddress || !window.kakao?.maps) return;

  // 최초 지도 생성
  if (!mapInstance.current) {
    mapInstance.current = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(37.5665, 126.978),
      level: 3,
    });
    geocoder.current = new window.kakao.maps.services.Geocoder();
  }

  geocoder.current.addressSearch(userAddress, (result, status) => {
    if (status !== window.kakao.maps.services.Status.OK) return;

    const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
    setUserCoords(coords);
    mapInstance.current.setCenter(coords);

    if (!userMarker.current) {
      userMarker.current = new window.kakao.maps.Marker({
        map: mapInstance.current,
        position: coords,
        title: "내 위치",
        draggable: true,
        image: new window.kakao.maps.MarkerImage(
          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
          new window.kakao.maps.Size(24, 35)
        ),
      });

      window.kakao.maps.event.addListener(userMarker.current, "dragend", () => {
        const newPos = userMarker.current.getPosition();
        setUserCoords(newPos);

        geocoder.current.coord2Address(newPos.getLng(), newPos.getLat(), (res, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const newAddress = res[0].address.address_name;
            setUserAddress(newAddress);
            updateAddress(newAddress);
          }
        });
      });
    } else {
      userMarker.current.setPosition(coords);
    }
  });
};
