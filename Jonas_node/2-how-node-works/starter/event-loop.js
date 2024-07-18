const fs = require("fs");
const { nextTick } = require("process");
const crypto = require("crypto");

const start = Date.now();
setTimeout(() => {
  console.log("Timer 1 finished");
}, 0);
setImmediate(() => {
  console.log("Immediate 1 finished");
});
fs.readFile("test-file.txt", () => {
  console.log("I/O finished");

  setTimeout(() => {
    console.log("Timer 2 finished");
  }, 0);
  setTimeout(() => {
    console.log("Timer 3 finished");
  }, 3000);

  nextTick(() => {
    console.log("NextTick 1 finished");
  });

  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log("Password encrypted in " + (Date.now() - start) + " ms");
  });
});
console.log("Hello from the top-level code");

// Sequence of events
// Hello from the top-level code
// Timer 3 finished
// Immediate 3 finished
// I/O finished
// NextTick 1 finished
// Timer 4 finished
// Timer 5 finished
