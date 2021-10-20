const {
  empty
} = require("../helpes/help");
const Login = require("../models/LoginModel");




// renderiza a pagína de login
exports.showController = (req, res) => {
  res.render('login');
};





// Acesso ao sistema
exports.accessController = async (req, res) => {

  try {
    const data = req.body;
    res.locals.dataForm = data; // variavel local 


    // Dispara error de validação do formulario 
    if (res.locals.errors.length > 0) {
      return res.render('login');
    }


    // Instância da class
    const login = new Login(data);


    // Verifica se existe email cadastrado no sistema
    const isUser = await login.isUser();

    if (empty(isUser)) {

    // Dispara um menssagem de error
    res.locals.errors = [{
        msg: 'Usuário não existe.'
      }];

      return res.render('login');

    }



    // Verifica se a senha e valida
    const isLogged = await login.logged();
    
    // Se os dados de login forem verdadeiros
    if (isLogged) {
      
      // cria a sessão user
      req.session.user = Login.dataSession(login.user); 
      
      // Caso input logged esteja abilitado com true
      if (data.logged) {

        // cria cookie
        res.cookie('authorization', login.setToken());

      }

      // Salvar sessão
      req.session.save(function () {
        res.redirect('/painel-de-controle');
      });
      return;
    }


    // Distara menssagem de erro senha incorreta
    res.locals.errors = [{
      msg: 'Senha inválida.'
    }];
    return res.render('login');

  } catch (error) {
    res.render('error');
  }
};





// Sair do sistema
exports.logout = (req, res) => {
  if (!empty(req.session.user)) {
    req.session.user = null;
    res.locals.user = null;
    res.clearCookie('authorization');
    return res.redirect('/');
  }
  return res.render('error');
};