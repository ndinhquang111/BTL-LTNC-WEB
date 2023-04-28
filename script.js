// customer class

class Customer {
    constructor(name, phoneNumber, index) {
        this.name = name
        this.phoneNumber = phoneNumber
        this.index = index
    }
}

// local storage store the customer

class Store {
    static getCustomers() {
        let customers

        if (localStorage.getItem('customers') === null) {
            customers = []
        } else {
            customers = JSON.parse(localStorage.getItem('customers'))
        }

        return customers
    }

    static addCustomer(customer) {
        const customers = Store.getCustomers()
        customers.push(customer)
        localStorage.setItem('customers',JSON.stringify(customers))
    }

    static removeCustomer(isbn) {
        const customers = Store.getCustomers()

        customers.forEach((customer, pos) => {
            if (customer.index === index) {
                customers.splice(pos, 1)
            }
        })

        localStorage.setItem('customers', JSON.stringify(customers))
    }
}

// ui operations

class UI {
    static displayCustomers() {
        const customers = Store.getCustomers()

        customers.forEach((customer) => UI.addCustomerToList(customer))
    }

    static addCustomerToList(customer) {
        const list = document.getElementById('customer-list')

        const row = document.createElement('tr')

        row.innerHTML = `

        <td>${customer.name}</td>
        <td>${customer.phoneNumber}</td>
        <td>${customer.index}</td>
        <td>
        <a href="#" class="btn btn-danger btn-sm delete">X</a>
        </td>

        `

        list.appendChild(row)
    }

    static clearFields() {
        document.getElementById("name").value = ''
        document.getElementById("phoneNumber").value = ''
        document.getElementById("index").value = ''
    }

    static showAlert(message,className) {
        const div = document.createElement('div')

        div.className = `alert alert-${className}`

        div.appendChild(document.createTextNode(message))

        const container = document.querySelector('.container')

        const form = document.getElementById("customer-form")

        container.insertBefore(div,form)

        // vanish the message after 1 second

        setTimeout(() => {
            document.querySelector('.alert').remove()

        }, 1000);
    }

    static deleteCustomer(el) {
        if (el.classList.contains("delete")) {
            el.parentElement.parentElement.remove()
        }
    }
}

// display customer

document.addEventListener('DOMContentLoaded', UI.displayCustomers())

// remove a customer

document.querySelector('#customer-list').addEventListener('click', function (e) {
    UI.deleteCustomer(e.target)

    Store.removeCustomer(e.target.parentElement.previousElementSibling.textContent)

    UI.showAlert("Customer Deleted","success")
})

// add a customer

document.addEventListener('submit', function (e) {
    e.preventDefault()

    // get form values

    const name = document.querySelector("#name").value
    const phoneNumber = document.querySelector("#phoneNumber").value
    const index = document.querySelector("#index").value

    if (name === "" || phoneNumber === "" || index === "") {
        UI.showAlert("Please enter all the information", "danger")
    } else {

        const customer = new Customer(name, phoneNumber, index)

        UI.addCustomerToList(customer)

        Store.addCustomer(customer)

        UI.showAlert("Customer Added", "success")

        UI.clearFields()
    }
})





