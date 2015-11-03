import DS from 'ember-data';
import Ember from 'ember';

export default DS.RESTAdapter.extend({

  session: Ember.inject.service('session'),
  
  headers: Ember.computed(function() {
    return {
      "withCredentials": true,
      "Authorization" : this.get('session.data.authenticated.authorization'),
    };
  }).property('session.data.authenticated.authorization'),

});