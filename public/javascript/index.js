$( document ).ready(function() {
    $('#newDevice').on('submit', function(e) {
        e.preventDefault();

        const data = {
            serial: $('#SN').val(),
            name: $('#name').val(),
            location: $('#location').val(),
            description: $('#desc').val()
        }

        $.post('/devices', data, function(response) {
            console.log(response);
        });
    });
});