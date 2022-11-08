import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import {Provider, InteractionResults} from 'oidc-provider';
import mongoose from 'mongoose';
import Account from './support/account'
import {User} from './support/user'
import path from 'path'
import bodyParser from 'body-parser';
import assert from 'assert'

import {configuration} from './support/configuration';
import { type } from 'os';

dotenv.config();
const port = process.env.PORT;
const MONGO_URI = process.env.DB_URI || "mongodb://localhost:27017/";

const oidc = new Provider(`http://localhost:${port}`, configuration);

// const oidc = new Provider(`http://localhost:${port}`, {
//     clients: [
//         {
//           client_id: 'foo',
//           redirect_uris: ['http://localhost:8000/login/callback'], // using jwt.io as redirect_uri to show the ID Token contents
//           grant_types: ["authorization_code"],
//           client_secret: "Some_super_secret",
//           token_endpoint_auth_method: 'none',
//         },
//       ],
//       cookies: {
//         long: { signed: true },
//         short: { signed: true },
//         keys: ['some secret key', 'and also the old rotated away some time ago', 'and one more'],
//       },
//       interactions: {
//         url(ctx, interaction) {
//           return `/interaction/${interaction.uid}`;
//         },
//       },
//       jwks: {
//         keys: [
//           {
//             d: 'VEZOsY07JTFzGTqv6cC2Y32vsfChind2I_TTuvV225_-0zrSej3XLRg8iE_u0-3GSgiGi4WImmTwmEgLo4Qp3uEcxCYbt4NMJC7fwT2i3dfRZjtZ4yJwFl0SIj8TgfQ8ptwZbFZUlcHGXZIr4nL8GXyQT0CK8wy4COfmymHrrUoyfZA154ql_OsoiupSUCRcKVvZj2JHL2KILsq_sh_l7g2dqAN8D7jYfJ58MkqlknBMa2-zi5I0-1JUOwztVNml_zGrp27UbEU60RqV3GHjoqwI6m01U7K0a8Q_SQAKYGqgepbAYOA-P4_TLl5KC4-WWBZu_rVfwgSENwWNEhw8oQ',
//             dp: 'E1Y-SN4bQqX7kP-bNgZ_gEv-pixJ5F_EGocHKfS56jtzRqQdTurrk4jIVpI-ZITA88lWAHxjD-OaoJUh9Jupd_lwD5Si80PyVxOMI2xaGQiF0lbKJfD38Sh8frRpgelZVaK_gm834B6SLfxKdNsP04DsJqGKktODF_fZeaGFPH0',
//             dq: 'F90JPxevQYOlAgEH0TUt1-3_hyxY6cfPRU2HQBaahyWrtCWpaOzenKZnvGFZdg-BuLVKjCchq3G_70OLE-XDP_ol0UTJmDTT-WyuJQdEMpt_WFF9yJGoeIu8yohfeLatU-67ukjghJ0s9CBzNE_LrGEV6Cup3FXywpSYZAV3iqc',
//             e: 'AQAB',
//             kty: 'RSA',
//             n: 'xwQ72P9z9OYshiQ-ntDYaPnnfwG6u9JAdLMZ5o0dmjlcyrvwQRdoFIKPnO65Q8mh6F_LDSxjxa2Yzo_wdjhbPZLjfUJXgCzm54cClXzT5twzo7lzoAfaJlkTsoZc2HFWqmcri0BuzmTFLZx2Q7wYBm0pXHmQKF0V-C1O6NWfd4mfBhbM-I1tHYSpAMgarSm22WDMDx-WWI7TEzy2QhaBVaENW9BKaKkJklocAZCxk18WhR0fckIGiWiSM5FcU1PY2jfGsTmX505Ub7P5Dz75Ygqrutd5tFrcqyPAtPTFDk8X1InxkkUwpP3nFU5o50DGhwQolGYKPGtQ-ZtmbOfcWQ',
//             p: '5wC6nY6Ev5FqcLPCqn9fC6R9KUuBej6NaAVOKW7GXiOJAq2WrileGKfMc9kIny20zW3uWkRLm-O-3Yzze1zFpxmqvsvCxZ5ERVZ6leiNXSu3tez71ZZwp0O9gys4knjrI-9w46l_vFuRtjL6XEeFfHEZFaNJpz-lcnb3w0okrbM',
//             q: '3I1qeEDslZFB8iNfpKAdWtz_Wzm6-jayT_V6aIvhvMj5mnU-Xpj75zLPQSGa9wunMlOoZW9w1wDO1FVuDhwzeOJaTm-Ds0MezeC4U6nVGyyDHb4CUA3ml2tzt4yLrqGYMT7XbADSvuWYADHw79OFjEi4T3s3tJymhaBvy1ulv8M',
//             qi: 'wSbXte9PcPtr788e713KHQ4waE26CzoXx-JNOgN0iqJMN6C4_XJEX-cSvCZDf4rh7xpXN6SGLVd5ibIyDJi7bbi5EQ5AXjazPbLBjRthcGXsIuZ3AtQyR0CEWNSdM7EyM5TRdyZQ9kftfz9nI03guW3iKKASETqX2vh0Z8XRjyU',
//             use: 'sig',
//           }, {
//             crv: 'P-256',
//             d: 'K9xfPv773dZR22TVUB80xouzdF7qCg5cWjPjkHyv7Ws',
//             kty: 'EC',
//             use: 'sig',
//             x: 'FWZ9rSkLt6Dx9E3pxLybhdM6xgR5obGsj5_pqmnz5J4',
//             y: '_n8G69C-A2Xl4xUW2lF0i8ZGZnk_KPYrhv4GbTGu5G4',
//           },
//         ],
//       },
//       findAccount: Account.findAccount,
//       ttl: {
  //         AccessToken: 1 * 60 * 60, // 1 hour in seconds
  //         AuthorizationCode: 10 * 60, // 10 minutes in seconds
  //         IdToken: 1 * 60 * 60, // 1 hour in seconds
  //         DeviceCode: 10 * 60, // 10 minutes in seconds
  //         RefreshToken: 1 * 24 * 60 * 60, // 1 day in seconds
  //       },
  // })
  



