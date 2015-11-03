import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import AuthorizedRouteMixin from 'lenita-security-addon/mixins/authorized-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, AuthorizedRouteMixin, {
  
  //Define o papel cadastrado no Acl para 
  //permissao de acesso a esta rota
  papel: 'IndexDummy.DFconsultar',

  beforeModel:function(){
    //Caso sobrescreva o método beforeModel, a chamada ao método pai é obrigatória 
    //para que ocorra verificação da autenticação e da autorização
    this._super(...arguments);
  }

});