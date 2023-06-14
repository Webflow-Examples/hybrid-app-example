const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const proxy = require('http-proxy');

// This code is used to proxy https requests to the Next.js dev server
// Source: https://github.com/vercel/next.js/discussions/10935#discussioncomment-3624120

// To generate the self signed certificate thats needed for this to work:
// - Generate a RSA key…
//     - openssl genrsa -out server.key 2048
//     - This creates a server.key file in your current directory.
// - Generate a CSR…
//     - openssl req -new -key server.key -out server.csr
//     - Fill out the info prompted for and just hit enter on email address and password
//     - This creates a server.csr file in your current directory.
// - Generate a self signed certificate…
//     - openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
const cert = path.join(process.cwd(), 'server.crt');
const key = path.join(process.cwd(), 'server.key');

proxy
	.createServer({
		xfwd: true,
		ws: true,
		target: {
			host: 'localhost',
			port: 3001,
		},
		ssl: {
			key: fs.readFileSync(key, 'utf8'),
			cert: fs.readFileSync(cert, 'utf8'),
		},
	})
	.on('error', function (e) {
		console.error(chalk.red(`Request failed to proxy: ${chalk.bold(e.code)}`));
	})
	.listen(3000);