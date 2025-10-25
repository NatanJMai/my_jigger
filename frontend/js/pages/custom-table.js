/**
 * Template Name: UBold - Admin & Dashboard Template
 * By (Author): Coderthemes
 * Module/App (File Name): Custom Table
 */

class Table {

  constructor(table, parentInstance) {

    this.table = table;
    this.parentInstance = parentInstance;

    this.thead = table.querySelector('thead');
    this.tbody = table.querySelector('tbody');
    this.headers = []

    if (this.thead) {
      this.headers = Array.from(this.thead.querySelectorAll('th'));
    }
    this.rows = Array.from(this.tbody.querySelectorAll('tr'));
    this.filteredRows = [...this.rows];
    this.rowsPerPage = parseInt(table.getAttribute(this.parentInstance.rowsPerPageAttribute) ?? this.parentInstance.rowsPerPage);
    this.currentPage = this.parentInstance.currentPage;

    this.checkAllCheckBox = null;
    this.searchInput = null;
    this.pagination = null;
    this.paginationInfo = null;
    this.filters = [];
    this.rangeFilters = [];

    this.itemNotFoundMessage = 'Nothing found.'
    this.deleteRowMessage = 'Are you sure you want to delete this row?'
    this.deleteMultipleRowsMessage = 'Are you sure you want to delete these rows?'
  }

  get totalPages() {
    return Math.ceil(this.filteredRows.length / this.rowsPerPage) || 1;
  }

  init() {
    this.setupCheckAll();
    this.setupCheckboxListeners();
    this.setupSearch();

    if (this.headers.length > 0) {
      this.setupFilters();
      this.setupSort();
    }

    this.setupRowsPerPage()
    this.setupPagination();
    this.setupPaginationInfo();
    this.deleteSelected();
    this.deleteRow();

    this.update();
  }

  setupCheckAll() {
    if (this.thead) {
      this.checkAllCheckBox = this.thead.querySelector(this.parentInstance.checkAllSelector)
      if (this.checkAllCheckBox) {
        this.checkAllCheckBox.addEventListener('click', (e) => {
          const checkboxes = this.rows.map(row => row.querySelector('input[type="checkbox"]'));
          if (checkboxes && checkboxes.length > 0) {
            checkboxes.forEach(checkbox => checkbox.checked = e.target.checked);
          }
        })
      }
    }
  }

