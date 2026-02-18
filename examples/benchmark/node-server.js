// examples/benchmark/node-server.js - Node.js HTTP 서버 벤치마크용
// 실행: node node-server.js
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Hello from Node.js" }));
});

server.listen(3000);
