var pagination = {
    currentPage: 1,
    lastRow: null,
    pageSize: 10
};

var columnDefs = [
    { headerName: 'Name', field: 'name', suppressMenu: true, suppressFilter: true },
    { headerName: 'Full Name', field: 'full_name', suppressMenu: true, suppressFilter: true },
    { headerName: 'Language', field: 'language', suppressMenu: true, suppressFilter: true }
];

var gridOptions = {
    cacheBlockSize: 10,
    columnDefs: columnDefs,
    enableServerSideSorting: true,
    enableServerSideFilter: true,
    infiniteInitialRowCount: 1,
    onPaginationChanged: onPaginationChanged,
    pagination: true,
    paginationPageSize: pagination.pageSize,
    rowModelType: 'infinite'
};

function onPaginationChanged() {
    if (gridOptions.api) {
        pagination.currentPage = gridOptions.api.paginationGetCurrentPage() + 1;
    }
}

var dataSource = {
    rowCount: pagination.lastRow,
    getRows: function (params) {
        agGrid
            .simpleHttpRequest({
                url: 'https://api.github.com/users/vega/repos?' +
                'page=' + pagination.currentPage +
                '&per_page=' + pagination.pageSize
            })
            .then(function (newData) {
                var newDataLength = newData.length;
                if (newDataLength === 0 || newDataLength < pagination.pageSize) {
                    pagination.lastRow = (pagination.currentPage - 1) * pagination.pageSize + newDataLength;
                }
                params.successCallback(newData, pagination.lastRow);
            });
    }
};

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    gridOptions.api.setDatasource(dataSource);
});
