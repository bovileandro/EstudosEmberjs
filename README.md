# Lenita-security-addon
O Security Addon é uma biblioteca para Autenticação e Autorização de acesso em aplicações desenvolvidas com o [Ember.js 	versão 2.1.0](http://guides.emberjs.com/v2.1.0/). Este addon utiliza os métodos de autenticação do [Ember Simple Auth](http://ember-simple-auth.com/), e adiciona métodos de autorização via Acl.

Este README descreve os detalhes para a utilização deste addon.

##Configuração

O Security Addon é configurado através da seção `'lenita-security-addon'` no `config/environment.js` da aplicação. É obrigatória a configuração das urls para os serviços de Auth e Acl no servidor. ex.:

	ENV['lenita-security-addon'] = {
   		authUrl: '/api//Auth?f=json',
    	aclUrl: '/api/Acl/'
  	};


Além das configurações acima, é obrigatória a configuração do cabeçalho das requisições via ember-data. Esta configuração deve ser feita no adapter da aplicação conforme o exemplo:


	// app/adapters/application.js
	export default DS.RESTAdapter.extend({
  		session: Ember.inject.service('session'),
  		headers: Ember.computed(function() {
    	return {
      		"withCredentials": true,
      		"Authorization" : this.get('session.data.authenticated.authorization'),
    	};
  	}).property('session.data.authenticated.authorization'),


Existem também configurações adicionais do Ember Simple Auth que não são obrigatórias. Para mais informações acesse [API docs](http://ember-simple-auth.com/api/classes/Configuration.html).

## Exemplo de uso

Uma vez instalado este addon, você pode acessar informações de autenticação e autorização através da sessão. A sessão está disponível nas rotas, templates e controllers. Podendo ser acessada com o comando `this.get('session');`. Em outras partes do sistema como adapters e initializers, a seção deve ser injetada antes do seu uso. ex.:

	export function initialize(application) {  
  		var session = Ember.inject.service('session');
		...
	}

###Autenticação

Para garantir a segurança da aplicação, as rotas devem incluir os Mixins de autenticação do Ember Simple Auth. Existem três tipos:

**1. ApplicationRouteMixin** - Usado na rota principal da aplicação. Com este mixin, esta rota receberá eventos quando ocorrer o login ou o logout, e os redirecionará para os métodos *sessionAuthenticated* e *sessionInvalidated* respectivamente. Estes métodos podem ser implementados na rota para efetuar alguma tarefa nestes momentos.

**2. AuthenticatedRouteMixin** - Usado em todas as rotas privadas da aplicação, desta forma a rota só poderá ser acessada caso o usuário esteja autenticado.

**3. UnauthenticatedRouteMixin** - Usado em rotas que só podem ser acessadas caso o usuário **não** esteja autenticado, por exemplo a rota login.

Rotas que não incluem nenhum destes mixins podem ser acessadas a qualquer momento, quando o usuário está ou não autenticado.

Caso o método *beforeModel* seja implementado em uma rota que inclui um destes mixins, é obrigatório incluir a chamada ao método pai para que ocorra verificação da autenticação e da autorização, conforme o exemplo:


  	beforeModel:function(){
    	this._super(...arguments);
		...
  	}


Ao tentar acessar uma rota protegida, a aplicação redirecionará automaticamente para a tela de login. O login e o logout podem ser feitos através dos comandos a seguir: 

**Login:** `this.get('session').authenticate('authenticator:custom', login, senha);`

**Logout:** `this.get('session').invalidate();`

Para verificar se o usuário esta autenticado, use o comando `{{session.isAuthenticated}}` nos templates, ou `this.get('session.isAuthenticated');` nas rotas ou controllers.

Para obter a identidade do usuário logado, use o comando `{{session.data.authenticated.identidade}}` nos templates, ou `this.get('session.data.authenticated.identidade');` nas rotas ou controllers.

###Autorização

A autorização é feita através do objeto Acl obtido do servidor pela url definida no campo *aclUrl* configurado no ambiente. Este objeto deve conter uma lista de papéis com as respectivas permissões para o usuário logado de acordo com o modelo:

	{"acl": [
	      {
	        "papel": "Exemplo.DFincluir",
	        "permitido": true
	      },
	      {
	        "papel": "Exemplo.DFalterar",
	        "permitido": true
	      },
	      {
	        "papel": "Exemplo.DFexcluir",
	        "permitido": false
	      },
	      {
	        "papel": "Exemplo.DFconsultar",
	        "permitido": true				
	      },
	    ]}

As rotas que necessitam de autorização devem incluir o mixin  **AuthenticatedRouteMixin** e também o **AuthorizedRouteMixin**. Além disso, deve conter um atributo informando o papel relativo à rota, ex.: `papel: 'Exemplo.DFconsultar',`. Assim, antes de acessar a rota, o mixin irá verificar no Acl se o usuário tem permissão para acessá-la.

A autorização também pode ser utilizada nos templates para mostrar ou ocultar informações de acordo com a permissão do usuário. Para isso, utilize o comando `{{#if session.data.authenticated.policy.PAPEL}} ... {{/if}}` para circundar blocos do template que necessitam de autorização.

####Exemplos de rotas com Autenticação e Autorização:

	// routes/login.js
	import Ember from 'ember';
	import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

	export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  		...
	});
#
	// routes/application.js
	import Ember from 'ember';
	import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

	export default Ember.Route.extend(ApplicationRouteMixin, {

  		sessionInvalidated() {
    		this.transitionTo('index');
  		},
		sessionAuthenticated() {
    		this.transitionTo('index');
  		}
		...
	});
#

	// routes/rotaprivada.js
	import Ember from 'ember';
	import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
	import AuthorizedRouteMixin from 'lenita-security-addon/mixins/authorized-route-mixin';

	export default Ember.Route.extend(AuthenticatedRouteMixin, AuthorizedRouteMixin, {
  
  		//Define o papel cadastrado no Acl para 
  		//permissao de acesso a esta rota
  		papel: 'Exemplo.DFconsultar',

		...
	});

####Exemplos para template e controller do login

**IMPORTANTE:** Não utilize inputs do handlebars para a senha, pois o mesmo deixa a senha exposta no Ember Inspector.
	
	// templates/login.hbs
	<div class="page-header">
	  <h3>Login</h3>
	</div>
	<form id="form-login" {{action 'autenticar' session.attemptedTransition on='submit'}}>
	  <div class="form-group">
	    <label for="login">Login</label>
	    <input id="login" placeholder='Entre com o login' class='form-control' required=true>
	  </div>
	  <div class="form-group">
	    <label for="senha">Senha</label>
	    <input id="senha"  placeholder='Entre com a senha' class='form-control' type='password' required=true>
	  </div>
	  <div class="form-group">
	    <label for="erro">{{menssagemDeErro}}</label>
	  </div>
	  <div class="form-group">
	    <button type="submit" class="btn btn-default">Entrar</button>
	  </div>
	</form>
#
	// controllers/login.js
	import Ember from 'ember';
	
	export default Ember.Controller.extend({
	  menssagemDeErro: "",
		...	
	  actions: {
	    autenticar(transition) {
	      let login = document.forms["form-login"]["login"].value;
	      let senha = document.forms["form-login"]["senha"].value;
	      this.get('session').authenticate('authenticator:custom', login, senha).then(
	        () => {
	          //faça algo aki após o login
	          //...
	          //em seguida continue a transição
	          transition.retry();
	        }).catch((erro) => {
	        	this.set('menssagemDeErro', erro.responseText);
	        }
	      });
	    }
	  }
	});

Para mais detalhes sobre o uso deste addon visite o aplicativo de demonstração anexado na pasta `tests/dummy`.

## Instalação

* `git clone` este repositorio
* `npm install`
* `bower install`

## Execução

* `ember server`
* Visite o aplicativo em http://localhost:4200.

## Teste

* `ember test`
* `ember test --server`

## Building

* `ember build`

Para mais informações sobre o uso do ember-cli, acesse [http://www.ember-cli.com/](http://www.ember-cli.com/).
