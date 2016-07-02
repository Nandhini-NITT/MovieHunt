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
function carouselSetup(){
	if(type=="series")
		{
		$(".item").remove();
		$(".carousel-inner").append('<div class="item active"><img src="series.jpg"/></div>');
		}
	else
		{
			$(".item").remove();
		$(".carousel-inner").append('<div class="item active"><img src="movies.jpg"/></div>');
		}
	var array=["animation","adventure","comedy","thriller","Romance","Drama","Fantasy"];
	var rand=Math.floor(Math.random()*7);
for(var i=0;i<6;i++)
	{
		var sUrl='https://www.omdbapi.com/?s='+array[i]+'&type='+type+'&plot=full&tomato=true';
		$.ajax(sUrl,{
				complete: function(p_oXHR,p_sStatus){
							oData=$.parseJSON(p_oXHR.responseText);
							//console.log(oData);
							//console.log(oData.Search);
							if(oData.Search[rand].Poster!="N/A")
							$(".carousel-inner").append('<div class="item"><img src="' + oData.Search[rand].Poster + '"/></div>');
							else 
									rand=rand+1;
							}
				});
	}
}
$(document).ready(function(){
	
	carouselSetup();
	$('form').submit(function(event){
					event.preventDefault();
					getData();
					});
	$("#IMDb").click(function(){
						changevalue("IMDB id");
						});
	$("#Title").click(function(){
						changevalue("Title");
	});
	$("#submit").click(function(){
						getData();
						});
	$(".navbar-brand").click(function(event){
						event.preventDefault();
						$("#containerMovies").hide();
						$("#myCarousel").show();
						});
						
	$("#series").click(function(event){
						$('.active').removeClass('active');
						$(this).addClass('active');
						event.preventDefault();
						$("#containerMovies").hide();
						$("#myCarousel").show();
						type="series";
						$("#name").val("");
						carouselSetup();
						});
	$("#movies").click(function(event){
						event.preventDefault();
						if(type=='series')
						{
							$('.active').removeClass('active');
						$(this).addClass('active');
						$("#containerMovies").hide();
						$("#myCarousel").show();
						type="movie";
						$("#name").val("");
						carouselSetup();
						}
						});
	
	
	
});
function sendData()
{
	document.getElementById("name").value=this.innerHTML;
	getData();
}
function showsuggestions()
{ 
	$("#myCarousel").show();
	var sMovie=document.getElementById("name").value;
	var sUrl='https://www.omdbapi.com/?s='+sMovie+'&type='+type+'&tomatoes=true&plot=full';
	if(sMovie.length>2)
	{
	$('#containerMovies').hide();
	$("#myCarousel").hide();
	$("#output").append('<ul class="dropdown-menu">');
	$.ajax(sUrl,{
			complete: function(p_oXHR,p_sStatus){
					odata=$.parseJSON(p_oXHR.responseText);
					$("#output").show();
					if(odata.Error==="Movie not found!")
						$("#output").html("<li>No record found<li>");
					else
						{	
							$(".suggest").empty();
							$("#output").append('<ul class="dropdown-menu">');
							for(var i=0;i<odata.totalResults;i++)
							{
								
								$("#output").append("<li id='suggestions'>"+odata.Search[i].Title+"</li>");
							}
							var LI=document.getElementById("output").getElementsByTagName("li");
							for (var i=0; i<LI.length; i++) {
						LI[i].addEventListener('click', sendData, false);
								}
						}
					}
					});
	}
}
	
function getData()
{	
	$Container = $('#containerMovies');
	$Container.hide();
	$("#output").hide();
	sMovie = $('#name').val();
    sUrl = Url + sMovie + '&type='+type+'&tomatoes=true&plot=full';
    $.ajax(sUrl, {
        complete: function(p_oXHR, p_sStatus){
            oData = $.parseJSON(p_oXHR.responseText);
			if(oData.Response==="False")
				alert("No record found");
			else
			{
				$Container.show();
				$("#myCarousel").hide();
				for(var prop in oData)
				{
					if(oData[prop]==="N/A")
					{
						$("."+prop).hide();
						if(prop=="Metascore")
							$(".Metascore-title").hide();
					}

				}	
				$Container.find(".Title").html('<b>'+oData.Title+'</b>');
				$Container.find('.Year').text(oData.Year);
				$Container.find('.Poster').html('<img src="' + oData.Poster + '"/>');
				$Container.find('.Genre').html('<br/><b>Genre</b><p>'+oData.Genre+'</p>');
				$Container.find('.Director').html('<b>Directors</b><p>'+oData.Director+'</p>');
				$Container.find('.Actors').html('<b>Stars</b><p>'+oData.Actors+'</p>');
				$Container.find('.Writer').html('<b>Writers:</b><p>'+oData.Writer+'</p>');
				$Container.find('.Awards').html('<b>Awards:</b><p>'+oData.Awards+'</p>');
				$Container.find('.BoxOffice').html('<b>Box Office Collection:</b><p>'+oData.BoxOffice+'</p>');
				$Container.find('.Metascore').html('<p>'+oData.Metascore+'</p>');
				$Container.find('.imdbVotes').html('<p>'+oData.imdbVotes+'</p>');
				$Container.find('.imdbRating').html('<p>&nbsp'+oData.imdbRating+'/10<span style=”color:#ffaa00”>&#9733;</span></p>');
				var max_length=200;
				if(oData.Plot.length>max_length)
				{
					var short_content=oData.Plot.substr(0,max_length);
					var long_content=oData.Plot.substr(max_length);
					$Container.find('.Plot').html("<p><b>Plot:</b></p><p style='display:table;width:40rem'>"+short_content+
						 '<a href="#" id="read_more"> &nbsp Read More</a>'+
						 '<span id="more_text" style="display:none;">'+long_content+'</span></p>');
					$Container.find('#read_more').click(function(event){ 
					event.preventDefault(); 
					$("#read_more").hide(); /* hide the read more button */
					$Container.find('#more_text').show(); /* show the .more_text span */
					});
				}
			else
			$Container.find('.Plot').html("<p style='color:black'>Plot:</p><p style='color:black;display:table;width:40rem'>"+oData.Plot+"</p>");
        
			}
		}
    });    
}
