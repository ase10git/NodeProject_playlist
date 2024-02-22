// 비디오 식별자 가져오기
let link = document.getElementById("address");
let videoId = link.value.substring(32, 43);

var tag = document.createElement('script');
// IFrame Player API code 가져오기
tag.src = "https://www.youtube.com/iframe_api"; 
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// API 코드 다운 후 <iframe> (그리고 YouTube player) 생성
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '180',
        width: '360',
        videoId: videoId,
    });
}
