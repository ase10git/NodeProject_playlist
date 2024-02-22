let add_form = document.getElementById("add-form");

let add_btn = document.getElementById("add-btn");

const currentDate = new Date();

add_btn.addEventListener('click', function(event){
  // 기본 동작(서버에 제출)을 막음
  event.preventDefault();
  
  // 제목과 내용 입력 요소를 가져옴
  let musicName = document.getElementById('musicName');
  let artistName = document.getElementById('artistName');
  let publisDate = document.getElementById('publishDate');

  let warn_musicName = document.querySelector('.warn-musicName');
  let warn_artistName = document.querySelector('.warn-artistName');
  let warn_publisDate = document.querySelector('.warn-publishDate');

  // 이름과 아티스트는 빈 값이 아니어야 함
  if (!musicName.value) {
    warn_musicName.innerHTML = '음악 제목을 입력해주세요!';
    warn_publisDate.innerHTML = '';
    warn_artistName.innerHTML = '';
  } else if (!artistName.value) {
    warn_musicName.innerHTML = '';
    warn_artistName.innerHTML = '아티스트 이름을 입력해주세요!';
    warn_publisDate.innerHTML = '';
  } else if (!publisDate.value) {
    warn_musicName.innerHTML = '';
    warn_artistName.innerHTML = '';
    warn_publisDate.innerHTML = '발매일을 입력해주세요!';
  } else if (new Date(publisDate.value) > currentDate) {
    warn_musicName.innerHTML = '';
    warn_artistName.innerHTML = '';
    warn_publisDate.innerHTML = '발매일이 유효하지 않습니다!';
  } else {
    add_form.submit(); // 내용이 비어 있지 않으면 폼 제출
  }
});