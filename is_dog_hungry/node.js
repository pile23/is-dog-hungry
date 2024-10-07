console.log('\n--------------------\n');

const http = require('node:http');
const fs = require('node:fs');


let kuca_hranjena = false;
let date = new Date();
setInterval(() => {
  date = new Date();
  if (date.getSeconds() %10  == 9) {
    kuca_hranjena = false;
    console.log('kuca_hranjena: ', false);
  };
}, 1000);

// posle ponoci timeout od 11:59 minuta, pa onda pocne na svakih 10 sekundi da proverava vreme
// iskoristiti event emiter da posle izmene na fals pokrene opet gornji red 

const server = http.createServer();
server.on('request', (req, res) => {
  const {method, url} = req;
  // routes
  switch (method) {
  case 'GET':
    switch  (url) {
    case '/kuca-hranjena':
      if (!kuca_hranjena) {
	fs.readFile("./index_nije_hranjena.html", (err, data) => {
	  if (err) {
	    throw (err);
	    res.statusCode = 404;
	    res.setHeader('Content-Type', 'text/html');
	    res.end('Doslo je do greske')
	  }
	  res.setHeader('Content-Type', 'text/html');
	  res.end(data);
	}); // readFile
      } else if(kuca_hranjena) {
	fs.readFile("./index_jeste_hranjena.html", (err, data) => {
	  if (err) {
	    throw (err);
	    res.statusCode = 404;
	    res.setHeader('Content-Type', 'text/html');
	    res.end('Doslo je do greske')
	  }
	  res.setHeader('Content-Type', 'text/html');
	  res.end(data);
	}); // readFile
      }
      break;
    case '/kuca-hranjena/jeste':
      kuca_hranjena = true;
      fs.readFile('./index_jeste_hranjena', (err, data) => {
	res.setHeader('Content-Type', 'text/html');
	res.end(data);
      })
      break;
    case '/style.css':
      fs.readFile("./style.css", (err, data) => {
	res.setHeader('Content-Type', 'text/css');
	res.end(data);
      });
      break;
    case '/script.js':
      fs.readFile("./script.js", (err, data) => {
	res.setHeader('Content-Type', 'text/javascript');
	res.end(data);
      });
      break;
      case '/script_jeste_hranjena.js':
      fs.readFile("./script_jeste_hranjena.js", (err, data) => {
	res.setHeader('Content-Type', 'text/javascript');
	res.end(data);
      });
      break;
    } // sw(url)
    if (url.search(/\/slike/) == 0) {
      let file_extension = url.match(/(\.[a-z]+)$/g);
      let appropriate_mimeType = extMimeType[file_extension];
      fs.readFile(`.${url}`, (err, data) => {
	res.setHeader('Content-type', appropriate_mimeType)
	res.end(data);
      });
    }
    break;
  } // sw(method)

  // ako se trazi sajt proveriti varijablu dal je kuca hranjena i u zavisnosti od toga opsluziti odgovarajucu stranicu
  // if: /kuca-hranjena/jeste
  // upisi u varijalbu da je hranjena
  // ne vracaj sajt da je hranjena jer ce fetch za par sekundi da zatrazi



}); // server
server.listen(3202);

let extMimeType = {
  '.png': 'image/png',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg'
}





// functions








