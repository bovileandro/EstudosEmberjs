import Ember from 'ember';

export default Ember.Mixin.create({
  beforeModel: function beforeModel(transition) {
    this._super(...arguments);
    
    if(this.get('session.isAuthenticated')){
      var permitido =  this.get('session.data.authenticated.policy.' + this.get('papel'));
      if(!permitido){
        transition.abort();
        this.transitionTo('nao-autorizado');
      }
    }
  }
});