oidc.proxy = true;
const app: Express = express();
app.set('trust proxy', true);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




function setNoCache(req: any, res: { set: (arg0: string, arg1: string) => void; }, next: () => void) {
  res.set('Pragma', 'no-cache');
  res.set('Cache-Control', 'no-cache, no-store');
  next();
}


app.get('/interaction/:uuid',setNoCache, async (req, res, next) => {
  try {
    const details:any = await oidc.interactionDetails(req, res);
    console.log('see what else is available to you for interaction views', details);
    const {
      uid, prompt, params,
    } = details;

    const client = await oidc.Client.find(params.client_id as string);

    if (prompt.name === 'login') {
      return res.render('login', {
        client,
        uid,
        details: prompt.details,
        params,
        title: 'Sign-in',
        flash: undefined,
      });
    }

    return res.render('interaction', {
      client,
      uid,
      details: prompt.details,
      params,
      title: 'Authorize',
    });
  } catch (err) {
    return next(err);
  }

})


const parse = bodyParser.urlencoded({ extended: false });


app.post('/interaction/:uid/login',setNoCache ,parse, async (req, res, next) => {
  try {
    const { uid, prompt, params } = await oidc.interactionDetails(req, res);
    assert.strictEqual(prompt.name, 'login');
    const client = await oidc.Client.find(params.client_id as string);

    const accountId = await Account.authenticate(req.body.email, req.body.password);

    if (!accountId) {
      res.render('login', {
        client,
        uid,
        details: prompt.details,
        params: {
          ...params,
          login_hint: req.body.email,
        },
        title: 'Sign-in',
        flash: 'Invalid email or password.',
      });
      return;
    }

    const result = {
      login: { accountId },
    };

    await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
  } catch (err) {
    next(err);
  }
});


app.post('/interaction/:uid/confirm', setNoCache, parse, async (req, res, next) => {
  try {
    const interactionDetails:any = await oidc.interactionDetails(req, res);
    const { prompt: { name, details }, params, session: { accountId } } = interactionDetails;
    assert.strictEqual(name, 'consent');

    let { grantId } = interactionDetails;
    let grant;

    if (grantId) {
      // we'll be modifying existing grant in existing session
      grant = await oidc.Grant.find(grantId);
    } else {
      // we're establishing a new grant
      grant = new oidc.Grant({
        accountId,
        clientId: params.client_id as string,
      });
    }

    if (details.missingOIDCScope) {
      grant!.addOIDCScope((details.missingOIDCScope as Array<string>).join(' '));
      // use grant.rejectOIDCScope to reject a subset or the whole thing
    }
    if (details.missingOIDCClaims) {
      grant!.addOIDCClaims(details.missingOIDCClaims as Array<string>);
      // use grant.rejectOIDCClaims to reject a subset or the whole thing
    }
    if (details.missingResourceScopes) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [indicator, scopes] of Object.entries(details.missingResourceScopes)) {
        grant!.addResourceScope(indicator, (scopes as Array<string>).join(' '));
        // use grant.rejectResourceScope to reject a subset or the whole thing
      }
    }

    grantId = await grant!.save();

    type Consent ={
      grantId : string|undefined;
    }
    

    const consent: Consent = {
      grantId: undefined
    }
    if (!interactionDetails.grantId) {
      // we don't have to pass grantId to consent, we're just modifying existing one
      consent.grantId = grantId;
    }

    const result =  consent ;
    await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: true });
  } catch (err) {
    next(err);
  }
});

app.get('/interaction/:uid/abort', setNoCache, async (req, res, next) => {
  try {
    const result = {
      error: 'access_denied',
      error_description: 'End-User aborted interaction',
    };
    await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
  } catch (err) {
    next(err);
  }
});

app.use("/oidc", oidc.callback());

mongoose.connect(MONGO_URI).then(()=>{
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
}).catch((error) => console.log(`${error} did not connect`));
// app.get('/', async (req: Request, res: Response) => {
//   // const user = new User({
//   //   name: 'Jeremy',
//   //   email: 'jeremyxu1234@gmail.com',
//   //   password: '1234',
//   // })
//   // await user.save()
//   res.send('Express + TypeScript Server');
  
// });

