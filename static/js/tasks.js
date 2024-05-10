// tasks.js

$(document).ready(function() {
    // Load tasks from cookie into local storage
    function loadTasksFromCookie() {
        var storedTasksString = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)tasks\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
        try {
            // Replace '\054' with ','
            storedTasksString = storedTasksString.replace(/\\054/g, ',');
            var storedTasks = JSON.parse(storedTasksString);
            if (storedTasks) {
                localStorage.setItem('tasks', JSON.stringify(storedTasks));
            }
        } catch (error) {

        }
    }

    // Load tasks from local storage if available and populate the task lists
    function loadTasksFromLocalStorage() {
        var storedTasks = JSON.parse(localStorage.getItem('tasks'));
        try {
            storedTasks = JSON.parse(JSON.parse(localStorage.getItem('tasks')));
        }
        catch (error) {

        }
        if (storedTasks) {
            Object.keys(storedTasks).forEach(function(key) {
                var task = storedTasks[key];
                $('#' + task.type + '-tasks').append('<li>' + task.task + '</li>');
            });
        }
    }

    // Function to update local storage with new task
    function updateLocalStorage(task, taskType, taskId) {
        var storedTasks = JSON.parse(localStorage.getItem('tasks')) || {};
        storedTasks[taskId] = {'task': task, 'type': taskType};
        localStorage.setItem('tasks', JSON.stringify(storedTasks));
    }

    // Function to reload data from the server for the logged-in user
    function reloadData() {
        // Check if the user is logged in
        var isAuthenticated = "{{ current_user.is_authenticated }}";

        if (isAuthenticated) {
            // Send AJAX request to reload data from the server
            $.ajax({
                type: 'GET',
                url: '/reload_data', // Endpoint to reload data from the server
                success: function(response) {
                    // Empty the task lists
                    $('.task-list').empty();

                    // Update local storage with the new data
                    localStorage.setItem('tasks', JSON.stringify(response.tasks));

                    // Update the UI with the new data
                    Object.keys(response.tasks).forEach(function(key) {
                        var task = response.tasks[key];
                        $('#' + task.type + '-tasks').append('<li>' + task.task + '</li>');
                    });
                },
                error: function(xhr, status, error) {
                    console.error('Error reloading data:', error);
                    // Handle errors, such as displaying an error message to the user
                }
            });
        }
    }



    // Call the functions when the document is ready
    loadTasksFromCookie();
    loadTasksFromLocalStorage();

    // Event listener for the reload data button
    $('#reload-data').click(function(event) {
        event.preventDefault(); // Prevent default button behavior

        // Reload data from the server
        reloadData();
    });

    // Add task form submission for all task types
    // Add task button click handler
    $('.add-task-form').submit(function(event) {
        event.preventDefault();

        // Proceed with adding the task
        var taskInput = $(this).find('input[type="text"]');
        var taskText = taskInput.val();
        var taskType = $(this).attr('id').split('-')[1];

        // Send AJAX request to add the task
        $.ajax({
            type: 'POST',
            url: '/add_task',
            data: {
                task: taskText,
                type: taskType
            },
            success: function(response) {
                // Add the task to the UI
                var taskId = response.task_id;
                $('#' + taskType + '-tasks').append('<li data-task-id="' + taskId + '">' + taskText + '</li>');

                // Clear the task input
                taskInput.val('');
            },
            error: function(xhr, status, error) {
                alert('Please log in to add a task.');
                // Handle errors, such as displaying an error message to the user
            }
        });
    });
});
