console.log('\n--------------------\n');

const https = require('node:https');
const fs = require('node:fs');


let kuca_hranjena = false;
let date;
// na svakih 10 sekundi resetuje kuca_hranjena na false
setInterval(() => {
  date = new Date();
  if (date.getSeconds() %10  == 9) {
    kuca_hranjena = false;
  };
}, 1000);

// cacekaj sati: 0 - sad, Kad je 0 sati resetuj varijablu. Tad pokreni, npr u funkciji interval od 24 sata da resetuje var.

// const options = {
//   key: fs.readFileSync('./pem/private-key.pem'),
//   cert: fs.readFileSync('./pem/certificate.pem'),
// }

const options = {
  pfx: fs.readFileSync('./pem/test_cert.pfx'),
  passphrase: 'sample',
};

const server = https.createServer(options);
server.on('request', (req, res) => {
  const {method, url} = req;
  
  console.log('request');

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
      // find file extension: (dot followed by char) that's at the end of the filename
      let file_extension = url.match(/(\.[a-z]+)$/g);
      let appropriate_mimeType = extMimeType[file_extension];
      fs.readFile(`.${url}`, (err, data) => {
	res.setHeader('Content-type', appropriate_mimeType)
	res.end(data);
      });
    }
    break;
  } // sw(method)


}); // server
server.listen(8000);

let extMimeType = {
  '.png': 'image/png',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg'
}











