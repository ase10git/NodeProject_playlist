# 플레이리스트 사이트
- 학원 수업 시간에 진행한 Node.js 프로젝트로, 프로젝트 설명 구성은 평가 형식을 참조하였다.
- 수정 날짜 2024.02.22

## 1.	프로젝트 주제
-	사용자 별로 음악 플레이리스트를 만드는 사이트 제작한다.
-	사용자의 이름과 비밀번호를 저장하고, 사용자 별로 플레이리스트를 생성해 음악을 조회, 추가, 수정, 삭제하는 기능을 제공한다.

## 2.	기술 스택
-	Frontend: HTML5, CSS3, Bootstrap, JavaScript (ES6)
-	Backend: Node.js, Express.js, EJS (Embedded JavaScript)
-	Database: MySQL, Sequelize

## 3.	기능
-	사용자 정보 등록(이름, 비밀번호)
-	사용자가 등록한 음악 전체 조회, 추가, 수정, 삭제
-	사용자가 등록한 음악 이름, 아티스트, 장르별 조회
-	음악 상세보기에서 음악을 유튜브로 즉시 재생 가능
-	사용자 인증(로그인 및 세션)
-	본인이 등록한 음악만 조회, 수정, 삭제가 가능하며, 다른 사용자의 음악엔 접근 불가

## 4.	구현
1. Frontend
a. Bootstrap을 사용하여 반응형 UI를 구현
b. JavaScript (ES6)를 활용하여 클라이언트 측의 상호작용 기능 추가
	- 로그인, 회원가입 기능, 로그인 후 메인 페이지에서 로그아웃 가능
  - 플레이리스트 테마에 맞는 css를 적용하여 화면을 구현
	- bootstrap을 사용하여 웹 페이지 사이즈에 따라 각 요소들의 크기와 배치가 변하도록 설정
		- 음악 추가와 수정을 위한 form 구성
		- 음악 조회에 필요한 검색창(이름과 아티스트 선택)과 장르별 음악 검색을 위한 버튼 구성

2. Backend
a. Node.js와 Express.js를 사용하여 서버를 구축
b. EJS를 사용하여 동적인 웹 페이지를 생성
  -	웹 페이지에서 form을 통해 전송된 데이터를 가공 및 판단 후 DB에 전달
  -	Restful API 구현(Get, Post, Put Delete)
  -	JSON 데이터 변환을 통해 웹 페이지와 DB간의 데이터 연결

3. Database
a. MySQL을 사용하여 사용자와 음악, 장르 정보를 저장
b. Sequelize ORM을 통해 데이터베이스와의 상호작용을 처리
  -	조건별 조회, 수정, 추가, 제거 구현
c. Express.js와 Mysql 연동의 session 저장
  -	Express-mysql-session을 사용하여 DB에 유효 시간이 1시간인 session을 저장하고, 로그아웃을 하면 세션 정보를 자동으로 삭제

## 5.	결과 및 성과
-	사용자가 원하는 음악을 사이트에 저장하여 관리할 수 있음
-	Sequelize를 사용하여 데이터베이스를 관리할 수 있으며, 데이터의 일관성과 안정성을 유지할 수 있음

## 6.	개발 과정 문제점과 해결
1.	로그인 인증 문제
  - DB의 테이블을 전부 drop하고 다시 생성해서 진행해도 로그인 인증 부분만 작동이 안되서 실습 때 코드와 DB를 사용
2.	음악 데이터 추가 및 수정 시 장르 목록 처리
  - 음악 테이블에 장르를 JSON 배열 형태로 저장하여 한 음악의 장르를 여러 개 저장하도록 설계했었음.
  - 이 정보와 장르 테이블에 있는 장르 목록을 이용하여 DB에서 장르 번호 배열의 내용으로 장르 이름들을 검색해서 화면에 출력함.
  - 정보를 추가 및 수정할 때는 `<input type=”checkbox”>`와 `<form>`을 사용하여 체크된 장르의 번호들을 배열 형태로 저장하고, DB에 저장할 때 `‘[1, 3, 5]’` 형식으로 저장하도록 Array 객체의 map(Number) 메소드를 사용함.
3.	음악을 이름이나 아티스트로 조회 시 Sequelize 구문 작성
  - `<select>`와 `<option>`을 사용해서 이름과 아티스트 옵션을 선택하고, `<select>`의 현재 value를 읽어와 그 내용이 이름인지 아티스트인지 따라 query string을 작성하여 `<input>`에 입력한 내용을 서버쪽으로 전송함.
  - 서버에서는 수신한 내용을 사용하여 음악 테이블에서 이름 또는 아티스트 컬럼에서 검색 내용을 대소문자 구분 없이 조회하고, 결과를 페이지에 전송함.
  - 검색 내용이 없는 경우엔 사용자가 등록한 음악 전체가 나오도록 설정함. S
  - equelize로 SQL 구문을 작성할 때 JSP에서 MyBatis를 사용하여 SQL문을 작성할 때와 다르게 객체 및 JSON 형태로 구문을 작성해야 해서 조건이 여러 개인 경우를 설정할 때 난감했음.
4.	장르별 음악 조회 시 JSON 데이터 처리
  - 장르 테이블엔 장르 번호와 이름이 저장되어 있는데, 음악 테이블에 있는 장르 리스트 컬럼은 장르를 JSON 배열 형태로 저장하기에 `‘[1, 11]’`과 같은 형식으로 저장되어 있음.
  - 특정 장르의 번호가 해당 음악의 장르 리스트 값에 포함되어 있는지 확인할 Sequelize 구문을 작성해야 했고, JSON_CONTAINS를 사용하여 이를 해결함.
5.	Sequelize로 MySQL에 INNER를 사용하기 위해 Model 설정 시 문제점
  - 각 테이블의 model js 파일에서 외래키 관계를 설정해주고 migrate를 해주었지만 console에서는 두 테이블간의 관계가 없다는 문제가 발생함.
  - model 옵션을 재설정하고 다시 migrate해도 해결되지 않아 사용자와 음악 테이블 각각에서 id를 이용해 조회함.
  - 만약 연결이 잘 되었다면 사용자와 음악 테이블을 JOIN한 VIEW를 생성해서 두 조건에 부합하는 데이터가 필요할 때 VIEW를 불러와서 사용함으로써 DB에 접근하는 횟수를 줄일 수 있었을 것으로 예상됨.

## 7.	향후 계획
1.	사용자 정보 저장 시 이메일, 이름, 비밀번호, 프로필 사진 파일 이름을 저장하도록 변경
2.	발매 연도별 음악 조회
3.	음악 이미지나 사용자 프로필 사진 업로드 및 삭제 기능
4.	회원 삭제와 회원 삭제 시 등록된 음악 제거
5.	관리자 추가와 관리자 권한별 기능(전체 회원 조회, 삭제)

