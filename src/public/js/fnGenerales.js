$(function() {
    $(".summernote").summernote({
        width : "100%",
        lang : "es-EN",
        height: "100%",
        toolbar: [
            // [groupName, [list of button]]
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['strikethrough', 'superscript', 'subscript']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['insert', ['link']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['height', ['height']]
          ]
    });
    $(".summernotedisabled").summernote({toolbar: []});
    $(".summernotedisabled").summernote('disable');

    $("#fechaReunion").datepicker({uiLibrary: 'bootstrap4'});
    $("#fechaProxReunion").datepicker({uiLibrary: 'bootstrap4'});
    $("#fechaOrganizacion").datepicker({uiLibrary: 'bootstrap4'});
    $("#fechaOrgSocFemenil").datepicker({uiLibrary: 'bootstrap4'});
    $("#fechaOrgSocVaronil").datepicker({uiLibrary: 'bootstrap4'});
    $("#fechaOrgSocJuvenil").datepicker({uiLibrary: 'bootstrap4'});
    $("#fechaOrgSocInfantil").datepicker({uiLibrary: 'bootstrap4'});
    $("#fechaOrdenamientoDiacono").datepicker({uiLibrary: 'bootstrap4'});
    $("#fechaOrdenamientoAnciano").datepicker({uiLibrary: 'bootstrap4'});
});