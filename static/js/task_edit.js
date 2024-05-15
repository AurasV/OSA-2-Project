$(document).ready(function() {
    // Function to handle editing a task
    function editTask(taskId, newText) {
        $.ajax({
            type: 'POST',
            url: '/edit_task',
            data: {
                task_id: taskId,
                new_text: newText
            },
            success: function(response) {
                if (response.success) {
                    // Update the text of the task in the UI
                    $('li[data-task-id="' + taskId + '"]').text(newText);
                } else {
                    console.log('Error editing task:', response.error)
                }
            },
            error: function(xhr, status, error) {
                console.log('Error editing task:', error);
            }
        });
    }

    // Event listener for task edit icon click
    $(document).on('click', '.edit-task-icon', function() {
        var taskId = $(this).closest('li').attr('data-task-id');
        var newText = prompt('Enter the new text for the task:');
        if (newText !== null && newText.trim() !== '') {
            editTask(taskId, newText);
        }
    });

    // Function to add event listeners for showing and hiding edit icon on hover
    function addHoverListeners() {
        $('.task-list').on('mouseenter', 'li', function() {
            // Only append the edit icon if it's not already present same for delete icon
            if(!$(this).find('.delete-task-icon').length) {
                $(this).append('<i class="fas fa-trash delete-task-icon ml-2 text-red-500 cursor-pointer hidden"></i>');
            }

            if (!$(this).find('.edit-task-icon').length) {
                $(this).append('<i class="fas fa-edit edit-task-icon ml-2 text-gray-500 cursor-pointer"></i>');
            }
        });

        // Event listener for hiding edit icon when not hovering
        $('.task-list').on('mouseleave', 'li', function() {
            $(this).find('.edit-task-icon').remove();
        });
    }

    // Initially add event listeners for showing and hiding edit icon
    addHoverListeners();

    // Function to remove event listeners for showing and hiding edit icon
    function removeHoverListeners() {
        $('.task-list').off('mouseenter', 'li');
        $('.task-list').off('mouseleave', 'li');
    }

    // Function to reload data from the server for the logged-in user
    function reloadData() {
        var isAuthenticated = "{{ current_user.is_authenticated }}";

        if (isAuthenticated) {
            $.ajax({
                type: 'GET',
                url: '/reload_data',
                success: function(response) {
                    // Empty the task lists
                    $('.task-list').empty();

                    // Update local storage with the new data
                    localStorage.setItem('tasks', JSON.stringify(response.tasks));

                    // Update the UI with the new data
                    Object.keys(response.tasks).forEach(function(key) {
                        var task = response.tasks[key];
                        // Render task with edit and delete icons
                        var taskItem = '<li data-task-id="' + key + '">' + task.task +
                            '<i class="fas fa-trash delete-task-icon ml-2 text-red-500 cursor-pointer hidden"></i></li>';
                        $('#' + task.type + '-tasks').append(taskItem);
                    });

                    addHoverListeners();
                },
                error: function(xhr, status, error) {
                    console.log('Error reloading data:', error);
                }
            });
        }
    }

    // Event listener for the reload data button
    $('#reload-data').click(function(event) {
        event.preventDefault();

        // Force reload data from the server on button click
        reloadData();
    });

});
