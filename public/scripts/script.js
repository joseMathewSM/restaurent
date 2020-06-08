function updateOrder(quantity, name, price){

  let itemArray = [];
  //check to see if storage exists.
  if (typeof(Storage) !== "undefined") {
    //check to see if there is an order already in place.
    if(sessionStorage.order){
      let updated = false;
      itemArray = JSON.parse(sessionStorage.getItem("order"));
      //checking if the item exists, and in that case updating the uantity.
      itemArray.forEach(function(i){
        if(i.name == name){
          updated = true;
          if(quantity >= 0)
            i.quantity = quantity;
        }
      })
      //if item not present alreay, adding to the Array.
      if(updated == false){
        let item = {name: name, price: price, quantity: quantity};
        itemArray.push(item);
      }
    }else{
      //if list not Present
      let item = {name: name, price: price, quantity: quantity};
      itemArray.push(item);
    }
    //Remove any item whose quantity is 0 or less.
    itemArray.forEach(function(i){
      if(i.quantity <= 0)
        itemArray.pop(i)
    })
    sessionStorage.order =  JSON.stringify(itemArray)
  } else {
    alert("Sorry you browser does not Support cacheing!");
  }
}

//display the array.
function displayOrder(){
  let itemArray = JSON.parse(sessionStorage.order);
  let total = 0;
  let text = "";
  itemArray.forEach(function(i){
    text += i.name + " Rs." + i.price + " - " + i.quantity + "\n"
    total += Number(i.price) * i.quantity;
  })
  text += "Total: " + total;
  document.getElementById("selected").value = text;
}

function refresh(){
  sessionStorage.clear();
}

function addItem(){
  let item = '<div class="row"><div class="col"><input type="text" name="itemname" class="form-control" placeholder="Item Name"></div><div class="col"><input type="number" name= "itemprice" class="form-control" placeholder="Price"></div><div class="col"><input type="text" required="true" name="itemcategory" class="form-control" placeholder="category"></div>';
  console.log(item);
  document.getElementById("itemGroup").insertAdjacentHTML("beforeend", item);
}
