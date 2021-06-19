const { format } = require('timeago.js');
const dateFormat = require('handlebars-dateformat');

const helpers = {}

helpers.timeago = (timestamp) => {
  return format(timestamp);
};

helpers.dateFormat = (date) => {
  return dateFormat(date, 'DD/MM/YYYY');
};

module.exports = helpers;