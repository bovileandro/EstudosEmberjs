import Ember from "ember";
import Base from 'ember-simple-auth/authenticators/base';
import ENV from '../config/environment';

export default Base.extend({
  restore(data) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(data.authorization)) {
        resolve(data);
      } else {
        reject();
      }
    });
  },

  authenticate(login, senha) {
    const config   = ENV['lenita-security-addon'] || {};
    var authorization = 'Basic ' + btoa(login + ":" + senha);

    Ember.$.ajaxSetup({
      beforeSend: function(xhr) {
        xhr.setRequestHeader(
          'Authorization', authorization
        );
      }});

    return new Ember.RSVP.Promise(
      function(resolve, reject) {
        Ember.$.ajax({
          withCredentials: true,
          url: config.authUrl,
          authorization: authorization,
        }).then(() =>  {
          Ember.$.getJSON(config.aclUrl).then(function (data) {
            var acl = Ember.Object.create();
            for (var index = 0; index < data.acl.length; index ++){
              var recurso = data.acl[index].papel.split('.')[0];
              if(Ember.isEmpty(acl.get(recurso))){
                acl.set(recurso, {});
              }
              acl.set(data.acl[index].papel, data.acl[index].permitido);
            }
            resolve({
              identidade: login,
              authorization: authorization,
              policy : acl,
            });

          });        

        }, reject);
      }
    );
  },

  invalidate() {
    Ember.$.ajaxSetup({
      beforeSend: function(xhr) {
        xhr.setRequestHeader(
          'Authorization', ''
        );
      }
    });

    return Ember.RSVP.resolve();
  }
});