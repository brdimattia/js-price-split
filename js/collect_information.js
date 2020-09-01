
// collections

var people = [] // {"Name"}
var items = [] // [{ItemName},{ItemPrice}]
var people_items = [] // [[]]

// utility code

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

// action listener registry

$( "#add_person_button" ).click(function(){
    var name = $( "#person_name" ).val();
    $( "#person_name" ).val("")
    if(!isBlank(name)){
        people.push(name)
		people_items.push([])
		var index = people.indexOf(name)
        var name_node = document.createElement("TD")
        var charge_node = document.createElement("TD")  
		charge_node.setAttribute("id", "charge_" + index)
        var textnode = document.createTextNode(name);            
        name_node.appendChild(textnode); 
        var row = document.getElementById("filter_table").insertRow(people.length + 1)
		row.setAttribute("name", name)
        row.setAttribute("id", "row_" + name);
        row.setAttribute("class", "person_row")
		row.appendChild(name_node)    
		
		add_person_checkboxes(name, index)
		row.appendChild(charge_node)
    }
});

function add_person_checkboxes(name, personIndex){
    row = document.getElementById("row_" + name)
	
	items.forEach(function (item, itemIndex) {
		people_items[personIndex].push(false);

        var node = document.createElement("TD");     
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
		checkbox.setAttribute("xCoordinate", itemIndex)
		checkbox.setAttribute("yCoordinate", personIndex)
        node.appendChild(checkbox); 
        row.appendChild(node);  
    });

}

$( "#add_item_button" ).click(function(){
    var itemName = $( item_name ).val();
    var itemPrice = $( item_price ).val();
    $( item_name ).val("")
    $( item_price ).val("1.00")
    var item = [itemName, itemPrice, 0, undefined]
    if(!isBlank(itemName)){
        items.push(item)
		var index = items.indexOf(item)
		
        var name_node = document.createElement("TD");                 
        var textnode = document.createTextNode(itemName);            
        name_node.appendChild(textnode);                            
        document.getElementById("table_header").appendChild(name_node);  
        var price_node = document.createElement("TD");                 
        var textnode = document.createTextNode("$" + itemPrice);      
        price_node.appendChild(textnode);   
		var count_node = document.createElement("TD");
		count_node.setAttribute("id", "count_" + index);
		var znode = document.createTextNode(0); 
		count_node.appendChild(znode);  
		var split_price_node = document.createElement("TD");
		split_price_node.setAttribute("id", "split_price_" + index);
		
        document.getElementById("price_row").appendChild(price_node); 
		document.getElementById("count_row").appendChild(count_node);
		document.getElementById("split_price_row").appendChild(split_price_node);

		
        add_item_checkboxes(item, index)
		
    }

});

function add_item_checkboxes(item, itemIndex){
    rows = document.getElementsByClassName("person_row")
	
	people.forEach(function (person, personIndex) {
		people_items[personIndex].push(false);

        var name = rows[personIndex].getAttribute("name")
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";        
		checkbox.setAttribute("xCoordinate", itemIndex)
		checkbox.setAttribute("yCoordinate", personIndex)
        var node = rows[personIndex].insertCell(items.length);  
		node.appendChild(checkbox);
    });
	
}

// input formatting / handling

$('input[type="number"]').change(function() {
    var min = $(this).attr("min")
    var max = $(this).attr("max")
    var value = $(this).val()
    if(isNaN(value)) { value = 1.00}
    value = parseFloat(Math.round(value * 100) / 100).toFixed(2);   
    if(value < min) { value = min; }        
    if(value > max) { value = max; }
    $(this).val(value);
});

$(document).on("change",":checkbox",function(){
    var isChecked = this.checked
	var x = $(this).attr("xCoordinate")
    var y = $(this).attr("yCoordinate")
	people_items[y][x] = isChecked;
	
	var count = 0
	people.forEach(function (person, personIndex) {
		if(people_items[personIndex][x]){
			count++;
		}
    });
	var count_node = document.getElementById("count_" + x)
	var znode = document.createTextNode(count); 
	count_node.innerHTML = ''
	count_node.appendChild(znode);
	items[x][2] = count;
	
	var split_price_node = document.getElementById("split_price_" + x)
	if(count == 0){
		split_price_node.innerHTML = ''
		items[x][3] = undefined;
	} else {
		var split = items[x][1] / count
		split_price_node.innerHTML = "$" + parseFloat(Math.round(split * 100) / 100).toFixed(2);
		items[x][3] = split;
	}
	
	updateChargeNodes()
	
});

function updateChargeNodes(){
	
	people.forEach(function (person, personIndex) {
		var charge = 0
		people_items[personIndex].forEach(function (peopleItem, index) {
			if(peopleItem){
				charge = charge + items[index][3]
			}
		});	
		var charge_node = document.getElementById("charge_" + personIndex)
		charge_node.innerHTML = "$" + parseFloat(Math.round(charge * 100) / 100).toFixed(2);
    });
	
}



/*
* remove people, items
* force items and people unique
*/