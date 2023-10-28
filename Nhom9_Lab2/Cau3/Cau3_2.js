var tableSelect = document.getElementById("table-selection");
var foodselect = document.getElementById("food-selection");
var value_table_root = tableSelect.value;
console.log(value_table_root)
var value_food_root = foodselect.value;
console.log(Change_food(value_food_root));
console.log("-------------------");
var table1 = document.querySelector(".table1_content table");
var table2 = document.querySelector(".table2_content table");
var table3 = document.querySelector(".table3_content table");
var rows_table1 = table1.querySelectorAll("tbody tr");
var rows_table2 = table2.querySelectorAll("tbody tr");
var rows_table3 = table3.querySelectorAll("tbody tr");
var tbody_table1 = table1.querySelectorAll("tbody");
var tbody_table2 = table2.querySelectorAll("tbody");
var tbody_table3 = table3.querySelectorAll("tbody");


function showDropdown(selectElement) {
    selectElement.size = selectElement.options.length;
};

function hideDropdown(selectElement) {
    selectElement.size = 1;
};

function VietnameseString(str) {
    str = str.toLowerCase();
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return str;
}

function Change_food(str) {
    switch (str) {
        case "food1":
            return "Bún bò";
        case "food2":
            return "Hủ tiếu";
        case "food3":
            return "Bánh canh";
        case "food4":
            return "Phở bò";
        case "food5":
            return "Nuôi";
        case "food6":
            return "Bánh mỳ thịt";
        case "food7":
            return "Bánh cuốn";
    }
}


foodselect.addEventListener("click", function () {
    var selectedTable = tableSelect.value;
    var table_need_change = document.querySelector("." + selectedTable + "_content table");
    var tbody = table_need_change.querySelector("tbody");
    var rows_need_change = table_need_change.querySelectorAll("tbody tr");
    var selectedFood = foodselect.value;
    var flat = false;
    if (rows_need_change.length > 0) {
        for (var i = 0; i < rows_need_change.length; i++) {
            var cells = rows_need_change[i].querySelectorAll("td");
            if (cells.length > 0 && VietnameseString(cells[0].textContent) == VietnameseString(Change_food(selectedFood))) {
                console.log("Bàn được chọn: " + selectedTable);
                console.log("Món được chọn: " + Change_food(selectedFood));
                console.log("Món đã có: " + cells[0].textContent);
                console.log("-------------------");
                var curent_quantity = parseInt(cells[1].textContent);
                cells[1].textContent = (curent_quantity + 1).toString();
                Total_price();
                return;
            }
        }
        // console.log("Bàn được chọn: " + selectedTable);
        // console.log("Món được chọn: " + selectedFood);
        console.log("Bàn được chọn: " + selectedTable);
        console.log("Món được chọn: " + Change_food(selectedFood));
        console.log("-------------------");
        // Tạo một hàng mới
        var newRow = document.createElement("tr");
        // Tạo data cho hàng
        var food_cell = document.createElement("td");
        var price_of_food = "0";
        switch (selectedFood) {
            case "food1":
                food_cell.textContent = "Bún bò";
                price_of_food = "20000";
                break;
            case "food2":
                food_cell.textContent = "Hủ tiếu";
                price_of_food = "18000";
                break;
            case "food3":
                food_cell.textContent = "Bánh canh";
                price_of_food = "17000";
                break;
            case "food4":
                food_cell.textContent = "Phở bò";
                price_of_food = "19000";
                break;
            case "food5":
                food_cell.textContent = "Nuôi";
                price_of_food = "15000";
                break;
            case "food6":
                food_cell.textContent = "Bánh mỳ thịt";
                price_of_food = "12000";
                break;
            case "food7":
                food_cell.textContent = "Bánh cuốn";
                price_of_food = "15000";
                break;
        }
        newRow.appendChild(food_cell);

        var quantity_cell = document.createElement("td");
        quantity_cell.textContent = "1";
        newRow.appendChild(quantity_cell);

        var price_cell = document.createElement("td");
        price_cell.textContent = price_of_food;
        newRow.appendChild(price_cell);

        var buttonCell = document.createElement("td");
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Xóa";
        deleteButton.onclick = function () {
            newRow.remove();
            Total_price();
        };
        buttonCell.appendChild(deleteButton);
        newRow.appendChild(buttonCell);
        // Thêm cột data vào bảng
        tbody.appendChild(newRow);

        Total_price();
    }
    else {
        console.log("Bàn được chọn: " + selectedTable);
        console.log("Món được chọn: " + Change_food(selectedFood));
        console.log("-------------------");
        // Tạo một hàng mới
        var newRow = document.createElement("tr");
        // Tạo data cho hàng
        var food_cell = document.createElement("td");
        var price_of_food = "0";
        switch (selectedFood) {
            case "food1":
                food_cell.textContent = "Bún bò";
                price_of_food = "20000";
                break;
            case "food2":
                food_cell.textContent = "Hủ tiếu";
                price_of_food = "18000";
                break;
            case "food3":
                food_cell.textContent = "Bánh canh";
                price_of_food = "17000";
                break;
            case "food4":
                food_cell.textContent = "Phở bò";
                price_of_food = "19000";
                break;
            case "food5":
                food_cell.textContent = "Nuôi";
                price_of_food = "15000";
                break;
            case "food6":
                food_cell.textContent = "Bánh mỳ thịt";
                price_of_food = "12000";
                break;
            case "food7":
                food_cell.textContent = "Bánh cuốn";
                price_of_food = "15000";
                break;
        }
        newRow.appendChild(food_cell);

        var quantity_cell = document.createElement("td");
        quantity_cell.textContent = "1";
        newRow.appendChild(quantity_cell);

        var price_cell = document.createElement("td");
        price_cell.textContent = price_of_food;
        newRow.appendChild(price_cell);

        var buttonCell = document.createElement("td");
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Xóa";
        deleteButton.onclick = function () {
            newRow.remove();
            Total_price();
        };
        buttonCell.appendChild(deleteButton);
        newRow.appendChild(buttonCell);
        // Thêm cột data vào bảng
        tbody.appendChild(newRow);

        // Tính tổng giá
        Total_price();

    }

});

function Total_price() {
    var tableSelect_price = document.getElementById("table-selection");
    var selectedTable = tableSelect_price.value;
    var table_need_change = document.querySelector("." + selectedTable + "_content table");
    var tbody = table_need_change.querySelector("tbody");
    var Total_price = 0;
    var current_rows = tbody.querySelectorAll("tr");
    var str_price = document.getElementById("Total_price_" + selectedTable);
    for (var i = 0; i < current_rows.length; i++) {
        var cells = current_rows[i].querySelectorAll("td");
        Total_price = Total_price + parseInt(cells[1].textContent) * parseInt(cells[2].textContent);
    }
    str_price.textContent = Total_price.toString();
}

function Update_All_total_price() {
    for (var i = 1; i <= 3; i++) {
        var table_need_change = document.querySelector(".table" + i + "_content table");
        var tbody = table_need_change.querySelector("tbody");
        var Total_price = 0;
        var current_rows = tbody.querySelectorAll("tr");
        var str_price = document.getElementById("Total_price_table" + i);
        for (var i = 0; i < current_rows.length; i++) {
            var cells = current_rows[i].querySelectorAll("td");
            Total_price = Total_price + parseInt(cells[1].textContent) * parseInt(cells[2].textContent);
        }
        str_price.textContent = Total_price.toString();
    }
}


