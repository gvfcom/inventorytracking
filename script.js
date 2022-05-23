// ==================
// Product attributes
// ==================
db =
[
    'thumbnail',
    'product',
    'description',
    'price',
    'stock',
    'operation'
];

// ==============
// CRUD Functions
// ==============
function createOrUpdateItem(id=null)
{
    if (document.getElementById('form').hidden)
    {
        document.getElementById('form').hidden = false;

        requestFormInnerHtml = document.getElementById('form').innerHTML;

        if (requestFormInnerHtml == '')
        {
            for (i = 0; i < 5; i++)
            {
                switch (db[i]) {
                    case 'thumbnail':
                        requestFormInnerHtml += "<label for='" + db[i] + "'>Thumbnail URL:</label><br>";

                        value = id == null ? '' : JSON.parse(localStorage.getItem(id))[db[i]];

                        requestFormInnerHtml += "<input type='url' placeholder='https://site.com/image.jpg' required id='" + db[i] + "' value='" + value + "'><br>";

                        break;
                    case 'product':
                        requestFormInnerHtml += "<label for='" + db[i] + "'>" + db[i].charAt(0).toUpperCase() + db[i].slice(1) + ":</label><br>";

                        value = id == null ? '' : JSON.parse(localStorage.getItem(id))[db[i]];

                        requestFormInnerHtml += "<input type='text' required id='" + db[i] + "' value='" + value + "'><br>";

                        break;
                    case 'description':
                        requestFormInnerHtml += "<label for='" + db[i] + "'>" + db[i].charAt(0).toUpperCase() + db[i].slice(1) + ":</label><br>";

                        value = id == null ? '' : JSON.parse(localStorage.getItem(id))[db[i]];

                        requestFormInnerHtml += "<input type='text' required id='" + db[i] + "' value='" + value + "'><br>";

                        break;
                    case 'price':
                        requestFormInnerHtml += "<label for='" + db[i] + "'>" + db[i].charAt(0).toUpperCase() + db[i].slice(1) + ":</label><br>";

                        value = id == null ? '' : JSON.parse(localStorage.getItem(id))[db[i]];

                        requestFormInnerHtml += "<input type='number' class='dollar' min='0.01' step='0.01' required id='" + db[i] + "' value='" + value + "'><br>";

                        break;
                    case 'stock':
                        requestFormInnerHtml += "<label for='" + db[i] + "'>" + db[i].charAt(0).toUpperCase() + db[i].slice(1) + ":</label><br>";

                        value = id == null ? '' : JSON.parse(localStorage.getItem(id))[db[i]];

                        requestFormInnerHtml += "<input type='number' min='0' step='1' default='1' required id='" + db[i] + "' value='" + value + "'><br>";

                        break;
                    default:
                        break;
                }
            }

            if (id == null)
            {
                id = localStorage.length == null ? 0 : localStorage.length;
            }

            requestFormInnerHtml += "<input type='text' readonly id= 'id' value='" + id + "' hidden><br>";

            document.getElementById('form').innerHTML = requestFormInnerHtml;
        }
        
    }
    else if (document.getElementById('form').hidden == false)
    {
        newItem = {};
    
        for (i = 0; i < db.length; i++)
        {
            value = '';

            if (db[i] != 'operation')
            {
                if (db[i] == 'price') {
                    value = parseFloat(document.getElementById(db[i]).value).toFixed(2);
                } else {
                    value = document.getElementById(db[i]).value;
                }
            }

            newItem[ db[i] ] = value;

            if (value == '' && db[i] != 'operation')
            {
                if (confirm('Sorry, we can\'t have empty or wrong values! Do you want to clear the form?')) document.getElementById('form').innerHTML = '';
                document.getElementById('create').value = 'Create';
                document.getElementById('form').hidden = true;

                refreshTable();

                return false;
            }
        }
    
        id = document.getElementById('id').value;
        
        localStorage.setItem(id, JSON.stringify(newItem));
        document.getElementById('create').value = 'Create';
    
        refreshTable();

        // Clear form:
        document.getElementById('form').innerHTML = '';
        
        document.getElementById('form').hidden = true;
    }
}

