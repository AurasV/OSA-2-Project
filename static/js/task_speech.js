$(document).ready(function() {
    // Event listener for text-to-speech button click
    $(document).on('click', '.speak-task-icon', function() {
        var taskText = $(this).closest('li').text();
        var msg = new SpeechSynthesisUtterance(taskText);
        window.speechSynthesis.speak(msg);
    });

    $('.task-list').on('mouseleave', 'li', function() {
        $(this).find('.speak-task-icon').remove();
    });
});
