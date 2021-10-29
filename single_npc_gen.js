fetch('https://www.dnd5eapi.co/api/classes')
    .then( response => response.json() )
    .then( response => {
        document.getElementById("content").innerHTML = JSON.stringify(response);
    } );