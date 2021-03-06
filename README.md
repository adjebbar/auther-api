# Auther API

[![Lint](https://github.com/AutherOrg/auther-api/workflows/Lint/badge.svg)](https://github.com/AutherOrg/auther-api/actions?query=workflow%3A%22Lint%22)
[![Code style](https://img.shields.io/badge/Code_style-standard-brightgreen.svg)](https://github.com/standard/standard)

Auther API to host and share online Blockcerts certificates.

Demo: https://auther.org/demo

## Introduction

**Auther-API** is an opensource API to host and share online Blockcerts certificates.

This project is purely a backend server. It's intended to be used with the [Auther client](https://github.com/AutherOrg/auther-client) project.

## Requirements

+ Node.js (version >= 10, version 13 prefered).
+ A database (MySql >= 5.7.8 or MariaDb >= 10.2.7)

## Installation

### Development mode

````
yarn install
cp .env.example .env
````

*If you don't have yarn, you can use npm instead.*

Edit .env to set your credentials, the administrator account and other settings. For PASSPORT_SECRET you can use this generator for instance: https://codepen.io/corenominal/pen/rxOmMJ

Init the database:

````
yarn initdb
````

Start the server (development mode):

````
yarn start
````

### Production mode

#### PM2

You can manage the application service as you want. Here is a short example with [PM2](https://pm2.keymetrics.io/):

+ Install PM2 globally: `yarn global add pm2`
+ Start a PM2 app: `pm2 start src/server.js --name api.prod`
+ Tail the PM2 logs: `pm2 logs`
+ Monitor the PM2 logs : `pm2 monitor`
+ Flush the PM2 logs: `pm2 flush`

By default, the logs are in `$HOME/.pm2/logs/`.

##### Rotate & compress logs with PM2

To rotate & compress logs with PM2 you can use [PM2 log-rotate](https://github.com/keymetrics/pm2-logrotate): `pm2 install pm2-logrotate`

For instance to use the default settings and compress the rotated files: `pm2 set pm2-logrotate:compress true`

#### Nginx proxy

You can either directly expose the API to the outside on the port SERVER_PORT defined in .env.

Or you can use a Nginx proxy and forward IPs, for instance (without HTTPS but it's of course advised in prod):

````
server {
  listen *:80;
  server_name api.auther.org;
  location / {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    #proxy_set_header X-Forwarded-Proto https;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Host $remote_addr;
    proxy_pass http://127.0.0.1:4000/;
    client_max_body_size 5m;
  }
}
````

... where `4000` in `proxy_pass http://127.0.0.1:4000/` is SERVER_PORT defined in .env.

Of course HTTPS is way better but let's keep this doc simple.

## Logs

There are 4 kinds of logs:

### Server start

This is just a message when starting the server, specifying on which port it's running.

### HTTP requests

All HTTP requests are logged by [Morgan](https://github.com/expressjs/morgan) with this custom format:

`':remote-addr :user-id :method :url HTTP/:http-version :status :response-time'`

where `:user-id` is a custom token resolving to `-` for unauthenticated requests and to the user ID in the database for authenticated users (example: `123`).

### Database queries

All database queries are logged by default by [Sequelize](https://sequelize.org/), the ORM used in this project.

### Sent emails

All the emails sent by the server are logged with the format:

`to, text, result` where:

+ to is the recipient email address
+ text is the message in text format
+ result is either success or an error message

## Customization

See .env.example and adapt your .env file.

## Troubleshooting

You can test the emails send configuration and PDF generation with:

````yarn test````

PDF generation can be tricky, especially with custom fonts and global size increase of render. For the fonts, they must be installed in the system in order for PhantomJS to use them. For the global size increase, on a classic server there is no Xorg, just a framebuffer which is generally in 1024x768. So without corrections, the PDF output you see on your say 1920x1080 local machine will be a lot magnified on the production server.

The corrections are made for a 1024x768 server with a local dev machine in 1920x1080. You can adjust things in .env, especially the font size in PDF_STYLE_WRAPPER.

Please refer to https://github.com/marcbachmann/node-html-pdf and https://github.com/ariya/phantomjs for further documentation.

Oh, and I started by using Puppeteer. But ditched it. It requires to install a lot of Xorg librairies, even sound librairies. This is very bad on a server. So I kept PhantoJS despite it being deprecated.

## General discussion, installation and configuration help

+ [Auther.org forum](https://auther.org/forum)

## Technical support and development services

+ You can [contact Auther's original author](https://guillaumeduveau.com/en/contact)

## Development

Please read the [contribution guidelines](CONTRIBUTING.md).

## Credits

+ [GIZ](https://www.giz.de/en/html/index.html) (Deutsche Gesellschaft für Internationale Zusammenarbeit GmbH): this application has been originally developed with financial support by GIZ Lab.
+ [SEAMEO INNOTECH](https://www.seameo-innotech.org/) (Regional Center for Educational Innovation and Technology, Southeast Asian Ministers of Education Organization) : this application has been originally developed for SEAMEO-INNOTECH.
