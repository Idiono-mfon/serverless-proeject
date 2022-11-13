// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'zpb49jj9g6'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-xyva8s6ghq1wj56n.us.auth0.com', // Auth0 domain
  clientId: 'Epl7HJgZ4BDJuvrUku4rSIdhuH5gGHq6', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
