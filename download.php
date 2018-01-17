<?php
  if(isset($_GET["id"])) {
    require_once("php_scripts/setup.php");
    $stmt = $db->prepare("select filename, file_type, file_path from tasks where id = ?");
    $stmt->bind_param("i", $_GET["id"]);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
      $stmt->bind_result($filename, $file_type, $file_path);
      $stmt->fetch();
      header("Content-Type: text/plain");
      header("Content-Transfer-Encoding: Binary");
      header("Content-disposition: attachment; filename=\"" . $filename . "\"");
      echo file_get_contents($file_path);
    }
  }
  exit();
?>