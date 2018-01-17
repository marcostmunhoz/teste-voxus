<?php
  require_once("setup.php");
  if (!isLogged()) {
    exit(json_encode(array(
      "expired" => true
    )));
  }
  if($_POST["id"]) {
    $stmt_file = $db->prepare("select file_path from tasks where id = ?");
    $stmt_file->bind_param("i", $_POST["id"]);
    $stmt_file->execute();
    $stmt_file->store_result();
    if ($stmt_file->num_rows > 0) {
      $stmt_file->bind_result($file_path);
      $stmt_file->fetch();
      if ($file_path != "") {
        unlink($file_path);
      }
    }
    $stmt = $db->prepare("delete from tasks where id = ?");
    $stmt->bind_param("i", $_POST["id"]);
    $stmt->execute();
  }
  exit(json_encode(array(
    "expired" => false
  )));
?>