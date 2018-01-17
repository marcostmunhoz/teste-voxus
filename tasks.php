<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <title>Lista de tarefas</title>
    <meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css?family=Raleway" rel="stylesheet">
    <link href="css/tasks.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.2.1.min.js" type="text/javascript"></script>
  </head>
  <body>    
    <header id="main-header">
      <nav>
        <span>Bem vindo, 
          <?php
            session_start();
            echo $_SESSION["first_name"];
          ?> | <a href="./?page=logout">Logout</a></span>
      </nav>
    </header>
    <section id="container">
      <header>
        TAREFAS
      </header>
      <div id="tasks">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Arquivo</th>
              <th>Opções</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5"><a href="#" class="add">Adicionar nova tarefa...</a></td>
            </tr>
            <tr class="add-row">
              <td></td>
              <td>
                <input type="text" placeholder="Nome" maxlength="45">
              </td>
              <td>
                <input type="text" placeholder="Descrição" maxlength="200">
              </td>
              <td>
                <div class="inputWrapper">
                  Selecionar
                  <input type="file"/>
                </div>
              </td>
              <td>
                <a href="#" class="save-add">Inserir</a>
                  / 
                <a href="#" class="cancel-add">Cancelar</a>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
    <script src="build/main.bundle.js" type="text/javascript"></script>
  </body>
</html>