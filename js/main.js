const tasklist = $("#tasks > table > tbody"),
  fileSelect = $("<div>").addClass("inputWrapper").text("Selecionar").append($("<input>").attr("type", "file"));

class Tasks {
  static init() {
    Tasks._tasks = new Map();
    return Tasks;
  }
  static load() {
    $.ajax({ 
      url: "php_scripts/select.php",
      dataType: "json"
    }).done(function(data) {
      if (data.expired) {
        alert("Sessão expirada.\nVoltando a tela de login...");
        window.location.href = "./?page=login";
      } else {
        Tasks._tasks.clear();
        for(let row of data.tasks) {
          Tasks._tasks.set(row.id, {
            name: row.name,
            description: row.description,
            file: row.filename
          });
        }
        Tasks.render();
      }
    }).fail(function(data) {
      console.log("Erro no carregamento.");
    });
    return Tasks;
  }
  static insert(name, description, attachment) {
    let data = new FormData();
    data.append("name", name);
    data.append("description", description);
    data.append("attachment", attachment);
    $.ajax({
      method: "POST",
      url: "php_scripts/insert.php",
      mimeType: "multipart/form-data",
      processData: false,
      contentType: false,
      data: data,
      dataType: "json"
    }).done(function(msg) {
      if (msg.expired) {
        alert("Sessão expirada.\nVoltando a tela de login...");
        window.location.href = "./?page=login";
      } else {
        Tasks.load();
      }
    }).fail(function(data) {
      console.error("Erro na inserção", data);
    });
    return Tasks;
  }
  static update(id, name, description, attachment) {
    let data = new FormData();
    data.append("id", id);
    data.append("name", name);
    data.append("description", description);
    if (attachment != "") {
      data.append("attachment", attachment);
    }
    $.ajax({
      method: "POST",
      url: "php_scripts/update.php",
      mimeType: "multipart/form-data",
      processData: false,
      contentType: false,
      data: data,
      dataType: "json"
    }).done(function(msg) {
      if (msg.expired) {
        alert("Sessão expirada.\nVoltando a tela de login...");
        window.location.href = "./?page=login";
      } else {
        Tasks.load();
      }
    }).fail(function(data) {
      console.error("Erro na autalização", data);
    });
    return Tasks;
  }
  static remove(id) {
    $.ajax({
      method: "POST",
      url: "php_scripts/delete.php",
      data: {
        id: id
      },
      dataType: "json"
    }).done(function(msg) {
      if (msg.expired) {
        alert("Sessão expirada.\nVoltando a tela de login...");
        window.location.href = "./?page=login";
      } else {
        Tasks.load();
      }
    }).fail(function(data) {
      console.error("Erro na exclusão", data);
    });
    return Tasks;
  }
  static render() {
    let counter = 1;
    tasklist.empty();
    if (Tasks._tasks.size > 0) {
      for(let [key, value] of Tasks._tasks) {
        let taskRow = $("<tr>").attr("data-id", key);
        taskRow.append($("<th scope='row'>").text(counter++),
          $("<td>").text(value.name),
          $("<td>").addClass("edit-field").append($("<input>").attr("type", "text").attr("placeholder", "Nome")),
          $("<td>").text(value.description),
          $("<td>").addClass("edit-field").append($("<input>").attr("type", "text").attr("placeholder", "Descrição")),
          $("<td>").append((value.file ? $("<a>").attr("href", "download.php?id=" + key).attr("target", "_blank").addClass("file-link").text(value.file) : "-")),
          $("<td>").addClass("edit-field").append(fileSelect.clone(true)),
          $("<td>").append(
            $("<a>").attr("href", "#").addClass("edit").text("Editar"),
            " / ",
            $("<a>").attr("href", "#").addClass("remove").text("Remover")
          ),
          $("<td>").addClass("edit-field").append(
            $("<a>").attr("href", "#").addClass("save").text("Salvar"),
            " / ",
            $("<a>").attr("href", "#").addClass("cancel").text("Cancelar")
          )
        );
        tasklist.append(taskRow);
      }
    }
    return Tasks;
  }
}

$("#tasks > table > tbody").on("click", "tr > td > a.edit", function(e) {
  e.preventDefault();
  let row = $(this).closest("tr");
  row.addClass("editing");
  let editFields = row.find(".edit-field input"),
    textFields = row.find("td:not(.edit-field)");
  editFields[0].value = textFields[0].innerText;
  editFields[1].value = textFields[1].innerText;
});
$("#tasks > table > tbody").on("click", "tr > td > a.remove", function(e) {
  if (confirm("Deseja realmente excluir a tarefa?")) {
    e.preventDefault();
    let row = $(this).closest("tr");
    Tasks.remove(row.attr("data-id"));
  }
});
$("#tasks > table > tbody").on("click", "tr.editing > td > a.cancel", function(e) {
  e.preventDefault();
  let row = $(this).closest("tr");
  row.removeClass("editing");
});
$("#tasks > table > tbody").on("click", "tr.editing > td > a.save", function(e) {
  e.preventDefault();
  let row = $(this).closest("tr"),
    editFields = row.find(".edit-field input");
  Tasks.update(row.attr("data-id"), editFields[0].value, editFields[1].value, editFields[2].files[0]);
});
$("#tasks > table > tfoot > tr > td > a.add").click(function(e) {
  e.preventDefault();
  let tfoot = $(this).closest("tfoot");
  tfoot.addClass("adding");
});
$("#tasks > table").on("click", "tfoot.adding > tr > td > a.save-add", function(e) {
  e.preventDefault();
  let editFields = $(this).closest("tfoot").find("tr input");
  Tasks.insert(editFields[0].value, editFields[1].value, editFields[2].files[0]);
  $("a.cancel-add").click();
});
$("#tasks > table").on("click", "tfoot.adding > tr > td > a.cancel-add", function(e) {
  e.preventDefault();
  let tfoot = $(this).closest("tfoot"),
    editFields = tfoot.find("tr input");
  tfoot.removeClass("adding");
  editFields.val("");
});
$("#tasks > table").on("change", "input[type='file']", function() {
  let file = this;
  if (file.files.length == 1) {
    $(this).parent()[0].firstChild.nodeValue = file.files[0].name;
  } else {
    $(this).parent()[0].firstChild.nodeValue = "Selecione";
  }
});

Tasks.init().load();