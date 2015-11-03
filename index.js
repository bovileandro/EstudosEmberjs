/* jshint node: true */
'use strict';

module.exports = {
  name: 'processa-security-addon',
  included: function(app, parentAddon) {
    var target = (parentAddon || app);
  }
};  