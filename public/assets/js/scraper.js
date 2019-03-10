$(document).ready(function() {
  //Add class to list item
  $("li").addClass("list-group-item");

  //
  $("button").click(function() {
    var articleId = $(this).attr("data-id");
    var noteTitle = $("#title_" + articleId).val();
    var noteBody = $("#body_" + articleId).val();
    var note = {
      articleId: articleId,
      title: noteTitle,
      body: noteBody
    };
    $.ajax({
      type: "POST",
      url: "/api/note",
      data: note
    }).then(result => {
      location.reload();
    });
  });
});
