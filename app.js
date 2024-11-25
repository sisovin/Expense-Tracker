$(document).ready(function () {
  const API_BASE = 'http://localhost:3000'; // JSON and API Base URL
  /* const API_BASE = "https://your-saas-api.com"; // Replace with your SaaS API endpoint */

  function fetchExpenses() {
    $.get(`${API_BASE}/expenses`, function (data) {
      console.log('Fetching expenses', data); // Log fetched data
      $('#expenseTable').empty();
      data.forEach((expense) => {
        console.log('Appending expense:', expense); // Log each expense being appended
        $('#expenseTable').append(`
          <tr>
            <td>${expense.description}</td>
            <td>$${expense.amount}</td>
            <td><button class="btn btn-primary btn-sm" onclick="editExpense(${expense.id})">Edit</button></td>
            <td><button class="btn btn-danger btn-sm" onclick="deleteExpense(${expense.id})">Delete</button></td>
          </tr>
        `);
      });
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.error('Error fetching expenses:', textStatus, errorThrown); // Log any errors
    });
  }

  $('#expenseForm').on('submit', function (e) {
    e.preventDefault();
    const description = $('#description').val();
    const amount = $('#amount').val();
    console.log('Adding expense', { description, amount }); // Log submitted data

    $.post(`${API_BASE}/expenses`, { description, amount }, function () {
      console.log('Expense added successfully'); // Log success message
      fetchExpenses(); // Fetch expenses after adding a new one
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.error('Error adding expense:', textStatus, errorThrown); // Log any errors
    });
  });

  window.editExpense = function (id) {
    const description = prompt('Enter new description');
    const amount = prompt('Enter new amount');

    $.ajax({
      url: `${API_BASE}/expenses/${id}`,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({ description, amount }),
      success: function () {
        fetchExpenses();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error('Error editing expense:', textStatus, errorThrown); // Log any errors
      },
    });
  };

  window.deleteExpense = function (id) {
    $.ajax({
      url: `${API_BASE}/expenses/${id}`,
      type: 'DELETE',
      success: function () {
        fetchExpenses();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error('Error deleting expense:', textStatus, errorThrown); // Log any errors
      },
    });
  };

  fetchExpenses();
});
