<?php
  $db = new mysqli("vhw3t8e71xdz9k14.cbetxkdyhwsb.us-east-1.rds.amazonaws.com", "i22oovqlo7wkj2ik", "bwd8nr2qdi60ok1z", "ybhdique98fqjsye");

  function login($mail, $password) {
    global $db;
    $stmt = $db->prepare("select id, first_name from users where mail_address = ? and password = ?");
    $stmt->bind_param("ss", $mail, $password);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
      $stmt->bind_result($userId, $firstName);
      $stmt->fetch();
      session_start();
      $_SESSION["mail_address"] = $mail;
      $_SESSION["password"] = $password;
      $_SESSION["first_name"] = $firstName;
      $_SESSION["expiration"] = time() + 1800;
      $_SESSION["user_id"] = $userId;
      return true;
    } else {
      return false;
    }
  }

  function logout() {
    session_start();
    if (session_status() != PHP_SESSION_NONE) {
      session_destroy();
    }
  }

  function isLogged() {
    session_start();
    if (session_status() != PHP_SESSION_NONE) {
      if (isset($_SESSION["expiration"]) && time() <= $_SESSION["expiration"]) {
        return true;
      } else {
        session_destroy();
        return false;
      }
    }
  }
?>
