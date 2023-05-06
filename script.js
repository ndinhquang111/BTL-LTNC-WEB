// customer class

class Customer {
    constructor(name, phoneNumber, numberofCustomers, tableID) {
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.numberofCustomers = numberofCustomers;
        this.tableID = tableID;
    }
}

// local storage store the customer

class Store {
    static getCustomers() {
        let customers;

        if (localStorage.getItem("customers") === null) {
            customers = [];
        } else {
            customers = JSON.parse(localStorage.getItem("customers"));
        }

        return customers;
    }

    static addCustomer(customer) {
        const customers = Store.getCustomers();
        if (customers.find((c) => c.tableID === customer.tableID)) {
            // UI.showAlert("The table is already booked", "danger")
            return;
        }
        customers.push(customer);
        localStorage.setItem("customers", JSON.stringify(customers));
    }

    static removeCustomer(tableID) {
        const customers = Store.getCustomers();

        customers.forEach((customer, pos) => {
            if (customer.tableID === tableID) {
                customers.splice(pos, 1);
            }
        });

        localStorage.setItem("customers", JSON.stringify(customers));
    }
}

// ui operations

class UI {
    static displayCustomers() {
        const customers = Store.getCustomers();

        customers.forEach((customer) => UI.addCustomerToList(customer));
    }

    static addCustomerToList(customer) {
        const list = document.getElementById("customer-list");

        const row = document.createElement("tr");

        row.innerHTML = `

        <td>${customer.name}</td>
        <td>${customer.phoneNumber}</td>
        <td>${customer.numberofCustomers}</td>
        <td>${customer.tableID}</td>
        <td>
        <a href="#" class="btn btn-danger btn-sm delete">X</a>
        </td>

        `;

        list.appendChild(row);
    }

    static clearFields() {
        document.getElementById("name").value = "";
        document.getElementById("phoneNumber").value = "";
        document.getElementById("numberofCustomers").value = "";
        document.getElementById("tableID").value = "";
    }

    static showAlert(message, className) {
        const div = document.createElement("div");

        div.className = `alert alert-${className} alert-format`;

        div.appendChild(document.createTextNode(message));

        const container = document.querySelector(".container");
        if (className == "danger") {
            const form = document.getElementById("customer-form");
            const button = document.getElementById("button-submit");
            form.insertBefore(div, button);
        } else if (className == "success") {
            const table = document.getElementById("table");
            container.insertBefore(div, table);
        }


        // vanish the message after 1 second

        setTimeout(() => {
            document.querySelector(".alert").remove();
        }, 1000);
    }

    static deleteCustomer(el) {
        if (el.classList.contains("delete")) {
            el.parentElement.parentElement.remove();
        }
    }
}

// display customer

document.addEventListener("DOMContentLoaded", UI.displayCustomers());

// remove a customer

document
    .querySelector("#customer-list")
    .addEventListener("click", function (e) {
        UI.deleteCustomer(e.target);

        Store.removeCustomer(
            e.target.parentElement.previousElementSibling.textContent
        );

        UI.showAlert("Customer Deleted", "success");
    });

// open pop-up;
document
    .querySelector("#add-customer-btn")
    .addEventListener("click", function (e) {
        e.preventDefault();

        // display the pop-up form
        // const overlay = document.createElement("div");
        // overlay.classList.add("overlay");
        // document.body.appendChild(overlay);
        document.querySelector("#add-customer-modal").style.display = "block";
    });

// add a customer
const closeButton = document.querySelector(".close");

// Add an event listener to the close button
closeButton.addEventListener("click", () => {
    // Remove the modal from the DOM
    const modal = document.querySelector("#add-customer-modal");
    modal.style.display = "none";
});
document.addEventListener("submit", function (e) {
    e.preventDefault();

    // get form values

    const name = document.querySelector("#name").value;
    const phoneNumber = document.querySelector("#phoneNumber").value;
    const numberofCustomers =
        document.querySelector("#numberofCustomers").value;
    const tableID = document.querySelector("#tableID").value;

    if (
        name === "" ||
        phoneNumber === "" ||
        numberofCustomers === "" ||
        tableID === ""
    ) {
        UI.showAlert("Please enter all the information", "danger");
    } else {
        const customer = new Customer(
            name,
            phoneNumber,
            numberofCustomers,
            tableID
        );

        const customers = Store.getCustomers();
        if (customers.find((c) => c.tableID === customer.tableID)) {
            UI.showAlert("The table is already booked", "danger");
            return;
        }

        if (Number.isInteger(Number(customer.tableID)) === false) {
            UI.showAlert("Please select a interger", "danger");
            return;
        }

        if (customer.tableID > 16) {
            UI.showAlert("We just have 16 tables", "danger");
            return;
        } else if (customer.tableID <= 0) {
            UI.showAlert("Please select a valid table", "danger");
            return;
        }

        function checkPhoneNumber(inputValue) {
            // Convert the input value to a string and remove any leading/trailing spaces
            let inputString = inputValue.toString().trim();

            // Check if the input string is a number with a length of 10 digits
            if (/^\d{10}$/.test(inputString)) {
                return 10;
            } else {
                return -1;
            }
        }
        if (checkPhoneNumber(customer.phoneNumber) !== 10) {
            UI.showAlert("Please select a valid phone number", "danger");
            return;
        }
        if (customer.numberofCustomers < 1 && customer.numberofCustomers > 5) {
            UI.showAlert("Sorry, a table can contain maximun 5 customers", "danger");
        }

        Store.addCustomer(customer);

        UI.addCustomerToList(customer);

        UI.showAlert("Customer Added", "success");

        UI.clearFields();
        document.querySelector("#add-customer-modal").style.display = "none";
    }
});
