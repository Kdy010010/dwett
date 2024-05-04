const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const multer = require('multer');
const path = require('path');

// 파일 업로드를 위한 Multer 설정
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/'); // 파일이 저장될 폴더 설정
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // 파일명 설정
  }
});
const upload = multer({ storage: storage });

// 루트 URL에 접속했을 때 index.html 파일을 반환
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// 파일 업로드를 처리하는 라우트
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('File uploaded successfully');
});

// 소켓 IO를 사용하여 채팅 구현
io.on('connection', (socket) => {
  console.log('a user connected');

  // 클라이언트로부터 받은 채팅 메시지를 다른 클라이언트들에게 브로드캐스트
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// 서버를 3000 포트로 시작
http.listen(3000, () => {
  console.log('listening on *:3000');
});
