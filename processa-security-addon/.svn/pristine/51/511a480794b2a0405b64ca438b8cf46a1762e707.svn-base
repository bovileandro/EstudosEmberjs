import Ember from 'ember';

export default Ember.Controller.extend({
  menssagemDeErro: "",

  actions: {
    autenticar(transition) {
      let login = document.forms["form-login"]["login"].value;
      let senha = document.forms["form-login"]["senha"].value;
      this.get('session').authenticate('authenticator:custom', login, senha).then(
        () => {
          //faça algo aki após o login
          //...
          //em seguida continua a transição
          transition.retry();
        }).catch((erro) => {
        switch(erro.status){
          case 404:
            this.set('menssagemDeErro', 'Serviço de login não encontrado.');
            break;
          case 403:
            this.set('menssagemDeErro', 'Login ou senha incorretos.');
            break;
          default:
            this.set('menssagemDeErro', erro.responseText);
            break;
        }
      });
    }
  }
});