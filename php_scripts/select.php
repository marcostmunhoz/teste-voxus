<?php
  require_once("setup.php");
  if (!isLogged()) {
    exit(json_encode(array(
      "expired" => true
    )));
  }
  $tasks = array();
  $stmt = $db->prepare("select id, name, description, filename from tasks where user = ?");
  $stmt->bind_param("i", $_SESSION["user_id"]);
  $stmt->execute();
  $result = $stmt->get_result();
  if ($result->num_rows > 0) {
    while($row = $result->fetch_array(MYSQLI_ASSOC)) {
      $tasks[] = $row;
    }
  }
  exit(json_encode(array(
    "expired" => false,
    "tasks" => $tasks
  )));
?>