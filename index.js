/* jshint node: true */
'use strict';

module.exports = {
  name: 'lenita-security-addon',
  included: function(app, parentAddon) {
    var target = (parentAddon || app);
  }
};  