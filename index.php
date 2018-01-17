<?php
  require_once("php_scripts/setup.php");
  if (isset($_GET["page"])) {
    switch($_GET["page"]) {
      case "register":
        include("register.php");
        break;
      case "tasks":
        include("tasks.php");
        break;
      case "logout":
        logout();
        header("Location: ./?page=login");
        break;
      default:        
        include("login.php");
        break;
    }
  } else {
    include("login.php");
  }
?>