function readItem(itemId=null)
{
    if (itemId == null && localStorage.length != 0)
    {
        for (i=0; i<localStorage.length; i++)
        {
            //console.log(JSON.parse(localStorage.getItem(i)));
        }
    }
    else if (itemId != null)
    {
        localStorage.getItem(itemId);
    }
}

function updateItem(itemId)
{
    document.getElementById('create').value = 'Update';

    createOrUpdateItem(itemId);

    refreshTable();
}

function deleteItem(itemId)
{
    if(confirm("Are you certain to delete this item? (This CANNOT be undone.)"))
    {
        var answer = '';

        do
        {
            answer = window.prompt('Why are you deleting this product?');
        } while (answer == '');
        
        var deletedItem = JSON.parse(localStorage.getItem(itemId));

        deletedItem.deleteComment = answer;

        localStorage.setItem(itemId, JSON.stringify(deletedItem));
    }

    refreshTable();
}

function undeleteItem(itemId)
{  
    var deletedItem = JSON.parse(localStorage.getItem(itemId));

    deletedItem.deleteComment = null;

    localStorage.setItem(itemId, JSON.stringify(deletedItem));

    refreshTable();
}

// =======================
// CRUD Extended Functions
// =======================
function deleteAll()
{
    if(confirm("Are you certain to delete ALL ITEMS? (This CANNOT be undone.)"))
    {
        if(confirm("Confirm it one more time to DELETE ALL ITEMS."))
        localStorage.clear();
    }

    refreshTable();
}

// ===================
// Interface Functions
// ===================
function refreshTable()
{
    var tableHtml = "<table class='table'>";
    
    // Table headers:
    tableHtml += "<thead><tr>";
    
    for (i = 0; i < db.length; i++)
    {
        tableHtml += "<th scope='col'>";
        
        value = String(db[i]);
        value = value.charAt(0).toUpperCase() + value.slice(1);

        tableHtml += value;
        
        tableHtml += "</th>";
    }

    tableHtml += "</tr></thead>";

    // Table rows:
    deletedItems = [];
    tableHtml += "<tbody>";

    // row
    for (i = 0; i < localStorage.length && localStorage.length != 0; i++)
    {
        deleted = JSON.parse(localStorage.getItem(i))["deleteComment"] != null ? true : false;

        var tableHtmlAux = '';
        tableHtmlAux += "<tr>";

        // column
        for (j = 0; j < db.length; j++)
        {

            if(db[j] != 'operation')
            {
                if (db[j] == 'thumbnail')
                {
                    tableHtmlAux += "<td class='thumbnail'>";
                } else
                {
                    if (deleted)
                    {
                        tableHtmlAux += db[j] != 'price' ? "<td class='deletedItem'>" : "<td class='deletedItem dollar'>";
                    } else
                    {
                        tableHtmlAux += db[j] != 'price' ? "<td>" : "<td class='dollar'>";
                }
            }

                value = JSON.parse(localStorage.getItem(i))[db[j]];
            
                if (db[j] != 'thumbnail')
                {
                    tableHtmlAux += (value != undefined ? JSON.parse(localStorage.getItem(i))[db[j]] : '');
                }
                else
                {
                    tableHtmlAux += "<img src='";
                    tableHtmlAux += (value != undefined ? JSON.parse(localStorage.getItem(i))[db[j]] : '');
                    tableHtmlAux += "' width='100vw' height='100vh'>";
                }
                
            }
            else
            {
                tableHtmlAux += "<td>"
                if (!deleted) {
                    value = "<input type='button' value='Update' onclick='updateItem(" + i + ");'>";
                    value += "<input type='button' value='Delete' onclick='deleteItem(" + i + ");'>";
                } else
                {
                    value = "Deleted because: " + JSON.parse(localStorage.getItem(i))['deleteComment'] + "<br><input type='button' value='Undelete' onclick='undeleteItem(" + i + ");'>";
                }

                tableHtmlAux += value;                
            }
    
            tableHtmlAux += "</td>";
        }
        
        tableHtmlAux += "</tr>";

        if (deleted) {
            deletedItems.push(String(tableHtmlAux));
        } else
        {
            tableHtml += tableHtmlAux;
        }
    }

    for (i = 0; i < deletedItems.length; i++) {
        tableHtml += deletedItems[i];
    }

    tableHtml += "</tbody></table>";

    document.getElementById('table').innerHTML = tableHtml;
}