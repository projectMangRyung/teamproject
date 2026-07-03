// 스타일을 추가하는 함수
function AddStyle(style){
    const styleTag = document.createElement('style');
    styleTag.innerHTML = style;
    document.head.appendChild(styleTag);
}

var container = document.getElementById('map');
var options = {
  center: new kakao.maps.LatLng(37.506502, 127.053617),
  level: 3
};
var map = new kakao.maps.Map(container, options);
var places = new kakao.maps.services.Places();

var searchInput = document.getElementById('start_search');
var searchBtn = document.getElementById('searchBtn');
var routeBtn = document.getElementById('routeBtn');
var routeResult = document.getElementById('routeResult');

var startMarker = null;
var destinationMarker = null;
var routeLine = null;
var searchedStart = null;
var REST_API_KEY = 'aeacbeec9d5317614b6c6c72178090ac';

var DESTINATION = {
  name: '멍냥허브 본사',
  lat: 37.506502,
  lng: 127.053617,
  address: '서울특별시 강남구 테헤란로 427'
};

destinationMarker = new kakao.maps.Marker({
  position: new kakao.maps.LatLng(DESTINATION.lat, DESTINATION.lng),
  map: map
});

function searchStartLocation() {
  var keyword = searchInput.value.trim();
  if (!keyword) {
    alert('출발지를 입력해주세요.');
    return;
  }
  places.keywordSearch(keyword, function (result, status) {
    if (status === kakao.maps.services.Status.OK) {
      var place = result[0];
      searchedStart = {
        name: place.place_name,
        lat: Number(place.y),
        lng: Number(place.x),
        address: place.road_address_name || place.address_name
      };
      var startPosition = new kakao.maps.LatLng(searchedStart.lat, searchedStart.lng);

      if (!startMarker) {
        startMarker = new kakao.maps.Marker({ position: startPosition, map: map });
      } else {
        startMarker.setPosition(startPosition);
      }
      map.setCenter(startPosition);
      map.setLevel(4);
      routeResult.innerHTML =
        '<p><strong>출발지:</strong> ' + searchedStart.name + '</p>' +
        '<p><strong>주소:</strong> ' + searchedStart.address + '</p>' +
        '<p>길찾기 버튼을 눌러 경로를 확인하세요.</p>';
    } else {
      alert('출발지를 찾을 수 없습니다.');
    }
  });
}

// 길찾기 성공 후 아래로 '휙!' 스크롤
async function findRoute() {
  if (!searchedStart) {
    alert('먼저 출발지를 검색해주세요.');
    return;
  }
  var origin = searchedStart.lng + ',' + searchedStart.lat;
  var destination = DESTINATION.lng + ',' + DESTINATION.lat;
  var url = 'https://apis-navi.kakaomobility.com/v1/directions?origin=' + origin + '&destination=' + destination + '&priority=RECOMMEND';
  
  routeResult.innerHTML = '<p>길찾기 결과를 불러오는 중입니다...</p>';

  try {
    var response = await fetch(url, {
      method: 'GET',
      headers: { Authorization: 'KakaoAK ' + REST_API_KEY }
    });
    var data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      routeResult.innerHTML = '<p>경로를 찾을 수 없습니다.</p>';
      return;
    }
    drawRouteLine(data.routes[0]);
    showRouteResult(data.routes[0].summary);

    // 길찾기 로드 성공 후 지도 영역으로 자동 스크롤
    setTimeout(() => {
        const mapWrapper = document.querySelector('.map-and-info-wrapper');
        if(mapWrapper) {
            // 헤더가 가리는 것을 방지하기 위해 상단에서 100px 정도 여백을 둠
            const offset = mapWrapper.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    }, 200);

  } catch (error) {
    console.error(error);
    routeResult.innerHTML = '<p>길찾기 요청 중 오류가 발생했습니다.</p>';
  }
}

function drawRouteLine(route) {
  var linePath = [];
  route.sections.forEach(function (section) {
    section.roads.forEach(function (road) {
      for (var i = 0; i < road.vertexes.length; i += 2) {
        linePath.push(new kakao.maps.LatLng(road.vertexes[i + 1], road.vertexes[i]));
      }
    });
  });

  if (routeLine) { routeLine.setMap(null); }

  routeLine = new kakao.maps.Polyline({
    path: linePath,
    strokeWeight: 6,
    strokeColor: '#2979ff',
    strokeOpacity: 0.9,
    strokeStyle: 'solid'
  });
  routeLine.setMap(map);

  var bounds = new kakao.maps.LatLngBounds();
  linePath.forEach(function (point) { bounds.extend(point); });
  bounds.extend(new kakao.maps.LatLng(searchedStart.lat, searchedStart.lng));
  bounds.extend(new kakao.maps.LatLng(DESTINATION.lat, DESTINATION.lng));
  map.setBounds(bounds);
}

