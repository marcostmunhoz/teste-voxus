<?php
  require_once("setup.php");
  if (!isLogged()) {
    exit(json_encode(array(
      "expired" => true
    )));
  }
  if(isset($_POST["id"]) && isset($_POST["name"]) && isset($_POST["description"])) {
    if (isset($_FILES["attachment"])) {
      $stmt_user = $db->prepare("select user, file_path from tasks where id = ?");
      $stmt_user->bind_param("i", $_POST["id"]);
      $stmt_user->execute();
      $stmt_user->store_result();
      if ($stmt_user->num_rows > 0) {
        $stmt_user->bind_result($user_id, $file_path);
        $stmt_user->fetch();
        if ($file_path) {
          unlink($file_path);
        }
        $file = $_FILES["attachment"];
        if (!file_exists("../attachments/$user_id")) {
          mkdir("../attachments/$user_id", 0777, true);
        } 
        $file_type = $file["type"];
        $new_name = uniqid() . "." . pathinfo($file["name"], PATHINFO_EXTENSION);
        $new_path = "../attachments/$user_id/" . $new_name;
        move_uploaded_file($file['tmp_name'], $new_path);
        $full_path = realpath($new_path);
        $stmt = $db->prepare("update tasks set name = ?, description = ?, filename = ?, file_type = ?, file_path = ? where id = ?");
        $stmt->bind_param("sssssi", $_POST["name"], $_POST["description"], $file["name"], $file_type, $full_path, $_POST["id"]);
      }
    } else {
      $stmt = $db->prepare("update tasks set name = ?, description = ? where id = ?");
      $stmt->bind_param("ssi", $_POST["name"], $_POST["description"], $_POST["id"]);
    }
    $stmt->execute();
  }
  exit(json_encode(array(
    "expired" => false
  )));
?>