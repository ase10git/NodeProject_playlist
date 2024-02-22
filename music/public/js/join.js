let join_form = document.getElementById('join-form');

join_form.addEventListener('submit', function(event){
  // 기본 동작(서버에 제출)을 막음
  event.preventDefault();

  let username = document.getElementById('username').value.trim();
  let password = document.getElementById('password').value.trim();

  //const regex_id = /^[a-zA-Z][a-zA-Z0-9]\w{3,12}+$/;
  const regex_id = /^[a-z|A-Z]{3,6}[0-9]{1,}$/;
  const regex_pwd = /^(?=(.*[a-zA-Z].*){2,})(?=.*\d.*)(?=.*\W.*)[a-zA-Z0-9\S]{8,15}$/;
  // 아이디 정규표현식 출처 : https://inpa.tistory.com/entry/JS-%F0%9F%93%9A-%EC%A0%95%EA%B7%9C%EC%8B%9D-RegExp-%EB%88%84%EA%B5%AC%EB%82%98-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-%EC%89%BD%EA%B2%8C-%EC%A0%95%EB%A6%AC
  // 비밀번호 정규표현식 출처 : https://regexlib.com/(X(1)A(iPPx1YpbFmoF3KG74dfwOL-03fK6XrAIbIEi5OkRWzCUGU0-ZUws7PE_w-cTfV8hzcL5GhBUV8Yb2-NepwjCQFLw9FZMP-PfEPrQW9TVanop2yk9AgQZ2xeGAEoUbQ8z_nVY36xjpbdnRxcTM6mekweP2wEdJ3fdglHdfhcuHKt4Pc_-6sBVdf9JE73ydpQr0))/REDetails.aspx?regexp_id=2799


  // 내용이 비어 있는지 확인
  if (username == '')  {
    error_box.innerHTML = "아이디를 입력해주세요";
  } else if (password == '') {
    error_box.innerHTML = "비밀번호를 입력해주세요";
  } else if (!regex_id.test(username)){
    error_box.innerHTML = "아이디는 영문자, 숫자 최소 1개 이상 포함해서 최소 3글자에서 12글자로 입력해주세요!";
  } else if (!regex_pwd.test(password)){
    error_box.innerHTML = "비밀번호는 영문자, 숫자, 특수문자를 최소 1개 이상 포함해서 최소 6글자에서 20글자로 입력해주세요!";
  } else {
    this.submit();
  }
});

// 뒤로가기
let back = document.getElementById("back");
back.addEventListener("click", function() {
    window.location.href = "/login";
})

