//node index.js per eseguire il file nel terminale
const fs = require("fs"); //fs sta per file system
const http = require("http");
const url = require("url");

//#region Synchronous - blocca il codice
//Lettura di un file - 1 parametro: path del file, 2 parametro: encoding
const input = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(input);
//Scrittura di un file - 1 parametro: path del file, 2 parametro: cosa scrivere
const output = `Questo è quello che sappiamo sulle avocado: ${input}.\nCreato il ${Date.now()}`;
fs.writeFileSync("./txt/output.txt", output);
console.log("File scritto!");
//#endregion
//#region Asynchronous - non blocca il codice
//Con la versione asincrona puoi passare una funzione di callback come terzo parametro per gestire il risultato della lettura. La funzione ha due parametri: errore e dati. Se non c'è errore, i dati saranno i dati letti dal file. Se c'è un errore, i dati saranno null. Ecco un esempio:
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
//#endregion
//#region HTTP Server
//Leggi il file una volta sola e salva i dati in una variabile
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
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

const dataObj = JSON.parse(data);
const replaceTemplate = (template, product) => {
  let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

  return output;
};

const server = http.createServer((req, res) => {
  //req.url è il percorso della richiesta
  const pathName = req.url;
  //Qui controllo il percorso della richiesta e restituisco una risposta diversa in base al percorso

  const { query, pathname } = url.parse(req.url, true);

  //Overview Page
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(template_card, el))
      .join("");
    //console.log(cardsHtml);
    res.end(template_overview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml));
  }
  //Product Page
  else if (pathName === "/product") res.end("This is the PRODUCT");
  //API
  else if (pathName === "/api") {
    //Se avessimo letto qui i dati, il server li andrebbe a leggere ogni volta che viene fatta una richiesta, rallentando il server, quindi è meglio leggerli una volta sola e salvarli in una variabile
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    //Not Found
  } else {
    //Se il percorso non è stato trovato, restituisco un errore 404
    res.writeHead(404, {
      //Specifico il tipo di contenuto
      "Content-type": "text/html",
      //Specifico un header personalizzato
      "my-own-header": "hello-world",
    });
    //res.end() è usato per inviare una risposta al client
    res.end("<h1>Page not found!</h1>");
  }
});
//server.listen() è usato per far ascoltare il server su una porta specifica, se non specifico l'indirizzo IP, il server sarà accessibile da qualsiasi indirizzo IP
server.listen(3000, "127.0.0.1", () => {
  console.log("Server in ascolto sulla porta 3000...");
});
//#endregion HTTP Server
//#region Status Code
//All Status code:
//200 - OK
//201 - Created
//202 - Accepted
//204 - No Content
//300 - Redirect
//301 - Moved Permanently
//302 - Found
//303 - See Other
//304 - Not Modified
//307 - Temporary Redirect
//400 - Bad Request
//401 - Unauthorized
//403 - Forbidden
//404 - Not Found
//405 - Method Not Allowed
//410 - Gone
//500 - Internal Server Error
//501 - Not Implemented
//503 - Service Unavailable
//#endregion Status Code
