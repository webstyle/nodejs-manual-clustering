function parseRequest(str) {
   return JSON.parse(str);
}

function randomNumber() {
   return Math.round(Math.random() * 100);
}

// Worker handler
// Do something
process.on('message', (params) => {
   const parsed = parseRequest(params);
   console.log(`${parsed.method}:${parsed.url} request handled by ${process.pid} process`)

   // some code for calculating numbers
   // ...
   const data = randomNumber() * randomNumber();

   // Sending result to parent node
   process.send(`Hello world from ${process.pid}, calculated: ${data}`)
});
