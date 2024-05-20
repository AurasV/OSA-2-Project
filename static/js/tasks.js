// tasks.js

$(document).ready(function() {
    // Load tasks from cookie into local storage for caching
    function loadTasksFromCookie() {
        var storedTasksString = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)tasks\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
        try {
            // Replace '\054' with ',' weird encoding shenanigans
            storedTasksString = storedTasksString.replace(/\\054/g, ',');
            var storedTasks = JSON.parse(storedTasksString);
            if (storedTasks) {
                localStorage.setItem('tasks', JSON.stringify(storedTasks));
            }
        } catch (error) {

        }
    }

    // Load tasks from local storage into UI
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
                // make sure we have unique identifier for deleting and updating to work properly
                $('#' + task.type + '-tasks').append('<li data-task-id="' + key + '">' + task.task + '</li>');
            });
        }
    }

    // Function to update local storage with new task
    function updateLocalStorage(task, taskType, taskId) {
        var storedTasks = JSON.parse(localStorage.getItem('tasks')) || {};
        storedTasks[taskId] = {'task': task, 'type': taskType};
        localStorage.setItem('tasks', JSON.stringify(storedTasks));
    }

    loadTasksFromCookie();
    loadTasksFromLocalStorage();

    // Event listener for task delete icon click
    $('.add-task-form').submit(function(event) {
        event.preventDefault();

        var taskInput = $(this).find('input[type="text"]');
        var taskText = taskInput.val();
        var taskType = $(this).attr('id').split('-')[1];

        $.ajax({
            type: 'POST',
            url: '/add_task',
            data: {
                task: taskText,
                type: taskType
            },
            success: function(response) {
                var taskId = response.task_id;
                var taskItem = '<li data-task-id="' + taskId + '">' + taskText +
                    '<i class="fas fa-trash delete-task-icon ml-2 text-red-500 cursor-pointer hidden"></i></li>';
                $('#' + taskType + '-tasks').append(taskItem);

                taskInput.val('');
            },
            error: function(xhr, status, error) {
                alert('Please log in to add a task.');
            }
        });
    });
});
