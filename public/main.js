var colorReplace = function(input, replace) {
    var replaceColors = {
        "0;31": "{r",
        "1;31": "{R",

        "0;32": "{g",
        "1;32": "{G",

        "0;33": "{y",
        "1;33": "{Y",

        "0;34": "{b",
        "1;34": "{B",

        "0;35": "{m",
        "1;35": "{M",

        "0;36": "{c",
        "1;36": "{C",

        "0;37": "{w",
        "1;37": "{W",

        "1;30": "{*",

        "0": "{x"
    };

    if (replace) {
        for (k in replaceColors) {
            //console.log( "\033\[" + k + "m" + replaceColors[ k ] );
            var re = new RegExp("\\033\\[" + k + "m", "g");

            input = input.replace(re, replaceColors[k]);
        }
    }
    else {
        input = input.replace(/\033\[[0-9;]*m/g, "");
    }

    return input;
};

$(document).ready(function() {
    var socket = io.connect(window.location);
    socket.on('wifite-update', function(data) {
        $('#mainContent').append(colorReplace(data.data, false));
    });
    // clear input on focus
    var clearMePrevious = '';
    $('input').focus(function() {
        if ($(this).val() == $(this).attr('title')) {
            clearMePrevious = $(this).val();
            $(this).val('');
        }
    });
    // if field is empty afterward, add text again
    $('input').blur(function() {
        if ($(this).val() == '') {
            $(this).val(clearMePrevious);
        }
    });
    $('textarea').focus(function() {
        if ($(this).val() == $(this).attr('title')) {
            clearMePrevious = $(this).val();
            $(this).val('');
        }
    });
    $('textarea').blur(function() {
        if ($(this).val() == '') {
            $(this).val(clearMePrevious);
        }
    });
});