function showRouteResult(summary) {
  var distanceKm = (summary.distance / 1000).toFixed(1);
  var durationMin = Math.ceil(summary.duration / 60);
  var taxiFare = summary.fare.taxi.toLocaleString();
  var tollFare = summary.fare.toll.toLocaleString();

  routeResult.innerHTML =
    '<div class="route-summary">' +
      '<h3>길찾기 결과</h3>' +
      '<p><strong>출발지:</strong> ' + searchedStart.name + '</p>' +
      '<p><strong>목적지:</strong> ' + DESTINATION.name + '</p>' +
      '<p><strong>총 거리:</strong> ' + distanceKm + 'km</p>' +
      '<p><strong>예상 시간:</strong> 약 ' + durationMin + '분</p>' +
      '<p><strong>예상 택시비:</strong> ' + taxiFare + '원</p>' +
      '<p><strong>통행료:</strong> ' + tollFare + '원</p>' +
    '</div>';
}

searchBtn.addEventListener('click', searchStartLocation);
routeBtn.addEventListener('click', findRoute);
searchInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    searchStartLocation();
  }
});

var content = `
<div class="wrap">
    <div class="info">
        <div class="title">
            멍냥허브 본사
            <div class="close" onclick="closeOverlay()" title="닫기"></div>
        </div>
        <div class="body">
            <div class="img">
                <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/thumnail.png" width="73" height="73">
           </div>
            <div class="desc">
                <div class="ellipsis">서울특별시 강남구 테헤란로 427</div>
                <div class="jibun ellipsis">(우) 63309 (지번) 대치동 892</div>
                <div><a href="./index.html" target="_blank" class="link">홈페이지 방문</a></div>
            </div>
        </div>
    </div>
</div>`;

let overlayStyle = `
    .wrap { position: absolute; left: 0; bottom: 45px; width: 300px; margin-left: -150px; text-align: left; font-family: 'Noto Sans KR', sans-serif; }
    .wrap * { padding: 0; margin: 0; }
    .wrap .info { width: 300px; border-radius: 20px; background: #FDFBF7; box-shadow: 0 12px 24px rgba(46, 90, 68, 0.15); border: 1px solid rgba(46, 90, 68, 0.08); overflow: hidden; }
    .info .title { padding: 14px 18px; background: #2E5A44; color: #FDFBF7; font-size: 16px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; letter-spacing: -0.5px; }
    .info .close { width: 14px; height: 14px; background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/overlay_close.png') no-repeat center; filter: brightness(0) invert(1); cursor: pointer; transition: transform 0.2s; }
    .info .close:hover { transform: scale(1.1); }
    .info .body { position: relative; padding: 18px; display: flex; gap: 14px; background: #FDFBF7; }
    .info .img { width: 73px; height: 73px; border-radius: 12px; overflow: hidden; flex-shrink: 0; border: 1px solid rgba(46, 90, 68, 0.08); }
    .info .desc { display: flex; flex-direction: column; justify-content: center; width: 100%; overflow: hidden; }
    .desc .ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #2A2C2B; font-size: 13px; font-weight: 500; margin-bottom: 4px; }
    .desc .jibun { font-size: 12px; color: #7A827E; font-weight: 400; }
    .info .link { display: inline-block; margin-top: 8px; font-size: 13px; color: #2E5A44; font-weight: 700; text-decoration: none; transition: color 0.2s; }
    .info .link:hover { color: #1a3c2b; text-decoration: underline; }
    .wrap::after { content: ''; position: absolute; left: 50%; bottom: -10px; margin-left: -10px; border-top: 10px solid #FDFBF7; border-left: 10px solid transparent; border-right: 10px solid transparent; z-index: 1; }
    .wrap::before { content: ''; position: absolute; left: 50%; bottom: -11px; margin-left: -10px; border-top: 10px solid rgba(46, 90, 68, 0.08); border-left: 10px solid transparent; border-right: 10px solid transparent; z-index: 0; }
`;            
AddStyle(overlayStyle);

var overlay = new kakao.maps.CustomOverlay({
    content: content,
    map: map,
    position: destinationMarker.getPosition()       
});

kakao.maps.event.addListener(destinationMarker, 'click', function() {
    overlay.setMap(map);
});
function closeOverlay() {
    overlay.setMap(null);     
}
map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);    


