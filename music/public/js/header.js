// 로그아웃
let logout_btn = document.querySelector(".logout-btn");

logout_btn.addEventListener("click", function() {
    window.location.href = "/logout";
});

// 검색 처리
let select_opt = document.querySelector("#select-option");
let search_btn = document.getElementById("search-btn");

search_btn.addEventListener("click", function() {
    let search_query = document.querySelector("#search").value;

    if(select_opt.value == "곡 이름") {
        window.location.href = "/search?name="+search_query;
    } else if (select_opt.value == "아티스트") {
        window.location.href = "/search?artist="+search_query;
    }
});