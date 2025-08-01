import { getDistance } from "./Distance";

export const renderRoomMarkers = ({
  mapInstance,
  geocoder,
  userCoords,
  roomList,
  roomMarkers,
  styles,
  navigate,
  currentOverlay,
  onSelectRoomId,
  outsideClickListenerRef,
}) => {
  if (!userCoords || !mapInstance.current || !geocoder.current) return;

  // 기존 마커 제거
  roomMarkers.current.forEach((m) => m.setMap(null));
  roomMarkers.current = [];

  roomList.forEach((room) => {
    geocoder.current.addressSearch(room.roomAddress, (res, status) => {
      if (status !== window.kakao.maps.services.Status.OK) return;

      const roomCoords = new window.kakao.maps.LatLng(res[0].y, res[0].x);
      // const distance = getDistance(
      //   { lat: userCoords.getLat(), lng: userCoords.getLng() },
      //   { lat: res[0].y, lng: res[0].x }
      // );
      const distance = getDistance(
        { lat: userCoords.lat, lng: userCoords.lng }, // ✅ userCoords 객체의 속성을 직접 사용
        { lat: res[0].y, lng: res[0].x }
      );


      if (distance > 1) return;

      const marker = new window.kakao.maps.Marker({
        map: mapInstance.current,
        position: roomCoords,
        title: room.roomName,
        image: new window.kakao.maps.MarkerImage(
          "http://localhost:8080/image/imgfile/main_img/web_logo.png",
          new window.kakao.maps.Size(38.55, 33.55)
        ),
      });


      roomMarkers.current.push(marker);

      const content = `
        <div class="${styles.mapOverlay}" id="overlay-${room.id}">
          <div id="roomImage-${room.id}">
            <img class="${styles.infowindowImg}" src="http://localhost:8080/image/imgfile/store/store_${room.storeId}.jpg" />
          </div>
          <strong id="roomName-${room.id}" class="${styles.mapRoomName}">${room.roomName}</strong>
          <button id="closeButton-${room.id}" class="${styles.infowindowClose}">×</button>
          <div id="roomAddress-${room.id}" class="${styles.mapAddress}">${room.roomAddress}</div>
          <div>(${Math.floor(room.distance * 10) / 10}km)</div>
        </div>`;

      const overlay = new window.kakao.maps.CustomOverlay({
        position: marker.getPosition(),
        content,
        yAnchor: 1.2,
      });

      window.kakao.maps.event.addListener(marker, "click", () => {
        if (currentOverlay.current) currentOverlay.current.setMap(null);
        overlay.setMap(mapInstance.current);
        currentOverlay.current = overlay;

        if (typeof onSelectRoomId === "function") {
          onSelectRoomId(room.id);
        }

        setTimeout(() => {
          const closeBtn = document.getElementById(`closeButton-${room.id}`);
          closeBtn?.addEventListener("click", () => {
            overlay.setMap(null);
            currentOverlay.current = null;
            onSelectRoomId(null);
            document.removeEventListener("pointerdown", outsideClickListenerRef.current, true);
          });

          const clickRoom = () => {
            if (!window.confirm(`"${room.roomName}" 공구방으로 이동하시겠습니까?`)) return;
            navigate(`/room/${room.id}`);
          };

          const clickRoute = () => {
            window.open(
              `https://map.kakao.com/link/to/${encodeURIComponent(room.roomName)},${res[0].y},${res[0].x}`,
              "_blank"
            );
          };

          document.getElementById(`roomImage-${room.id}`)?.addEventListener("click", clickRoom);
          document.getElementById(`roomName-${room.id}`)?.addEventListener("click", clickRoom);
          document.getElementById(`roomAddress-${room.id}`)?.addEventListener("click", clickRoute);
        }, 0);

        // 외부 클릭 감지 리스너 등록
        outsideClickListenerRef.current = (e) => {
          const overlayEl = document.getElementById(`overlay-${room.id}`);
          if (overlayEl && !overlayEl.contains(e.target)) {
            overlay.setMap(null);
            currentOverlay.current = null;
            onSelectRoomId(null);
            document.removeEventListener("pointerdown", outsideClickListenerRef.current, true);
          }
        };

        document.addEventListener("pointerdown", outsideClickListenerRef.current, true);
      });
    });
  });
};
