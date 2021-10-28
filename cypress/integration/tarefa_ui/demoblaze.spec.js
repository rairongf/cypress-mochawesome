/// <reference types="cypress"/>

describe('Cenário de teste: Testar as funcionalidades de Login do site demoblaze.', () => {

  beforeEach(() => {
    cy.visit('https://www.demoblaze.com/index.html');
  })

  it('Caso de teste: Abrir diálogo de cadastro ao clicar no botão', () => {
    cy.get('#signin2').click();
    cy.get('#signInModal > .modal-dialog > .modal-content').should('be.visible');
  })

  it('Caso de teste: Registrar um usuario com sucesso', () => {
    criarNovoUsuario({testarFalha: false});
    cy.on('window:alert', (text) => {
      expect(text).to.equal('Sign up successful.');
    });
  })

  it('Caso de teste: Falha ao tentar registrar um usuario com dados invalidos', () => {
    criarNovoUsuario({testarFalha: true});
    cy.on('window:alert', (text) => {
      expect(text).to.equal('Please fill out Username and Password.');
    });
  })

  it('Caso de teste: Falha ao tentar registrar um usuario já cadastrado', () => {
    criarUsuarioFixo('Sign up successful.');
    criarUsuarioFixo('This user already exist.');
  })

  it('Caso de teste: Login na plataforma com sucesso', () => {
    var userId = loginDemoblaze();
    cy.get('#nameofuser').should('have.text', `Welcome ${userId}`);
  })

  it('Caso de teste: Sair da conta do usuário e verificar', () => {
    var userId = loginDemoblaze();
    cy.get('#nameofuser').should('have.text', `Welcome ${userId}`);
    cy.get('#logout2').click();
    cy.get('#nameofuser').should('not.be.visible');
    cy.get('#signin2').should('be.visible');
  })
})

function criarNovoUsuario({testarFalha}) {

  let horas = new Date().getHours().toString();
  let minutos = new Date().getMinutes().toString();
  let seg = new Date().getSeconds().toString();
  let userId = horas + minutos + seg + '_userId';
  let userPass = horas + minutos + seg + '_userPass';
  let userInfo = [userId, userPass]

  cy.get('#signin2').click();
  cy.get('#signInModal > .modal-dialog > .modal-content').should('be.visible').wait(500);
  cy.get('#sign-username').type(userId);
  cy.get('#sign-password').type(userPass);
  if(testarFalha) cy.get('#sign-username').clear();
  cy.get('#signInModal > .modal-dialog > .modal-content > .modal-footer > .btn-primary')
    .click().wait(500);
  return userInfo;

}

function criarUsuarioFixo(checkText) {
  var alertText = 'null';
  cy.on('window:alert', (text) => {
    alertText = text;
  });

  let horas = new Date().getHours().toString();
  let minutos = new Date().getMinutes().toString();
  let userId = horas + minutos + '_userId';
  let userPass = horas + minutos + '_userPass';
  let userInfo = [userId, userPass]

  cy.get('#signin2').click();
  cy.get('#signInModal > .modal-dialog > .modal-content').should('be.visible').wait(500);
  cy.get('#sign-username').clear();
  cy.get('#sign-password').clear();
  cy.get('#sign-username').type(userId);
  cy.get('#sign-password').type(userPass);
  cy.get('#signInModal > .modal-dialog > .modal-content > .modal-footer > .btn-primary')
    .click().wait(2000).then(() => expect(alertText).to.equal(checkText));

  return userInfo;

}

function loginDemoblaze(){
  var userInfos = criarNovoUsuario({testarFalha: false});
  cy.get('#login2').click();
  cy.get('#logInModal > .modal-dialog > .modal-content')
    .should('be.visible')
    .wait(500);
  cy.get('#loginusername').type(userInfos[0]);
  cy.get('#loginpassword').type(userInfos[1]);
  cy.get('#logInModal > .modal-dialog > .modal-content > .modal-footer > .btn-primary')
    .click()
    .wait(500);
  return userInfos[0];
}