// ==========================================
// 스크롤 상호작용 및 애니메이션 로직
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    
    // 1. 배너 애니메이션 타임라인 (전면 교체)
    const mapBanner = document.querySelector('.map-banner');
    const slidingDog = document.querySelector('.sliding-dog');
    const bannerText = document.querySelector('.banner-text.move');

    if (mapBanner) {
        // (1) 배너 등장: 왼쪽에서 오른쪽으로 스무스하게
        setTimeout(() => { 
            mapBanner.classList.add('banner-on'); 
        }, 100);

        // (2) 강아지 이동: 배너가 자리 잡은 후 (1.3초 뒤)
        setTimeout(() => {
            if (slidingDog) slidingDog.classList.add('run');
        }, 100);

        // (3) 텍스트 등장: 강아지가 중간쯤 지나갈 때 (강아지 출발 후 1.2초 뒤)
        setTimeout(() => {
            if (bannerText) bannerText.classList.add('on');
        }, 8000); 
    }

    // 2. 검색 폼 등 일반 요소 Fade-up
    const fadeUpElements = document.querySelectorAll('.fade-up');
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.15 });
    fadeUpElements.forEach(el => scrollObserver.observe(el));


    // 3. 지도 100% -> 60% 축소 및 카드 릴레이 등장 스크롤 로직
    const mapWrapper = document.querySelector('.map-and-info-wrapper');
    if (mapWrapper) {
        window.addEventListener('scroll', () => {
            const rect = mapWrapper.getBoundingClientRect();
            // 화면 스크롤이 지도 래퍼의 상단 부근(150px)에 도달하면 축소(.is-shrunk) 클래스 부여
            if (rect.top <= 150) {
                mapWrapper.classList.add('is-shrunk');
            } else {
                mapWrapper.classList.remove('is-shrunk');
            }
        });
    }

    // [핵심] 지도 컨테이너가 100% -> 60%로 CSS Transition 중일 때 카카오맵이 깨지지 않게 실시간 리레이아웃 처리
    const mapContainerEl = document.querySelector('.map-container');
    if (mapContainerEl) {
        const resizeObserver = new ResizeObserver(() => {
            if(map) {
                map.relayout();
                // 중심점 다시 맞춰주기
                const centerPos = searchedStart 
                    ? new kakao.maps.LatLng(searchedStart.lat, searchedStart.lng) 
                    : new kakao.maps.LatLng(DESTINATION.lat, DESTINATION.lng);
                map.setCenter(centerPos);
            }
        });
        resizeObserver.observe(mapContainerEl);
    }

    // 4. 배경 붓터치 애니메이션 로직
    const brushPath = document.querySelector('.brush-path');
    if (brushPath) {
        const length = brushPath.getTotalLength();
        
        // 선 길이 초기화
       
        brushPath.style.strokeDashoffset = length;

        window.addEventListener('scroll', () => {
            // 푸터 영역을 제외한 스크롤 계산 (전체 문서 높이 - 뷰포트 높이 - 푸터 높이)
            const footerHeight = document.querySelector('footer').offsetHeight;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight - footerHeight;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            
            // 진행률 계산
            let scrollPercentage = scrollTop / scrollHeight;
            if (scrollPercentage > 1) scrollPercentage = 1;
            if (scrollPercentage < 0) scrollPercentage = 0;

            // 선이 0부터 시작해서 끝까지 깔끔하게 이어짐
            const drawLength = length * scrollPercentage;
            brushPath.style.strokeDashoffset = length - drawLength;
        });
    }
});


// ==========================================
// 플로팅 이미지 스크롤 등장 & 마우스 3D 입체 효과
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    // 임의의 위치에 띄울 사진 데이터
    const floatingImages = [
        { src: './img/banner_1.jpg', top: '25%', left: '7%', width: '180px', speed: 0.04 },
        { src: './img/banner_13.png', top: '25%', left: '80%', width: '220px', speed: 0.06 },
        { src: './img/banner_3.jpg', top: '34%', left: '10%', width: '260px', speed: 0.03 },
        { src: './img/banner_14.png', top: '33%', left: '83%', width: '260px', speed: 0.03 },
        { src: './img/banner_6.jpg', top: '75%', left: '85%', width: '200px', speed: 0.07 },
        { src: './img/banner_2.jpg', top: '90%', left: '15%', width: '200px', speed: 0.05 },
        { src: './img/banner_12.png', top: '85%', left: '65%', width: '500px', speed: 0.04 }
    ];

    const floatingContainer = document.getElementById('floatingBgContainer');
    const floatElements = [];

    if (floatingContainer) {
        // DOM에 이미지 생성 및 삽입
        floatingImages.forEach(item => {
            const img = document.createElement('img');
            img.src = item.src;
            img.className = 'floating-img';
            img.style.top = item.top;
            img.style.left = item.left;
            img.style.width = item.width;
            img.style.opacity = "0.4"
            
            // 패럴랙스 속도 데이터 저장
            img.dataset.speed = item.speed;

            floatingContainer.appendChild(img);
            floatElements.push(img);
        });

        // 스크롤 이벤트: 뷰포트 안으로 들어오면 투명도 조절
        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            floatElements.forEach(img => {
                const rect = img.getBoundingClientRect();
                // 화면에 보이기 시작하면 show 클래스 추가
                if (rect.top < windowHeight && rect.bottom > 0) {
                    img.classList.add('show');
                }
            });
        });

        // 마우스 이동 이벤트: x축 기반 3D 흔들림 모션
        window.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            
            // 화면 중앙을 기준으로 -1 ~ 1 사이의 값 도출
            const moveX = (mouseX - windowWidth / 2);
            const moveY = (mouseY - windowHeight / 2);

            floatElements.forEach(img => {
                const speed = parseFloat(img.dataset.speed);
                // 마우스 위치에 따른 x축, y축 이동량 및 회전각도 계산
                const x = moveX * speed;
                const y = moveY * (speed * 0.5);
                const rotateY = moveX * speed * 0.1; // x축 이동에 따라 약간 회전하는 3D 느낌
                
                // transform을 통한 3D 입체 효과 적용
                img.style.transform = `translate3d(${x}px, ${y}px, 0) rotateY(${rotateY}deg)`;
            });
        });
    }
});