<?php
  require_once("php_scripts/setup.php");
  if (isset($_POST["mail"]) && isset($_POST["password"])) {
    $logged = login($_POST["mail"], $_POST["password"]);
  }
  if (isLogged()) {
    header("Location: ./?page=tasks");
  }
?>
<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <title>Lista de tarefas - Login</title>
    <meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css?family=Raleway" rel="stylesheet">
    <link href="css/login.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.2.1.min.js" type="text/javascript"></script>
  </head>
  <body>
    <div class="container">
      <div class="wrapper">
        <form method="POST">
          <label for="mail">E-mail</label>
          <input type="email" name="mail" maxlength="255" required>
          <label for="password">Senha</label>
          <input type="password" name="password" maxlength="20" required>
          <?php
            if (isset($logged) && $logged == false) {
              echo "Usuário e/ou senha inválidos.";
            }
          ?>
          <button type="submit">Entrar</button>
          <a href="./?page=register">Novo aqui? Registrar</a>
        </form>
      </div>
    </div>
  </body>
</html>