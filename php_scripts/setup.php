<?php
  $db = new mysqli("localhost", "marcos", "98564831", "banco_voxus");

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