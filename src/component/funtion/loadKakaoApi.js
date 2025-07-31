export function loadKakaoApi() {
  return new Promise((resolve) => {
    if (window.kakao && window.kakao.maps) {
      resolve();
    } else {
      const script = document.createElement('script');
      script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=08f9c36b943ab13d757aa791223a47bc&libraries=services,geometry&autoload=false';
      script.onload = () => {
        window.kakao.maps.load(() => {
          resolve();
        });
      };
      document.head.appendChild(script);
    }
  });
}