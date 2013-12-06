function showModal() {
    $('body').addClass('dialogIsOpen');
    $('#modal section').hide();
    $('#modal #' + $(this).attr('class')).show();
}

function closeModal() {
    $('body').removeClass('dialogIsOpen');
}

$('nav a, .usage').on('click', showModal);

// ESC 
$(document).on('keydown', function(e) {
    if (e.keyCode == 27) {
        closeModal();
    }
});
$('#modal .x, nav .simulator').off('click').on('click', closeModal);

// set default map
$('textarea[name=map]').val("r, g, g, r, r\nr, r, g, r, r\nr, r, g, g, r\nr, r, r, r, r");

// =============================================================================
// CLASS GENERATOR
// =============================================================================
function Class(methods) {
    var c = function() {
        this.init.apply(this, arguments);
    };
    for (var property in methods) {
        c.prototype[property] = methods[property];
    }
    if (!c.prototype.init)
        c.prototype.init = function() {
        };
    return c;
}