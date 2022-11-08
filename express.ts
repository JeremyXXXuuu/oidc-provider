import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import {Provider, ResponseType} from 'oidc-provider';
import mongoose from 'mongoose';
import Account from './support/account'
import {User} from './support/user'
import path from 'path'


dotenv.config();
const port = process.env.PORT;

const configuration = {
    clients: [{
         client_id: "oidcCLIENT",
         client_secret: "Some_super_secret",
         grant_types: ["authorization_code"],
         redirect_uris: [ "http://localhost:8000/login/callback"],
         response_types : ['code' as const],
         //other configurations if needed
    }],
    pkce: {
    methods : ['S256' as const],
    required: () => false,
    },
};
const app = express();
const oidc = new Provider('http://localhost:4000', configuration);
//Middlewares
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.listen(4000, function () {
  console.log('OIDC is listening on port 4000!');
});
app.use("/oidc", oidc.callback());