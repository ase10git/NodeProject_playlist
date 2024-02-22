// 장르별 이동 버튼
let genre = document.querySelectorAll(".genre-btn");

for (let i = 0; i < genre.length; i++) {
  genre[i].addEventListener("click", function() {
    let genreId = this.getAttribute("data-genre-id");
    window.location.href = "/genre/"+genreId;
  });
}
