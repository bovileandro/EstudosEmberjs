import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {

  sessionInvalidated() {
    //este método do ApplicationRouteMixin deve ser sobrescrito aqui
    //redirecionando para alguma rota ao fazer logout
    //caso contrario a aplicação será redirecionada para a url base
    this.transitionTo('login');
  }

});