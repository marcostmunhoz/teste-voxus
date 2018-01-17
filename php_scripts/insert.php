<?php
  require_once("setup.php");
  if (!isLogged()) {
    exit(json_encode(array(
      "expired" => true
    )));
  }
  if(isset($_POST["name"]) && isset($_POST["description"])) {
    $user_id = $_SESSION["user_id"];
    if (isset($_FILES["attachment"])) {
      $file = $_FILES["attachment"];
      if (!file_exists("../attachments/$user_id")) {
        mkdir("../attachments/$user_id", 0777, true);
      } 
      $file_type = $file["type"];
      $new_name = uniqid() . "." . pathinfo($file["name"], PATHINFO_EXTENSION);
      $new_path = "../attachments/$user_id/" . $new_name;
      move_uploaded_file($file['tmp_name'], $new_path);
      $full_path = realpath($new_path);
      $stmt = $db->prepare("insert into tasks (name, description, filename, file_type, file_path, user) values (?, ?, ?, ?, ?, ?)");
      $stmt->bind_param("sssssi", $_POST["name"], $_POST["description"], $file["name"], $file_type, $full_path, $user_id);
      $stmt->execute();
    } else {
      $stmt = $db->prepare("insert into tasks (name, description, user) values (?, ?, ?)");
      $stmt->bind_param("ssi", $_POST["name"], $_POST["description"], $user_id);
      $stmt->execute();
    }
  }
  exit(json_encode(array(
    "expired" => false
  )));
?>