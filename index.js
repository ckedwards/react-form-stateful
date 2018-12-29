'use strict'

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./react-statefull-form.cjs.production.js');
} else {
    module.exports = require('./react-statefull-form.cjs.development.js');
}