'use strict';

const url_schemes = 'watched://';

const Config = {

  url_schemes: url_schemes,
  redirect_uri: url_schemes + 'oauth-callback',

  API_URL: 'https://api.douban.com/',
  API_KEY: '001ead17f46422ab005c0747dd2c6801',

  BASE_COLOR: '#02b875',
  GRAY_COLOR: '#a8acaa',
};


module.exports = Config;