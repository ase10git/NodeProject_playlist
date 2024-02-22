// 1. 모듈 - require
const express = require('express');
const app = express();

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { Op, Sequelize, literal } = require("sequelize");
const MySQLStore = require("express-mysql-session")(session);

// db
const db = require('./models');
const {Music, User, Genre} = db;

// MySQLStore 옵션
const dbOption = {
  host: '127.0.0.1',
  port: '3307',
  user: 'root',
  password: 'pwd',
  database: 'blog',
}

// 2. use, set - 등록
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({extended : true}));


// 초기화, 사용자 인증 요청 처리할수 있도록 함
app.use(passport.initialize());

// 세션을 사용하기 위한 옵션 설정
app.use(session({
  secret: '4154@#$%&*(6586/*163',
  resave : false, // 
  saveUninitialized : false,
  cookie : {maxAge : 60 * 60 * 1000},
  store : new MySQLStore( dbOption ), // 세션 저장위치
}));

// 세션 사용하도록 설정
app.use(passport.session());

// 로그인 검증 - 검증 방법
passport.use(new LocalStrategy(async (username, pw, done) => {

  let result = await User.findOne({ where : { username : username}});
  if (!result) {
    return done(null, false, { message: '아이디 DB에 없음' });
  }

  if (result.password != pw) {
    return done(null, false, { message: '비번불일치' });
  }

  return done(null, result);
}));

// 세션 생성
passport.serializeUser( (user, done) =>{
  process.nextTick(() => {    
    done(null, { id: user.id, username: user.username });
  });
});

// 유저 접속할 때 - 세션 검사
passport.deserializeUser( async (user, done) => {
  let result = await User.findOne({where : {id : user.id}})
  
  if(result){
    const newUserInfo={
      id : result.id,
      username : result.username
    }

    process.nextTick(() => {
      return done(null, newUserInfo);
    });
  }
});


// 3. listen - 포트번호 지정
let port = 8081;
app.listen(port , ()=>{
  console.log('접속 성공! - http://localhost:'+port)
});


// 4. 라우팅
app.get('/', async (req, res)=>{
  res.redirect('/login');
});

// 로그인 페이지로 이동
app.get('/login', (req, res)=>{
  res.render('login.ejs');
});

// 로그인 실패 시 처리
app.get('/login/:state', (req, res)=>{
  let {state} = req.params
  if(state== 'fail'){
    res.render('login-fail.ejs');
  }
});

// 에러 페이지
app.get("/error", (req, res) => {
  res.render("error.ejs");
});

// 로그아웃
app.get('/logout', (req, res)=>{
    req.logout(()=>{
      res.redirect('/login');
  });
});

// 로그인
app.post('/login', (req, res)=>{

  passport.authenticate('local', (error, user, info)=>{
    // DB 에러
    if (error) return res.status(500).json(error);
    // DB에 등록된 계정이 없음
    if (!user) return res.redirect('/login/fail');
    // 로그인
    req.logIn(user, (err) => {  
      if (err) return next(err);
      res.redirect('/music-list');
    })
  })(req,res);

});

// 회원가입
app.get("/join", async function(req, res) {
  res.render("join.ejs", {isJoined : {message : ''}});
})

app.post("/join", async function(req, res) {
  const newUser = {
    username : req.body.username,
    password : req.body.password
  }

  try {
    const result = await User.findOne({where: {username : newUser.username}});

    let isJoined = '';
    if (result == null) {
      await User.create(newUser);
      isJoined = 'success';
      res.render("join.ejs", {isJoined : {message : isJoined}});
      
    } else {
      isJoined = 'fail';
      res.render("join.ejs", {isJoined : {message : isJoined}});
    }
  } catch (error) {
    res.redirect("/error");
  }
});

// 메인 : 로그인 후 음악 리스트 페이지
app.get('/music-list', async (req, res) => {

  if (req.isAuthenticated()) {
      const userInfo = req.user;
      const username = userInfo.username;
      const userId = userInfo.id;
      try {
          // 로그인 한 사용자의 플레이 리스트 출력
          let musicList = await Music.findAll({where:{userId}});

          // 장르 테이블에서 장르의 정보를 가져옴
          const allGenreList = await Genre.findAll();

          res.render('main.ejs', {username, userId, musicList, allGenreList});
      } catch (error) {
          console.log(error);
          res.status(500).send('서버 DB 연결 에러!');
      }
  } else {
      res.redirect("/login");
  }
});

