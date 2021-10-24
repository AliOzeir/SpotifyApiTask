const SpotifyWebApi = require("spotify-web-api-node");

// Login Post API
exports.loginPost = (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });
  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: "An Error Occured!", err });
    });
};



// Refresh the Token
exports.refreshPost = (req, res) => {
  const refreshToken = req.body.refreshToken;
  console.log(refreshToken);
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  });
  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
          accessToken: data.body.accessToken,
          expiresIn: data.body.expiresIn
      })
    })
    .catch((err) => {
      res.status(400);
    });
};
