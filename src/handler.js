function parseRequest(str) {
   return JSON.parse(str);
}

process.on('message', (params) => {
   const parsed = parseRequest(params);
   console.log(`${parsed.method}:${parsed.url} request handled by ${process.pid} process`)
   process.send(`Hello world from ${process.pid}`)
});