// 음악을 이름이나 아티스트로 검색
app.get("/search", async (req, res) => {
  let {name, artist} = req.query;

  if (req.isAuthenticated()) {
    const userInfo = req.user;
    const username = userInfo.username;
    const userId = userInfo.id;

    console.log(name)
    console.log(artist)
    let musicList;
    try {
      
      // 장르 테이블에서 장르의 정보를 가져옴
      const allGenreList = await Genre.findAll();
      if(name) { // 이름으로 검색 시
        musicList= await Music.findAll({
          where: Sequelize.and(
                  Sequelize.where(
                    Sequelize.fn('lower', Sequelize.col('musicName')), 
                    {[Op.like]:`%${name.toLowerCase()}%`}
                  ),
                {userId}
              )
        });
        console.log(musicList)
        res.render("main.ejs", {username, userId, musicList, allGenreList});
      } else if (artist) { // 아티스트로 검색 시
        musicList = await Music.findAll({
          where: Sequelize.and(
                  Sequelize.where(
                    Sequelize.fn('lower', Sequelize.col('artistName')), 
                    {[Op.like]:`%${artist.toLowerCase()}%`}
                  ),
                {userId}
              )
        });

        res.render("main.ejs", {username, userId, musicList, allGenreList});
      } else { // 검색 내용이 없을 때

        musicList = await Music.findAll({where:{userId}});
        res.render("main.ejs", {username, userId, musicList, allGenreList});
      }

    } catch (error) {
      console.log(error);
      res.redirect("/error");
    }
  } else {
    res.redirect("/login");
  }
});

// 음악을 장르별로 보기
app.get('/genre/:genreId', async (req, res) => {
  let {genreId} = req.params;

  if (req.isAuthenticated()) {
      const userInfo = req.user;
      const username = userInfo.username;
      const userId = userInfo.id;      
      
      try {
        // 장르 테이블에서 장르의 정보를 가져옴
        const allGenreList = await Genre.findAll();

        let musicList = await Music.findAll({
          where: {
            genreList: literal(`JSON_CONTAINS(genreList, '${genreId}')`),
            userId : userId
          },
          order: [['publishDate', 'DESC']]
        });
        
        // 요청한 사용자가 현재 접속한 사용자일때만 렌더링
        res.render('genre.ejs', {username, userId, allGenreList, musicList});
      } catch (error) {
        console.log(error);
        res.redirect("/error");
      }
  } else {
    res.redirect("/login");
  }
});

// 음악 상세보기
app.get("/:music_id", async (req, res) => {
  
  if (req.isAuthenticated()) {
    const userInfo = req.user;
    const username = userInfo.username;
    const userId = userInfo.id;

    let {music_id} = req.params;

      try {
        // 음악 검색
        const music = await Music.findOne({
          where:{id : music_id}
        });
        // 음악의 장르를 번호로 조회
        const genreList = await Genre.findAll({
          where : {
            id : music.genreList
          }
        });

        // 장르 테이블에서 장르의 정보를 가져옴
        const allGenreList = await Genre.findAll();

        // 요청한 사용자가 현재 접속한 사용자일때만 렌더링
        if (music.userId == userId) {
          res.render("music.ejs", {music, userId, username, genreList, allGenreList});
        } else {
          res.redirect("/error");
        }
      } catch (error) {
        res.redirect("/error");
      }
  } else {
    res.redirect("/login");
  }
});

// 음악 추가
app.post("/add", async (req, res) => {
  
  if (req.isAuthenticated()) {

    const newMusic = req.body;

    // 장르를 체크하지 않거나 1개만 체크했을 경우 길이를 판별하기 위한 배열 변환
    const genreListArray = newMusic.genreList ? [newMusic.genreList].flat() : [];
    // console.log(genreListArray)
    try{
      if (genreListArray.length == 0) { // 선택한 장르 없음
        newMusic.genreList = '[]';
      } else if (genreListArray.length == 1) { // 선택한 장르 1개
        newMusic.genreList = genreListArray.map(Number);
      } else { // 장르를 2개 이상 선택
        newMusic.genreList = newMusic.genreList.map(Number);
      }
      console.log(newMusic);
      let result = await Music.create(newMusic);
      res.redirect("/music-list");
    } catch{
      res.redirect("/error");
    }
  } else {
    res.redirect("/login");
  }
});

// 음악 수정
app.put("/edit/:id", async (req, res) => {
  
  if (req.isAuthenticated()) {
    const {id} = req.params;
    const newInfo = req.body;

      try {
        // 수정 요청 내용 중 장르 목록을 ["1", "3", "4"]에서 [1, 3, 4] 형태로 변환
        newInfo.genreList = newInfo.genreList.map(Number);

        const music = await Music.findOne({where: {id}}) 
        // 내용 바꾸기
        Object.keys(newInfo).forEach((prop)=>{
          music[prop] = newInfo[prop]
        })

        // db저장
        await music.save()
        // console.log(result);
        res.redirect(`/${id}`);
      } catch (error) {
        console.log(error);
        res.redirect("/error");
      }
  } else {
    res.redirect("/login");
  }
});

// 음악 삭제
app.delete("/delete/:id", async (req, res) => {
  
  if (req.isAuthenticated()) {
    const userInfo = req.user;
    const userId = userInfo.id;

    const {id} = req.params;

      try {
        // 음악 조회
        const music = await Music.findOne({where:{id}});
        // 해당 음악을 등록한 사용자만 삭제 요청 가능
        if(userId == music.userId) {
          let result = await Music.destroy({where:{id}});
            res.redirect('/music-list');
        }
      } catch (error) {
          console.log(error);
          res.redirect("/error");
      }

  } else {
    res.redirect("/login");
  }
});

