$( document ).ready(function() {
    // On blur validation listener for form elements
    $('.needs-validation').find('input,select,textarea').on('focusout', function () {
        // check element validity and change class
        $(this).removeClass('is-valid is-invalid')
            .addClass(this.checkValidity() ? 'is-valid' : 'is-invalid');
    });

    $('#newDevice').on('submit', function(e) {
        e.preventDefault();

        if (!this.checkValidity()) {
            $(this).find('.error-message').text("Please fill out all fields");
        } else {
            const data = {
                sn: $('#newSN').val(),
                name: $('#newName').val(),
                location: $('#newLocation').val(),
                desc: $('#newDesc').val()
            }

            $.post('/manage/devices/create', data, function() {
                window.location.reload();
            }).fail(function(err) {
                console.log("FAILED: ", err.responseText);
                console.log($('#newDevice').find('.error-message'))
                $('#newDevice').find('.error-message').text(err.responseText);
            });
        }
    });

    $('.edit_device').on('submit', function(e) {
        e.preventDefault();

        if (!this.checkValidity()) {
            $(this).find('.error-message').text("Please fill out all fields");
        } else {
            const data = {
                sn: $(this).data('sn'),
                name: $(this).find('#editName').val(),
                location: $(this).find('#editLocation').val(),
                desc: $(this).find('#editDesc').val()
            }

            $.post('/manage/devices/edit', data, function() {
                window.location.reload();
            }).fail(function(err) {
                console.log("FAILED: ", err.responseText);
                console.log($(this).find('.error-message'))
                $(this).find('.error-message').text(err.responseText);
            });
        }
    });

    $('.delete_device').on('submit', function(e) {
        e.preventDefault();

        const serial = $(this).data('sn')

        $.post('/manage/devices/delete/' + serial, function() {
            window.location.reload();
        }).fail(function(err) {
            console.log("FAILED: ", err.responseText);
            console.log($(this).find('.error-message'))
            $(this).find('.error-message').text(err.responseText);
        });
    });

    $('#login').on('submit', function(e) {
        const pass = $('#password')

        pass.removeClass('is-invalid');
        e.preventDefault();

        const data = {
            password: pass.val()
        }

        $.post('/login', data, function(response) {
                window.location.href = '/';
        }).fail(function() {
            console.log('Invalid password');
            pass.addClass('is-invalid');
        });
    });

    $('#newReceiver').on('submit', function(e) {
        e.preventDefault();

        if (!this.checkValidity()) {
            $(this).find('.error-message').text("Please fill out all fields");
        } else {
            const data = {
                email: $('#newEmail').val(),
                phone: $('#newPhone').val()
            }

            $.post('/manage/alarms/receivers/create', data, function() {
                window.location.reload();
            }).fail(function(err) {
                console.log("FAILED: ", err.responseText);
                console.log($('#newReceiver').find('.error-message'))
                $('#newReceiver').find('.error-message').text(err.responseText);
            });
        }
    });

    $('#deleteReceiver').on('submit', function(e) {
        e.preventDefault();

        $.post('/manage/alarms/receivers/delete/' + $(this).data('id'), function() {
            window.location.reload();
        }).fail(function(err) {
            console.log("FAILED: ", err.responseText);
            console.log($(this).find('.error-message'))
            $(this).find('.error-message').text(err.responseText);
        });
    });

    $('#settingsForm').on('submit', function(e) {
        e.preventDefault();

        if (!this.checkValidity()) {
            $(this).find('.error-message').text("Please fill out all fields");
        } else {
            const data = {
                max_temp: $('#max_temp').val(),
                min_temp: $('#min_temp').val(),
                max_fugt: $('#max_humidity').val(),
                min_fugt: $('#min_humidity').val(),
                temp_interval: $('#temp_interval').val(),
                fugt_interval: $('#humidity_interval').val(),
                start_time: $('#start_time').val(),
                end_time: $('#end_time').val(),
                password: $('#password').val(),
                max_sound: $('#max_sound').val(),
                fahrenheit: $('#fahrenheit').is(':checked') ? 1 : 0
            }

            $.post('/manage/settings/save', data, function() {
                window.location.reload();
            }).fail(function(err) {
                console.log("FAILED: ", err.responseText);
                console.log($('#newDevice').find('.error-message'))
                $('#newDevice').find('.error-message').text(err.responseText);
            });
        }
    });
});

function launchDeleteReceiverModal(receiverId) {
    $('#deleteReceiver').data('id', receiverId);
    $('#deleteReceiverModal').modal('show');
}