<?php 
  require_once("php_scripts/setup.php");
  if (isset($_POST["first_name"]) && isset($_POST["last_name"]) && isset($_POST["mail"]) && isset($_POST["password"])) {
    $stmt = $db->prepare("select mail_address from users where mail_address = ?");
    $stmt->bind_param("s", $_POST["mail"]);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows == 0) {
      $stmt->close();
      $stmt = $db->prepare("insert into users (first_name, last_name, mail_address, password) values (?, ?, ?, ?)");
      $stmt->bind_param("ssss", $_POST["first_name"], $_POST["last_name"], $_POST["mail"], md5($_POST["password"]));
      $stmt->execute();
      header("Location: ./?page=login");
    } else {
      $duplicated = true;
    }
  }
?>
<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <title>Lista de tarefas - Registro</title>
    <meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css?family=Raleway" rel="stylesheet">
    <link href="css/login.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.2.1.min.js" type="text/javascript"></script>
  </head>
  <body>
    <div class="container">
      <div class="wrapper">
        <form method="POST">
          <label for="first_name">Primeiro nome</label>
          <input type="text" name="first_name" maxlength="35" required>
          <label for="last_name">Último nome</label>
          <input type="text" name="last_name" maxlength="35">
          <label for="mail">E-mail</label>
          <input type="email" name="mail" maxlength="255">
          <?php
            if (isset($duplicated) && $duplicated) {
              echo "O e-mail informado já existe no banco de dados.<br>";
            }
          ?>
          <label for="password">Senha</label>
          <input type="password" name="password" maxlength="20" required>
          <button type="submit">Salvar</button>
        </form>
      </div>
    </div>
  </body>
</html>
