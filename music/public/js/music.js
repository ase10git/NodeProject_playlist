// 수정 form
let edit_form = document.getElementById("edit-form");
const id = edit_form.dataset.id;

// 제목과 이름
let title = document.querySelector(".title");
let musicName = document.getElementById("musicName");
let artistName = document.getElementById("artistName");

// 장르쪽
let tag_box = document.getElementById("tag-box");
let genre_box = document.getElementById("genre-box");

// 체크박스
let genreList = document.querySelectorAll(".genreList");
let genre_tag = document.querySelectorAll(".genre-tag");

// 발매일
let publishDate = document.getElementById("publishDate");
let publishDate_edit = document.getElementById("publishDate_edit");

// 유튜브 링크
let link_titile = document.getElementById("link-title");
let address_box = document.getElementById("address-box");
let address = document.getElementById("address");
let player_box = document.querySelector(".player-box");

// 버튼
let edit_btn = document.getElementById("edit-btn")
let back_btn = document.getElementById("back-btn");
let delete_btn = document.getElementById("delete-btn");

// 장르 박스의 체크 박스 설정
for(let i = 0; i < genreList.length; i++) {
    let box_name = genreList[i].dataset.genreName.trim();
    for(let j = 0; j < genre_tag.length; j++) {
        let tag_name = genre_tag[j].innerHTML.trim();
        if (box_name == tag_name) {
            genreList[i].checked = true;
        }
    }
}

// 수정 동작
edit_btn.addEventListener("click", function() {
    // edit 클래스 부여
    edit_form.classList.toggle('edit');

    //edit 클래스가 있으면
    if(edit_form.classList.contains('edit')){ 
        // 각 요소 숨김/보임 전환
        edit_on();
      } else { // edit 클래스 없음
        // 각 요소 숨김/보임 전환
        edit_off();

        // 전송
        editMusic();
    }
});

// 뒤로 가기
back_btn.addEventListener("click", function() {
    if(edit_form.classList.contains('edit')){ 
        window.location.href="/"+id;
    } else {
        window.location.href = "/music-list";
    }
});

function edit_on() {
    title.setAttribute('hidden', 'hidden');
    musicName.removeAttribute('hidden');
    artistName.removeAttribute('readonly');
    publishDate.setAttribute('hidden', 'hidden');
    publishDate_edit.removeAttribute('hidden');

    tag_box.setAttribute('hidden', 'hidden');
    genre_box.removeAttribute('hidden');

    link_titile.removeAttribute('hidden');
    address_box.setAttribute('colspan', "1");
    address.removeAttribute('hidden');
    player_box.setAttribute('hidden', 'hidden');
    
    // 버튼 설정
    edit_btn.innerHTML = "확인";
    delete_btn.setAttribute('hidden', 'hidden');
    back_btn.innerHTML = "취소";
}

function edit_off() {
    title.removeAttribute('hidden');
    musicName.setAttribute('hidden', 'hidden');
    artistName.setAttribute('readonly', 'readonly');
    publishDate.removeAttribute('hidden');
    publishDate_edit.setAttribute('hidden', 'hidden');

    tag_box.removeAttribute('hidden');
    genre_box.setAttribute('hidden', 'hidden');

    link_titile.setAttribute('hidden', 'hidden');
    address_box.setAttribute('colspan', "2");
    address.setAttribute('hidden', 'hidden');
    player_box.removeAttribute('hidden');
    
    // 버튼 설정
    edit_btn.innerHTML = "수정";
    delete_btn.removeAttribute('hidden');
    back_btn.innerHTML = "뒤로 가기";
}

// 수정 요청
function editMusic() {
    const currentDate = new Date();

    if (!musicName.value) {
        alert("음악 제목을 입력해주세요!");
        return;
    } else if (!artistName.value) {
        alert("아티스트 이름을 입력해주세요!");
        return;
    } else if (!publishDate_edit.value) {
        alert("발매일을 입력해주세요!");
        return;
    } else if (new Date(publishDate_edit.value) > currentDate) {
        alert("발매일이 유효하지 않습니다!");
        return;
    }

    let selectedGenre = [];
    // 장르 체크박스에서 데이터 가져옴
    genreList.forEach((item) => {
        if(item.checked) {
            selectedGenre.push(item.value);
        }
    });

    const newInfo = { // 수정할 내용 객체로 만듦
        musicName: musicName.value,
        artistName : artistName.value,
        genreList : selectedGenre,
        publishDate : publishDate_edit.value,
        address : address.value
    }

    fetch("/edit/"+id, {
        method : "put",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newInfo),
    })
    .then((response) => {
        response.text()
    })
    .then((result) => {
        window.location.href = "/"+id;
    })
    .catch((error) => {
        console.log(error)
    })
    
}


// 삭제 요청
delete_btn.addEventListener("click", function() {
    if(!confirm("정말 음악을 제거하시겠습니까?")) {
        return;
    }

    fetch('/delete/'+id , {method : 'DELETE'})
    .then((res)=>{
        res.text();
    }) 
    .then((result)=>{ 
        alert("플레이리스트에서 음악이 제거되었습니다.");
        window.location.href="/music-list";
    })
    .catch((error)=>{
      console.error();
    });
});
