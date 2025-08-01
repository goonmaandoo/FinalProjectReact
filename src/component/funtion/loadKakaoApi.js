export function loadKakaoApi() {
  return new Promise((resolve) => {
    if (window.kakao && window.kakao.maps) {
      resolve();
    } else {
      const script = document.createElement('script');
      script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=cc136d443442275458b1d05e6c2d1fde&libraries=services,geometry&autoload=false';
      script.onload = () => {
        window.kakao.maps.load(() => {
          resolve();
        });
      };
      document.head.appendChild(script);
    }
  });
}