let register_btn = document.getElementById("register-btn");
register_btn.addEventListener("click", function() {
  fetch("/join", {method:"get"})
    .then((res) => {
      res.text()
    })
    .then((result) => {
      window.location.href="/join";
    })
    .catch((error) => {
      console.log(error)
    })
});