  setupCheckboxListeners() {
    const checkboxes = this.table.querySelectorAll('input[type="checkbox"]');
    if (this.checkAllCheckBox && checkboxes.length > 0) {
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          const anyChecked = Array.from(checkboxes).some(c => c.checked);
          if (this.deleteSelectedSelector && this.filteredRows.length > 0) {
            this.deleteSelectedSelector.classList.toggle('d-none', !anyChecked);
          }
        });
      });
    }
  }

  setupSearch() {
    this.searchInput = this.table.querySelector(this.parentInstance.searchSelector);
    if (this.searchInput) {
      this.searchInput.addEventListener('keyup', (e) => {
        const value = e.target.value.toLowerCase();
        this.filteredRows = this.rows.filter(row => {
          const cells = Array.from(row.querySelectorAll('td'));
          return cells.some(cell => cell.textContent.toLowerCase().includes(value));
        });
        this.currentPage = 1;
        this.update();
      });
    }
  }

  setupFilters() {
    this.filters = Array.from(this.table.querySelectorAll(this.parentInstance.filterSelector));
    this.filters.forEach(filter => {
      filter.addEventListener('change', () => {
        this.applyFilters();
        this.currentPage = 1;
        this.update();
      });
    });

    this.rangeFilters = Array.from(this.table.querySelectorAll(this.parentInstance.rangeFilterSelector));
    this.rangeFilters.forEach(rangeFilter => {
      rangeFilter.addEventListener('change', () => {
        this.applyFilters()
        this.currentPage = 1;
        this.update();
      });
    });
  }

  applyFilters() {

    const matchesFilters = row => {
      return this.filters.every(filter => {
        const selectedValue = filter.value;
        if (!selectedValue || selectedValue === "All") return true;

        const column = filter.dataset.tableFilter;
        const headerIndex = this.headers.findIndex(th => th.dataset.column === column);
        if (headerIndex === -1) return true;

        const cell = row.children[headerIndex];
        if (!cell) return true;

        const cellFilterValue = cell.getAttribute('data-filter-value') || cell.textContent;

        return cellFilterValue.trim().toLowerCase() === selectedValue.toLowerCase();
      });
    };

    const matchesRangeFilters = row => {
      return this.rangeFilters.every(filter => {
        const selectedRange = filter.value;
        if (!selectedRange || selectedRange === "All") return true;

        const column = filter.dataset.tableRangeFilter;
        const headerIndex = this.headers.findIndex(th => th.dataset.column === column);
        if (headerIndex === -1) return true;

        const cell = row.children[headerIndex];
        if (!cell) return true;

        const text = cell.textContent.trim();

        const isDateColumn = column.toLowerCase().includes("date");
        if (isDateColumn) {
          const cellDate = new Date(text);
          if (isNaN(cellDate.getTime())) return false;

          const now = new Date();
          const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
          let rangeStart, rangeEnd;

          switch (selectedRange) {
            case "Today":
              return cellDate >= startOfToday && cellDate < endOfToday;
            case "Last 7 Days":
              rangeStart = new Date(now);
              rangeStart.setDate(now.getDate() - 7);
              rangeEnd = endOfToday;
              return cellDate >= rangeStart && cellDate < rangeEnd;
            case "Last 30 Days":
              rangeStart = new Date(now);
              rangeStart.setDate(now.getDate() - 30);
              rangeEnd = endOfToday;
              return cellDate >= rangeStart && cellDate < rangeEnd;
            case "This Year":
              rangeStart = new Date(now.getFullYear(), 0, 1);
              rangeEnd = new Date(now.getFullYear() + 1, 0, 1);
              return cellDate >= rangeStart && cellDate < rangeEnd;
            default:
              return true;
          }
        } else {
          const value = parseFloat(text.replace(/[^\d.-]/g, ''));
          if (isNaN(value)) return false;

          if (selectedRange.endsWith('+')) {
            const min = parseFloat(selectedRange.slice(0, -1));
            return value >= min;
          }

          const [min, max] = selectedRange.split('-').map(str => parseFloat(str.trim()));
          if (isNaN(min) || isNaN(max)) return false;

          return value >= min && value <= max;
        }
      });
    };

    this.filteredRows = this.rows.filter(row => matchesFilters(row) && matchesRangeFilters(row));
  }

  setupRowsPerPage() {
    const rowsPerPageSelect = this.table.querySelector(this.parentInstance.rowsPerPageSelector);
    if (rowsPerPageSelect) {

      const values = Array.from(rowsPerPageSelect.options).map(opt => parseInt(opt.value));

      if (!values.includes(this.rowsPerPage)) {
        values.push(this.rowsPerPage);
      }

      values.sort((a, b) => a - b);

      rowsPerPageSelect.innerHTML = '';

      values.forEach(value => {
        const option = document.createElement('option');
        option.value = value.toString();
        option.textContent = value.toString();
        rowsPerPageSelect.appendChild(option);
      });

      rowsPerPageSelect.value = this.rowsPerPage;

      rowsPerPageSelect.addEventListener('change', (e) => {
        e.preventDefault();
        this.rowsPerPage = parseInt(e.target.value);
        this.update();
      });
    }
  }

  setupPagination() {
    this.pagination = this.table.querySelector(this.parentInstance.paginationSelector);
  }

  renderTablePage(page) {
    this.tbody.innerHTML = '';

    const start = (page - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    const pageRows = this.filteredRows.slice(start, end);

    const oldMessageRow = this.tbody.querySelector('.no-results');
    if (oldMessageRow) oldMessageRow.remove();

    if (pageRows.length === 0) {
      const columnCount = this.table.querySelectorAll('thead th').length
      const messageRow = document.createElement('tr');
      messageRow.className = 'no-results';
      messageRow.innerHTML = `<td colspan="${columnCount}" class="text-center text-muted py-3">${this.itemNotFoundMessage}</td>`;
      this.tbody.appendChild(messageRow);
    } else {
      pageRows.forEach(row => {
        this.tbody.appendChild(row);
      });
    }

  }

  renderPagination() {
    const ul = document.createElement('ul');
    ul.className = 'pagination pagination-sm pagination-boxed mb-0 justify-content-center';

    this.pagination.innerHTML = '';

    const totalPages = this.totalPages;

    const prev = document.createElement('li');
    prev.className = `page-item ${this.currentPage === 1 ? 'disabled' : ''}`;
    prev.innerHTML = `<a href="#" class="page-link"><i class="ti ti-chevron-left"></i></a>`;
    prev.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.currentPage > 1) {
        this.currentPage--;
        this.update();
      }
    });
    ul.appendChild(prev);

    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement('li');
      li.className = `page-item ${this.currentPage === i ? 'active' : ''}`;
      li.innerHTML = `<a href="#" class="page-link">${i}</a>`;
      li.addEventListener('click', (e) => {
        e.preventDefault();
        this.currentPage = i;
        this.update();
      });
      ul.appendChild(li);
    }

    const next = document.createElement('li');
    next.className = `page-item ${this.currentPage === totalPages ? 'disabled' : ''}`;
    next.innerHTML = `<a href="#" class="page-link"><i class="ti ti-chevron-right"></i></a>`;
    next.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.update();
      }
    });
    ul.appendChild(next);

    this.pagination.appendChild(ul);

    this.setupPaginationInfo();
  }

  setupPaginationInfo() {
    this.paginationInfo = this.table.querySelector(this.parentInstance.paginationInfoSelector);
    if (this.paginationInfo) {

      this.paginationInfo.className = 'text-muted';

      const infoAttribute = this.paginationInfo.getAttribute(this.parentInstance.paginationInfoAttribute);

      const startRow = (this.currentPage - 1) * this.rowsPerPage + 1;
      const endRow = Math.min(this.currentPage * this.rowsPerPage, this.filteredRows.length);

      this.paginationInfo.innerHTML = `Showing <span class="fw-semibold">${startRow}</span> to <span class="fw-semibold">${endRow}</span> of <span class="fw-semibold">${this.filteredRows.length}</span> ${(infoAttribute && infoAttribute !== '') ? infoAttribute : 'entries'}`;
    }
  }

  update() {
    this.renderTablePage(this.currentPage);

    if (this.pagination) {
      const hasRows = this.filteredRows.length > 0;
      this.pagination.style.display = hasRows ? 'block' : 'none';

      if (this.paginationInfo) {
        this.paginationInfo.style.display = hasRows ? 'block' : 'none';
      }

      if (hasRows) this.renderPagination();
    }
  }

  setupSort() {

    const sortItems = this.table.querySelectorAll(this.parentInstance.sortSelector);

    sortItems.forEach(header => {

      header.style.cursor = 'pointer';

      let icon = header.querySelector('i');
      if (!icon) {
        icon = document.createElement('i');
        icon.className = 'ti ti-arrows-sort fs-xs ms-1';
        header.appendChild(icon);
      }

      header.addEventListener('click', e => {
        e.preventDefault();

        const columnIndex = Array.from(header.parentElement.children).indexOf(header);
        if (columnIndex === -1) return;

        const sortKey = header.getAttribute(this.parentInstance.sortAttribute)
        const currentDirection = header.dataset.direction;
        const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
        header.dataset.direction = newDirection;

        if (newDirection === 'asc') {
          icon.className = 'ti ti-arrow-up fs-xs ms-1';
        } else {
          icon.className = 'ti ti-arrow-down fs-xs ms-1';
        }

        function getSortValue(row, columnIndex, sortKey) {
          const cell = row.children[columnIndex];
          if (!cell) return '';

          let raw = '';

          if (sortKey) {
            const target = cell.querySelector(`[data-sort="${sortKey}"]`);
            raw = target ? target.textContent.trim() : '';
          } else {
            const primaryTextNode = Array.from(cell.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
            raw = primaryTextNode ? primaryTextNode.textContent.trim() : cell.textContent.trim();
          }

          raw = raw.replace(/\s+/g, ' ');

          const parenMatch = raw.match(/^\(([\d,.\s]+)\)$/);
          if (parenMatch) {
            const val = parseFloat(parenMatch[1].replace(/,/g, ''));
            return isNaN(val) ? raw.toLowerCase() : -val;
          }

          const percentPattern = /^-?[\d,.]+%$/;
          if (percentPattern.test(raw)) {
            const val = parseFloat(raw.replace('%', ''));
            return isNaN(val) ? 0 : val / 100;
          }

          const suffixPattern = /^-?[\$€₹]?\s*([\d,.]+)\s*([KMB])?$/i;
          const suffixMatch = raw.match(suffixPattern);
          if (suffixMatch) {
            let number = parseFloat(suffixMatch[1].replace(/,/g, ''));
            const suffix = suffixMatch[2]?.toUpperCase();
            const multipliers = {K: 1e3, M: 1e6, B: 1e9};
            if (!isNaN(number)) {
              if (suffix && multipliers[suffix]) number *= multipliers[suffix];
              return number;
            }
          }

          const ordinalMatch = raw.match(/^(\d+)(st|nd|rd|th)$/i);
          if (ordinalMatch) {
            return parseInt(ordinalMatch[1], 10);
          }

          if (/^-?\d+(\.\d+)?$/.test(raw)) {
            const val = parseFloat(raw);
            return isNaN(val) ? raw.toLowerCase() : val;
          }

          const parsedDate = new Date(raw);
          if (!isNaN(parsedDate.getTime())) {
            return parsedDate.getTime();
          }

          return raw.toLowerCase();
        }

        this.filteredRows.sort((a, b) => {
          const aVal = getSortValue(a, columnIndex, sortKey);
          const bVal = getSortValue(b, columnIndex, sortKey);

          if (typeof aVal === 'number' && typeof bVal === 'number') {
            return newDirection === 'asc' ? aVal - bVal : bVal - aVal;
          }

          if (typeof aVal === 'string' && typeof bVal === 'string') {
            return newDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
          }

          return 0;
        });

        this.currentPage = 1
        this.update();

      });
    });
  }

  deleteSelected() {
    this.deleteSelectedSelector = this.table.querySelector(this.parentInstance.deleteSelectedSelector);
    if (this.deleteSelectedSelector) {

      this.deleteSelectedSelector.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedRows = this.rows.filter(row => row.querySelector('input[type="checkbox"]').checked);
        if (selectedRows.length > 0) {

          const {
            modal, confirmButton
          } = this.alert(selectedRows.length > 1 ? this.deleteMultipleRowsMessage : this.deleteRowMessage);

          const totalRows = this.rows

          const onConfirm = () => {
            selectedRows.forEach(row => row.remove());

            const remainingRows = totalRows.filter(row => !selectedRows.includes(row));

            this.rows = [...remainingRows];
            this.filteredRows = [...remainingRows];

            if (this.currentPage > this.totalPages) {
              this.currentPage = this.totalPages;
            }

            this.update();

            modal.hide();

            this.deleteSelectedSelector.classList.add('d-none');
            this.checkAllCheckBox.checked = false;
          }

          modal.show();
          confirmButton.addEventListener('click', onConfirm);
        }
      })
    }
  }

  deleteRow() {
    const deleteButtons = this.table.querySelectorAll(this.parentInstance.deleteRowSelector);
    if (deleteButtons) {
      deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();

          const {modal, confirmButton} = this.alert();

          const totalRows = this.rows

          const onConfirm = () => {
            const rowToBeDelete = button.closest('tr')
            rowToBeDelete.remove()

            const remainingRows = totalRows.filter(row => row !== rowToBeDelete);

            this.rows = [...remainingRows];
            this.filteredRows = [...remainingRows];

            if (this.currentPage > this.totalPages) {
              this.currentPage = this.totalPages;
            }

            this.update();

            modal.hide();
          }

          modal.show();
          confirmButton.addEventListener('click', onConfirm);
        })
      })
    }
  }

  alert(message) {
    const modalHTML = `
        <div id="confirm-delete-modal" class="modal fade" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Confirm Deletion</h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">   
                        <p class="mb-0">${message ?? this.deleteRowMessage}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                          <button type="button" class="btn btn-danger" id="confirm-delete">Delete</button>
                    </div>
                </div>
            </div>
        </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modalElement = document.getElementById('confirm-delete-modal');
    const modal = new bootstrap.Modal(modalElement);
    const confirmButton = modalElement.querySelector('#confirm-delete');

    return {modal, confirmButton}
  }

}

class CustomTable {

  constructor({
                tableSelector = '[data-table]',
                checkAllSelector = '[data-table-select-all]',
                searchSelector = '[data-table-search]',
                filterSelector = 'select[data-table-filter], input[data-table-filter]',
                rangeFilterSelector = 'select[data-table-range-filter], input[data-table-range-filter]',
                rowsPerPageSelector = '[data-table-set-rows-per-page]',
                rowsPerPageAttribute = 'data-table-rows-per-page',
                paginationSelector = '[data-table-pagination]',
                sortSelector = '[data-table-sort]',
                sortAttribute = 'data-table-sort',
                paginationInfoSelector = '[data-table-pagination-info]',
                paginationInfoAttribute = 'data-table-pagination-info',
                deleteSelectedSelector = '[data-table-delete-selected]',
                deleteRowSelector = '[data-table-delete-row]',
                rowsPerPage = 10,
                currentPage = 1,
              } = {}) {

    this.tableSelector = tableSelector;
    this.checkAllSelector = checkAllSelector;
    this.searchSelector = searchSelector;
    this.filterSelector = filterSelector;
    this.rangeFilterSelector = rangeFilterSelector;
    this.rowsPerPageSelector = rowsPerPageSelector;
    this.rowsPerPageAttribute = rowsPerPageAttribute;
    this.paginationSelector = paginationSelector;
    this.sortSelector = sortSelector;
    this.sortAttribute = sortAttribute;
    this.paginationInfoSelector = paginationInfoSelector;
    this.paginationInfoAttribute = paginationInfoAttribute;
    this.deleteSelectedSelector = deleteSelectedSelector;
    this.deleteRowSelector = deleteRowSelector;
    this.rowsPerPage = rowsPerPage;
    this.currentPage = currentPage;

    this.tables = [];

    this.init();
  }

  init() {
    const tableElements = document.querySelectorAll(this.tableSelector);

    tableElements.forEach((table) => {
      const tableInstance = new Table(table, this);
      this.tables.push(tableInstance);
      tableInstance.init();
    });
  }

}

document.addEventListener("DOMContentLoaded", () => {
  new CustomTable()
})