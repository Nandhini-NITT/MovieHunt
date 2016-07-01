var Url,type="movie";
function changevalue(str)
{
	document.getElementById("selecttype").innerHTML=str;
	$("input").val('');
	$("input").attr("placeholder","Enter "+str);
	if(str=="Title")
		Url='https://www.omdbapi.com/?t=';
	else if(str=="IMDB id")
		Url='https://www.omdbapi.com/?i=';
}
$(document).ready(function(){
	var array=["animation","adventure","comedy","thriller","Romance"];
	var rand=Math.floor(Math.random()*4);
	for(var i=0;i<4;i++)
	{
		var sUrl='https://www.omdbapi.com/?s='+array[i];
		$.ajax(sUrl,{
				complete: function(p_oXHR,p_sStatus){
							oData=$.parseJSON(p_oXHR.responseText);
							if(oData.Search[rand].Poster!="N/A")
							$(".carousel-inner").append('<div class="item"><img src="' + oData.Search[rand].Poster + '"/></div>');
							else rand-1;
							}
				});
	}
	$("#IMDb").click(function(){
						changevalue("IMDB id");
						});
	$("#Title").click(function(){
						changevalue("Title");
	});
	$("#submit").click(function(){
						getData();
						});
	
});
function getData()
{	
	$Container = $('#containerMovies');
	$Container.hide();
	sMovie = $('#name').val();
    sUrl = ""+Url + sMovie + '&type=movie&tomatoes=true&plot=full'
    $.ajax(sUrl, {
        complete: function(p_oXHR, p_sStatus){
            oData = $.parseJSON(p_oXHR.responseText);
			console.log(oData);
			$Container.show();
			$Container.find(".Title").html('<b>'+oData.Title+'</b>');
			$Container.find('.year').text(oData.Year);
			$Container.find('.poster').html('<img src="' + oData.Poster + '"/>');
			$Container.find('.genre').html('<br/><b>Genre</b><p>'+oData.Genre+'</p>');
			$Container.find('.directors').html('<b>Directors</b><p>'+oData.Director+'</p>');
			$Container.find('.stars').html('<b>Stars</b><p>'+oData.Actors+'</p>');
			$Container.find('.writers').html('<b>Writers:</b><p>'+oData.Writer+'</p>');
			$Container.find('.awards').html('<b>Awards:</b><p>'+oData.Awards+'</p>');
			$Container.find('.boxoffice').html('<b>Box Office Collection:</b><p>'+oData.BoxOffice+'</p>');
			$Container.find('.metascore').html('<p>'+oData.Metascore+'</p>');
			$Container.find('.imdbpoll').html('<p>'+oData.imdbVotes+'</p>');
			$Container.find('.imdbrating').html('<p>&nbsp'+oData.imdbRating+'/10<span style=”color:#ffaa00”>&#9733;</span></p>');
			var max_length=200;
			if(oData.Plot.length>max_length)
				{
					var short_content=oData.Plot.substr(0,max_length);
					var long_content=oData.Plot.substr(max_length);
					$Container.find('.description').html("<p><b>Plot:</b></p><p style='display:table;width:40rem'>"+short_content+
						 '<a href="#" id="read_more"> &nbsp Read More</a>'+
						 '<span id="more_text" style="display:none;">'+long_content+'</span></p>');
					$Container.find('#read_more').click(function(event){ 
						event.preventDefault(); 
						$("#read_more").hide(); /* hide the read more button */
						$Container.find('#more_text').show(); /* show the .more_text span */
						});
				}
			else
			$Container.find('.description').html("<p style='color:black'>Plot:</p><p style='color:black;display:table;width:40rem'>"+oData.Plot+"</p>");
        }
    });    
}
