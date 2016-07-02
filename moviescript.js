var Url,type="movie";
var search_length=0;
function changevalue(str)
{
	document.getElementById("selecttype").innerHTML=str;
	$("#name").val('');
	$("#name").attr("placeholder","Enter "+str);
	if(str=="Title")
		Url='https://www.omdbapi.com/?t=';
	else if(str=="IMDB id")
		Url='https://www.omdbapi.com/?i=';
}
function yearcheck()
{
	if(document.getElementById('year').value.length==4)
		showsuggestions();
}
function setYear()
{
	$("#getyear").html("<input type='text' id='year' placeholder='Year of release' onkeyup='yearcheck();'>&nbsp<button style='position:relative;top:-0.1px' class='btn btn-danger' onClick='showyear();'><span class='glyphicon glyphicon-minus'></span></button>");
}
function showyear()
{
	$('#getyear').html('<button class="btn btn-primary"  onClick="setYear();"><span class="glyphicon glyphicon-plus"></span></button>Add Year for More refined search');
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
function sendData(i)
{
	document.getElementById("name").value=document.getElementById("result"+i).innerHTML;
	getData();
}
function showsuggestions()
{ 
	var Url='https://www.omdbapi.com/?s=';
	$("#myCarousel").show();
	var sMovie=document.getElementById("name").value;
	year=$('#year').val()||0;
	if(year==0)
		sUrl=Url+sMovie+'&type='+type+'&tomatoes=true&plot=full';
	else
	sUrl = Url + sMovie + '&type='+type+'&y='+year+'&tomatoes=true&plot=full';
	
	//else
	
	if(sMovie.length>2)
	{
	$('#containerMovies').hide();
	$("#myCarousel").hide();
	$("#output").append('<ul class="dropdown-menu">');
	$.ajax(sUrl,{
			complete: function(p_oXHR,p_sStatus){
					odata=$.parseJSON(p_oXHR.responseText);
					$("#output").show();
					search_length=odata.totalResults;
					if(odata.Error==="Movie not found!")
						$("#output").html("<li>No record found<li>");
					else
						{	
							$(".suggest").empty();
							//$("#output").append('<ul class="dropdown-menu">');
							for(var i=0;i<odata.totalResults;i++)
							{
								if(i==0)
								$("#output").append("<li><a href='#' class='.active' id='result"+i+"' onClick='sendData("+i+");return false;'>"+odata.Search[i].Title+"</a></li>");
								else
									$("#output").append("<li><a href='#' id='result"+i+"' onClick='sendData("+i+");return false;'>"+odata.Search[i].Title+"</a></li>");
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
	year=$('#year').val();
	if(!$("#year").is(":empty"))
	sUrl = Url + sMovie + '&type='+type+'y='+year+'&tomatoes=true&plot=full';
	else
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
					else
					{
						$("."+prop).show();
						if(prop=="Metascore")
							$(".Metascore-title").show();
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