// export.js

document.addEventListener('DOMContentLoaded', function () {
    const exportButton = document.getElementById('export-button');
    const exportModal = document.getElementById('export-modal');
    const closeModal = document.getElementById('close-modal');
    const exportCsvButton = document.getElementById('export-csv');
    const exportExcelButton = document.getElementById('export-excel');

    exportButton.addEventListener('click', function () {
        if (isAuthenticated === true) {
            exportModal.classList.remove('hidden');
        } else {
            alert('Please log in to export tasks.');
        }
    });

    closeModal.addEventListener('click', function () {
        exportModal.classList.add('hidden');
    });

    exportCsvButton.addEventListener('click', function () {
        exportTasks('csv');
    });

    exportExcelButton.addEventListener('click', function () {
        exportTasks('excel');
    });

    function exportTasks(format) {
        fetch('/get_tasks')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const tasks = data.tasks;
                    const csvContent = generateCSV(tasks);
                    const excelContent = generateExcel(tasks);

                    if (format === 'csv') {
                        downloadFile(csvContent, 'tasks.csv', 'text/csv');
                    } else if (format === 'excel') {
                        downloadFile(excelContent, 'tasks.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    }
                } else {
                    alert('Failed to retrieve tasks.');
                }
            });
    }

    function generateCSV(tasks) {
        const columns = ['Urgent Tasks', 'Normal Tasks', 'Future Tasks', 'Repetitive Tasks'];
        let csv = columns.join(',') + '\n';

        const maxRows = Math.max(
            tasks.filter(task => task.type === 'urgent').length,
            tasks.filter(task => task.type === 'normal').length,
            tasks.filter(task => task.type === 'future').length,
            tasks.filter(task => task.type === 'repetitive').length
        );

        for (let i = 0; i < maxRows; i++) {
            const row = [];
            columns.forEach(column => {
                const taskType = column.split(' ')[0].toLowerCase();
                const task = tasks.filter(task => task.type === taskType)[i];
                row.push(task ? task.task : '');
            });
            csv += row.join(',') + '\n';
        }
        return csv;
    }

    function generateExcel(tasks) {
        const columns = ['Urgent Tasks', 'Normal Tasks', 'Future Tasks', 'Repetitive Tasks'];
        const ws_data = [columns];

        const maxRows = Math.max(
            tasks.filter(task => task.type === 'urgent').length,
            tasks.filter(task => task.type === 'normal').length,
            tasks.filter(task => task.type === 'future').length,
            tasks.filter(task => task.type === 'repetitive').length
        );

        for (let i = 0; i < maxRows; i++) {
            const row = [];
            columns.forEach(column => {
                const taskType = column.split(' ')[0].toLowerCase();
                const task = tasks.filter(task => task.type === taskType)[i];
                row.push(task ? task.task : '');
            });
            ws_data.push(row);
        }

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        XLSX.utils.book_append_sheet(wb, ws, 'Tasks');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        const buf = new ArrayBuffer(wbout.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < wbout.length; ++i) {
            view[i] = wbout.charCodeAt(i) & 0xFF;
        }
        return buf;
    }

    function downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
});
