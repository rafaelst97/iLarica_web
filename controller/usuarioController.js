$(document).ready(function () {
  $('#Nome').tooltip({
    placement: 'bottom'
  });

  $("#BtnCadastrar").click(function () {
    let nome = $('#Nome').val();
    let senha = $('#Senha').val();
    let email = $('#Email').val();
    let telefone = $('#Telefone').val();
    let cpf = $('#Cpf').val();
    let rg = $('#Rg').val();

    let dadosValidados = validaDados(nome, senha, email, telefone, cpf, rg);

    if (dadosValidados == true) {
    let novoUsuario = new Usuario(nome, senha, email, telefone, cpf, rg);
    console.log(novoUsuario);
    novoUsuario.salvar();
      window.location.href = "../index.html";
    }

  });

  function validaDados(nome, senha, email, telefone, cpf, rg) {

    let regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let nomeValido = false;
    let senhaValida = false;
    let emailValido = false;
    let telefoneValido = false;
    let cpfValido = false;
    let rgValido = false;

    //Verifica se o nome foi preenchido
    if (nome == "" || nome == null || typeof nome == 'undefined') {
      $('#Nome').addClass('is-invalid');
      nomeValido = false;
    } else {
      $('#Nome').removeClass('is-invalid');
      nomeValido = true;
    };

    //Verifica se a senha foi preenchida e se possui no mínimo 8 caracteres
    if (senha == "" || senha == null || typeof senha == 'undefined' || senha.length < 8) {
      $('#Senha').addClass('is-invalid');
      senhaValida = false;
    } else {
      $('#Senha').removeClass('is-invalid');
      senhaValida = true;
    };

    //Verifica se o email foi preenchido e se é válido
    if (regexEmail.test(email) == false) {
      $('#Email').addClass('is-invalid');
      emailValido = false;
    } else {
      $('#Email').removeClass('is-invalid');
      emailValido = true;
    };

    //Verifica se o telefone foi preenchido e se possui no mínimo 11 caracteres
    if (telefone == "" || telefone == null || typeof telefone == 'undefined' || telefone.length < 11) {
      $('#Telefone').addClass('is-invalid');
      telefoneValido = false;
    } else {
      $('#Telefone').removeClass('is-invalid');
      telefoneValido = true;
    };

    //Verifica se o cpf foi preenchido e se possui 11 caracteres
    if (cpf == "" || cpf == null || typeof cpf == 'undefined' || cpf.length < 11) {
      $('#Cpf').addClass('is-invalid');
      cpfValido = false;
    } else {
      $('#Cpf').removeClass('is-invalid');
      cpfValido = true;
    };

    //Verifica se o rg foi preenchido e se possui 9 caracteres
    if (rg == "" || rg == null || typeof rg == 'undefined' || rg.length < 9) {
      $('#Rg').addClass('is-invalid');
      rgValido = false;
    } else {
      $('#Rg').removeClass('is-invalid');
      rgValido = true;
    };

    //Se todos os requisitos foram atendidos, retorna true
    if (nomeValido && senhaValida && emailValido && telefoneValido && cpfValido && rgValido) {
      return true;
    }else{
      return false;
    };

  };
});

/*id: PK int
nome: string
senha: string
email: string
telefone: string
cpf: string
rg: string
matricula: int
cargo int */