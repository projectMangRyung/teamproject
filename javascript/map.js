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