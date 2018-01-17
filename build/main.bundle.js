"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tasklist = $("#tasks > table > tbody"),
    fileSelect = $("<div>").addClass("inputWrapper").text("Selecionar").append($("<input>").attr("type", "file"));

var Tasks = function () {
  function Tasks() {
    _classCallCheck(this, Tasks);
  }

  _createClass(Tasks, null, [{
    key: "init",
    value: function init() {
      Tasks._tasks = new Map();
      return Tasks;
    }
  }, {
    key: "load",
    value: function load() {
      $.ajax({
        url: "php_scripts/select.php",
        dataType: "json"
      }).done(function (data) {
        if (data.expired) {
          alert("Sessão expirada.\nVoltando a tela de login...");
          window.location.href = "./?page=login";
        } else {
          Tasks._tasks.clear();
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = data.tasks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var row = _step.value;

              Tasks._tasks.set(row.id, {
                name: row.name,
                description: row.description,
                file: row.filename
              });
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          Tasks.render();
        }
      }).fail(function (data) {
        console.log("Erro no carregamento.");
      });
      return Tasks;
    }
  }, {
    key: "insert",
    value: function insert(name, description, attachment) {
      var data = new FormData();
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
      }).done(function (msg) {
        if (msg.expired) {
          alert("Sessão expirada.\nVoltando a tela de login...");
          window.location.href = "./?page=login";
        } else {
          Tasks.load();
        }
      }).fail(function (data) {
        console.error("Erro na inserção", data);
      });
      return Tasks;
    }
  }, {
    key: "update",
    value: function update(id, name, description, attachment) {
      var data = new FormData();
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
      }).done(function (msg) {
        if (msg.expired) {
          alert("Sessão expirada.\nVoltando a tela de login...");
          window.location.href = "./?page=login";
        } else {
          Tasks.load();
        }
      }).fail(function (data) {
        console.error("Erro na autalização", data);
      });
      return Tasks;
    }
  }, {
    key: "remove",
    value: function remove(id) {
      $.ajax({
        method: "POST",
        url: "php_scripts/delete.php",
        data: {
          id: id
        },
        dataType: "json"
      }).done(function (msg) {
        if (msg.expired) {
          alert("Sessão expirada.\nVoltando a tela de login...");
          window.location.href = "./?page=login";
        } else {
          Tasks.load();
        }
      }).fail(function (data) {
        console.error("Erro na exclusão", data);
      });
      return Tasks;
    }
  }, {
    key: "render",
    value: function render() {
      var counter = 1;
      tasklist.empty();
      if (Tasks._tasks.size > 0) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = Tasks._tasks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _ref = _step2.value;

            var _ref2 = _slicedToArray(_ref, 2);

            var key = _ref2[0];
            var value = _ref2[1];

            var taskRow = $("<tr>").attr("data-id", key);
            taskRow.append($("<th scope='row'>").text(counter++), $("<td>").text(value.name), $("<td>").addClass("edit-field").append($("<input>").attr("type", "text").attr("placeholder", "Nome")), $("<td>").text(value.description), $("<td>").addClass("edit-field").append($("<input>").attr("type", "text").attr("placeholder", "Descrição")), $("<td>").append(value.file ? $("<a>").attr("href", "download.php?id=" + key).attr("target", "_blank").addClass("file-link").text(value.file) : "-"), $("<td>").addClass("edit-field").append(fileSelect.clone(true)), $("<td>").append($("<a>").attr("href", "#").addClass("edit").text("Editar"), " / ", $("<a>").attr("href", "#").addClass("remove").text("Remover")), $("<td>").addClass("edit-field").append($("<a>").attr("href", "#").addClass("save").text("Salvar"), " / ", $("<a>").attr("href", "#").addClass("cancel").text("Cancelar")));
            tasklist.append(taskRow);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
      return Tasks;
    }
  }]);

  return Tasks;
}();

$("#tasks > table > tbody").on("click", "tr > td > a.edit", function (e) {
  e.preventDefault();
  var row = $(this).closest("tr");
  row.addClass("editing");
  var editFields = row.find(".edit-field input"),
      textFields = row.find("td:not(.edit-field)");
  editFields[0].value = textFields[0].innerText;
  editFields[1].value = textFields[1].innerText;
});
$("#tasks > table > tbody").on("click", "tr > td > a.remove", function (e) {
  if (confirm("Deseja realmente excluir a tarefa?")) {
    e.preventDefault();
    var row = $(this).closest("tr");
    Tasks.remove(row.attr("data-id"));
  }
});
$("#tasks > table > tbody").on("click", "tr.editing > td > a.cancel", function (e) {
  e.preventDefault();
  var row = $(this).closest("tr");
  row.removeClass("editing");
});
$("#tasks > table > tbody").on("click", "tr.editing > td > a.save", function (e) {
  e.preventDefault();
  var row = $(this).closest("tr"),
      editFields = row.find(".edit-field input");
  Tasks.update(row.attr("data-id"), editFields[0].value, editFields[1].value, editFields[2].files[0]);
});
$("#tasks > table > tfoot > tr > td > a.add").click(function (e) {
  e.preventDefault();
  var tfoot = $(this).closest("tfoot");
  tfoot.addClass("adding");
});
$("#tasks > table").on("click", "tfoot.adding > tr > td > a.save-add", function (e) {
  e.preventDefault();
  var editFields = $(this).closest("tfoot").find("tr input");
  Tasks.insert(editFields[0].value, editFields[1].value, editFields[2].files[0]);
  $("a.cancel-add").click();
});
$("#tasks > table").on("click", "tfoot.adding > tr > td > a.cancel-add", function (e) {
  e.preventDefault();
  var tfoot = $(this).closest("tfoot"),
      editFields = tfoot.find("tr input");
  tfoot.removeClass("adding");
  editFields.val("");
});
$("#tasks > table").on("change", "input[type='file']", function () {
  var file = this;
  if (file.files.length == 1) {
    $(this).parent()[0].firstChild.nodeValue = file.files[0].name;
  } else {
    $(this).parent()[0].firstChild.nodeValue = "Selecione";
  }
});

Tasks.init().load();
