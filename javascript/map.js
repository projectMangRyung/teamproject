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
        startMarker = new kakao.maps.Marker({
          position: startPosition,
          map: map
        });
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

async function findRoute() {
  if (!searchedStart) {
    alert('먼저 출발지를 검색해주세요.');
    return;
  }

  var origin = searchedStart.lng + ',' + searchedStart.lat;
  var destination = DESTINATION.lng + ',' + DESTINATION.lat;

  var url =
    'https://apis-navi.kakaomobility.com/v1/directions' +
    '?origin=' + origin +
    '&destination=' + destination +
    '&priority=RECOMMEND';

  routeResult.innerHTML = '<p>길찾기 결과를 불러오는 중입니다...</p>';

  try {
    var response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'KakaoAK ' + REST_API_KEY
      }
    });

    var data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      routeResult.innerHTML = '<p>경로를 찾을 수 없습니다.</p>';
      return;
    }

    var route = data.routes[0];
    var summary = route.summary;

    drawRouteLine(route);
    showRouteResult(summary);
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
        var lng = road.vertexes[i];
        var lat = road.vertexes[i + 1];

        linePath.push(new kakao.maps.LatLng(lat, lng));
      }
    });
  });

  if (routeLine) {
    routeLine.setMap(null);
  }

  routeLine = new kakao.maps.Polyline({
    path: linePath,
    strokeWeight: 6,
    strokeColor: '#2979ff',
    strokeOpacity: 0.9,
    strokeStyle: 'solid'
  });

  routeLine.setMap(map);

  var bounds = new kakao.maps.LatLngBounds();

  linePath.forEach(function (point) {
    bounds.extend(point);
  });

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

searchBtn.addEventListener('click', function () {
  searchStartLocation();
});

routeBtn.addEventListener('click', function () {
  findRoute();
});

searchInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    searchStartLocation();
  }
});

// 커스텀 오버레이에 표시할 컨텐츠 입니다
// 커스텀 오버레이는 아래와 같이 사용자가 자유롭게 컨텐츠를 구성하고 이벤트를 제어할 수 있기 때문에
// 별도의 이벤트 메소드를 제공하지 않습니다 
var content = '<div class="wrap">' + 
            '    <div class="info">' + 
            '        <div class="title">' + 
            '            멍냥허브 본사' + 
            '            <div class="close" onclick="closeOverlay()" title="닫기"></div>' + 
            '        </div>' + 
            '        <div class="body">' + 
            '            <div class="img">' +
            '                <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/thumnail.png" width="73" height="70">' +
            '           </div>' + 
            '            <div class="desc">' + 
            '                <div class="ellipsis">서울특별시 강남구 테헤란로 427 위워크타워 5층</div>' + 
            '                <div class="jibun ellipsis">(우) 63309 (지번) 영평동 2181</div>' + 
            '                <div><a href="./index.html" target="_blank" class="link">홈페이지</a></div>' + 
            '            </div>' + 
            '        </div>' + 
            '    </div>' +    
            '</div>';

let overlayStyle = `
    .wrap {position: absolute;left: 0;bottom: 40px;width: 288px;height: 132px;margin-left: -144px;text-align: left;overflow: hidden;font-size: 12px;font-family: 'Malgun Gothic', dotum, '돋움', sans-serif;line-height: 1.5;}
    .wrap * {padding: 0;margin: 0;}
    .wrap .info {width: 286px;height: 120px;border-radius: 5px;border-bottom: 2px solid #ccc;border-right: 1px solid #ccc;overflow: hidden;background: #fff;}
    .wrap .info:nth-child(1) {border: 0;box-shadow: 0px 1px 2px #888;}
    .info .title {padding: 5px 0 0 10px;height: 30px;background: #eee;border-bottom: 1px solid #ddd;font-size: 18px;font-weight: bold;}
    .info .close {position: absolute;top: 10px;right: 10px;color: #888;width: 17px;height: 17px;background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/overlay_close.png');}
    .info .close:hover {cursor: pointer;}
    .info .body {position: relative;overflow: hidden;}
    .info .desc {position: relative;margin: 13px 0 0 90px;height: 75px;}
    .desc .ellipsis {overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
    .desc .jibun {font-size: 11px;color: #888;margin-top: -2px;}
    .info .img {position: absolute;top: 6px;left: 5px;width: 73px;height: 71px;border: 1px solid #ddd;color: #888;overflow: hidden;}
    .info:after {content: '';position: absolute;margin-left: -12px;left: 50%;bottom: 0;width: 22px;height: 12px;background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png')}
    .info .link {color: #5085BB;}
`            
AddStyle(overlayStyle)
// 마커 위에 커스텀오버레이를 표시합니다
// 마커를 중심으로 커스텀 오버레이를 표시하기위해 CSS를 이용해 위치를 설정했습니다
var overlay = new kakao.maps.CustomOverlay({
    content: content,
    map: map,
    position: destinationMarker.getPosition()       
});

// 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
kakao.maps.event.addListener(destinationMarker, 'click', function() {
    overlay.setMap(map);
});

// 커스텀 오버레이를 닫기 위해 호출되는 함수입니다 
function closeOverlay() {
    overlay.setMap(null);     
}

// 실시간 교통정보 추가
map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);    