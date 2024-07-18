//npm module
const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
//Modulo che ho creato io
const replaceTemplate = require("./modules/replace_template.js");

//Sync
const input = fs.readFileSync("./txt/input.txt", "utf-8");
//console.log(input);
const output = `Questo è quello che sappiamo sulle avocado: ${input}.\nCreato il ${Date.now()}`;
fs.writeFileSync("./txt/output.txt", output);
//console.log("File scritto!");

//Async
fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
  if (err) return console.log("Errore! 💥");
  if (data1) return data1;
  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    if (err) return console.log("Errore! 💥");
    if (data2) return data2;
    fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
      if (err) return console.log("Errore! 💥");
      if (data3) return data3;
      fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
        if (err) return console.log("Errore! 💥");
        console.log("File scritto!");
      });
    });
  });
});

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
const template_product = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  `utf-8`
);
const template_overview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  `utf-8`
);
const template_card = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  `utf-8`
);

const server = http.createServer((req, res) => {
  console.log(url.parse(req.url, true));
  const { query, pathname } = url.parse(req.url, true);

  //Overview Page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(template_card, el))
      .join("");
    //console.log(cardsHtml);
    res.end(template_overview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml));
  }
  //Product Page
  else if (pathname === "/product") {
    //console.log(query, pathname);
    const product = dataObj[query.id];
    res.writeHead(200, { "Content-type": "text/html" });
    const output = replaceTemplate(template_product, product);
    res.end(output);
  }
  //API
  else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    //Not Found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found!</h1>");
  }
});
server.listen(3000, "127.0.0.1", () => {
  console.log("Server in ascolto sulla porta 3000...");
});

console.log(
  slugify("Alex Violatto", {
    replacement: "-", //Ripiazza gli spazi vuoti con -
    remove: null, //Non rimuovere nulla
    lower: true, //Converti tutto in minuscolo
  })
);

//const slugs = [ dataObj => productName ]creami un nuovo array con tutti i nomi di dataObj formattati con slugify
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
//console.log(slugs);
