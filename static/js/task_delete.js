// task_delete.js

$(document).ready(function() {
    // Function to handle deleting a task
    function deleteTask(taskId) {
        $.ajax({
            type: 'POST',
            url: '/delete_task',
            data: {
                task_id: taskId
            },
            success: function(response) {
                if (response.success) {
                    $('li[data-task-id="' + taskId + '"]').remove();
                } else {
                    console.log('Error deleting task:', response.error)
                }
            },
            error: function(xhr, status, error) {
                console.log('Error deleting task:', error);
            }
        });
    }

    // Event listener for task delete icon click
    $(document).on('click', '.delete-task-icon', function() {
        var taskId = $(this).closest('li').attr('data-task-id');
        if (isAuthenticated === true) {
            if (confirm('Are you sure you want to delete this task?')) {
                deleteTask(taskId);
            }
        } else {
            alert('Please log in to delete a task.');
        }
    });

    // Function to add delete icon to tasks
    function addDeleteIcons() {
        $('.task-list li').append('<i class="fas fa-trash delete-task-icon ml-2 text-red-500 cursor-pointer hidden"></i>');
    }

    addDeleteIcons();

    // Show delete icon on task hover
    $('.task-list').on('mouseenter', 'li', function() {
        $(this).find('.delete-task-icon').removeClass('hidden');
    });

    // Hide delete icon when not hovering
    $('.task-list').on('mouseleave', 'li', function() {
        $(this).find('.delete-task-icon').addClass('hidden');
    });
});
