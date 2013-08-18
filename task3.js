(function($) {
  $(function() {
    $("#accordion > div").accordion({ header: "h3", collapsible: true, heightStyle: "content"});
  })
})(jQuery);

$(function() {
  var progressbar = $("#progressbar");
  var progressLabel = $("#progress_label");

  progressbar.progressbar({
    value: true,
    create: function() {
      progressLabel.text("0% заполнено");
    },
    change: function() {
      progressLabel.text(progressbar.progressbar("value") + "% заполнено");
    }
  })
});

function UpdateProgress() {
  var percent = GetPercent();
  var progressBar = $("#progressbar");
  progressBar.progressbar("value", percent);
}

function GetPercent() {
  var questinnaire_number =
      (!IsEmpty('birth') && NoWarning("birth")) +
      !IsEmpty('city') + (!IsEmpty('education') && NoWarning('education')) +
      (!IsEmpty('graduate') && NoWarning('graduate')) +
      document.getElementById('eng_begin').checked +
      document.getElementById('eng_middle').checked +
      document.getElementById('eng_advanced').checked +
      !IsEmpty('expect') + !IsEmpty('from_where') + !IsEmpty('job_time') +
      !IsEmpty('experience') + !IsEmpty('prev_job') + !IsEmpty('software') +
      !IsEmpty('command_line') +
      (!IsEmpty('factorion') && NoWarning('factorion')) +
      (!IsEmpty('vessel') && NoWarning('vessel')) +
      (!IsEmpty('makeup') && NoWarning('makeup'));
  var auxiliary_number =
      (!IsEmpty('cv') && NoWarning('cv')) +
      (!IsEmpty('fio') && NoWarning('fio')) +
      (!IsEmpty('moikrug') && NoWarning('moikrug')) +
      (!IsEmpty('phone') && NoWarning('phone')) +
      (!IsEmpty('email') && NoWarning('email'));
  var values = document.getElementById("source");
  var selected = (values.options[values.selectedIndex].value.toString() != "choose");
  var agreed = (document.getElementById("agree").checked == true);
  return 5 * questinnaire_number + 4 * auxiliary_number +
      3 * (NoWarning('source') && selected) +
      2 * (NoWarning('agree') && agreed);
}

function Trim(str) {
  return str.replace(/^\s+|\s+$/g, '');
}

function IsEmpty(id) {
  return Trim(document.getElementById(id).value.toString()) == "";
}

function NoWarning(id) {
  return Trim(document.getElementById(id + '_warning').innerHTML.toString()) == "";
}

function CleanWarning(id) {
  document.getElementById(id + "_warning").innerHTML = "";
}

function ShowWarning(id, message) {
  document.getElementById(id + "_warning").innerHTML = message;
}

function CheckYear(id) {
  var year = Trim(document.getElementById(id).value.toString());
  var current_year = new Date().getFullYear();
  if (year != "" && (isNaN(year) || year <= current_year - 200 ||
      year > new Date().getFullYear())) {
    ShowWarning(id, "Укажите, пожалуйста, правильный год.");
  } else {
    CleanWarning(id);
    if (year != "") {
      UpdateProgress();
    }
  }
}

function CheckLink(id) {
  var link = Trim(document.getElementById(id).value.toString());
  if (link != "" &&
      ((link.indexOf("https://github.com/") != 0 &&
        link.indexOf("https://jsfiddle.com/") != 0) || /\s/g.test(link))) {
    ShowWarning(id, "Укажите, пожалуйста, правильную ссылку на Ваш проект.");
  } else {
    CleanWarning(id);
    if (link != "") {
      UpdateProgress();
    }
  }
}

function CheckGithubLink() {
  var link = Trim(document.getElementById("makeup").value.toString());
  if (link != "" && (link.indexOf("https://github.com/") != 0 ||
                     /\s/g.test(link))) {
    ShowWarning("makeup", "Укажите, пожалуйста, правильную ссылку на Ваш проект.");
  } else {
    CleanWarning("makeup");
    if (link != "") {
      UpdateProgress();
    }
  }
}

function CheckMoiKrug() {
  var link = Trim(document.getElementById("moikrug").value.toString());
  if (link != "" &&
      (link.indexOf('moikrug.ru', link.length - 'moikrug.ru'.length) == -1 ||
       /\s/g.test(link))) {
    ShowWarning("moikrug", "Укажите, пожалуйста, правильную ссылку на Ваш профиль в Моём круге.");
  } else {
    CleanWarning("moikrug");
    if (link != "") {
      UpdateProgress();
    }
  }
}

function CheckEmail() {
  var email = Trim(document.getElementById("email").value.toString());
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email != "" && !re.test(email)) {
    ShowWarning("email", "Укажите, пожалуйста, правильный e-mail.");
  } else {
    CleanWarning("email");
    if (email != "") {
      UpdateProgress();
    }
  }
}

function CheckPhone() {
  var phone = Trim(document.getElementById("phone").value.toString());
  var parts = phone.split(/[\+-\.\(\) ]/);
  for (var index = 0; index < parts.length; ++index) {
    if (parts[index] != "" && !/^\d+$/g.test(parts[index])) {
      ShowWarning("phone", "Укажите, пожалуйста, правильный номер телефона.");
      return;
    }
  }
  CleanWarning("phone");
  if (phone != "") {
    UpdateProgress();
  }
}

function CheckInputForWords(id) {
  var input = Trim(document.getElementById(id).value.toString());
  if (input != "" && !/\s+/g.test(input)) {
    ShowWarning(id, "Укажите, пожалуйста, необходимые данные полностью");
  } else {
    CleanWarning(id);
    if (input != "") {
      UpdateProgress();
    }
  }
}

function CheckSource() {
  var values = document.getElementById("source");
  var selected_value = values.options[values.selectedIndex].value.toString();
  if (selected_value == "choose") {
    ShowWarning("source", "Укажите, пожалуйста, откуда Вы узнали о нашем предложении.");
  } else {
    CleanWarning("source");
    UpdateProgress();
  }
}

function CheckAgreement() {
  var agreement = document.getElementById("agree").checked;
  if (agreement == false) {
    ShowWarning("agree", "Без Вашего согласия участие в конкурсе невозможно.");
  } else {
    CleanWarning("agree");
    UpdateProgress();
  }
}

function SetSpanText(id, text) {
  var span = document.getElementById(id);
  while (span.firstChild) {
    span.removeChild(span.firstChild);
  }
  span.appendChild(document.createTextNode(text));
}

function CheckCV() {
  var cv = document.getElementById("cv");
  if (cv.files[0].size > 250 * 1024) {
    SetSpanText("cv_text", "Файл не выбран");
    ShowWarning("cv", "Приложенный Вами файл больше 250 кб");
  } else {
    CleanWarning("cv");
    var start = 0;
    if (cv.value.indexOf('\\') >= 0) {
      start = cv.value.lastIndexOf('\\');
    }
    var filename = cv.value.substring(start);
    if (filename.indexOf('\\') == 0 || filename.indexOf('/') == 0) {
      filename = filename.substring(1);
    }
    SetSpanText("cv_text", filename);
    UpdateProgress();
  }
}