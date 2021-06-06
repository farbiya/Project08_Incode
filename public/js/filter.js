$(document).ready(function(e) {

    $("#assignedSelect").on("click", function(e) { 

     var isAssigned = this.value;
     var data = {"isAssigned":isAssigned}
        var url = "/ticket/filter";
        $.ajax({
            method: "POST",
            url: url,
            data:data
            })
            .done(function(response) {
                var searchResults = []
                for (var i=0;(i<6) && i<response.length;i++){
                    ticket = {};
                    ticket._id = response[i]._id;
                    ticket.completed = response[i].completed;
                    ticket.title = response[i].title;
                        searchResults.push(ticket);
                  
                }
                var html = "";
                searchResults.forEach(function(ticket,index) {   
                    if (ticket.completed) {
                       
                        html+=  `<tr key={`+index+`}>
                       
                          <td >`+ticket.title+`</td>
                          <td><a href="/ticket/`+ticket._id+`" class="nav-link">View</a></td>
                          <td><a href="/ticket/`+ ticket._id +`/edit" class="nav-link" >Edit</a></td>
                           <td ><i class="fa fa-check-circle"></i> Resolved</td>
                      </tr>`;
                    } else {
                        html+=  `<tr key={`+index+`}>
                        
                          <td >`+ticket.title+`</td>
                          <td><a href="/ticket/`+ticket._id+`" class="nav-link">View</a></td>
                          <td><a href="/ticket/`+ ticket._id +`/edit" class="nav-link">Edit</a></td>
                          <td ><i class="fa fa-spinner fa-pulse "></i>In progress</td> 
                      </tr>`;
                    }
                });
               $("tbody").html(html);
               
            });
               

    });
});