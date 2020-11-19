 //--------------- Couleur en rouge------------
function surligne(champ, erreur) { //Si le second paramètre vaut true, cette fonction colore le champ en rouge pâle. Sinon, elle enlève le coloriage.
   if(erreur)
      champ.style.backgroundColor = "#fba"; // champs en rouge
   else
      champ.style.backgroundColor = ""; // pas de couleur
}
//------------------verification du prenom-----------------------------
// vérifier la longueur --> entre 2 et 25 caractères. l'attribut value -> indique sa valeur, et que l'attribut length pour en connaître le nombre de caractères
function verifPrenom(champ) {  // fonction appelée grace a l'évènement onBlur, qui se déclenche lorsque le champ perd le focus
//Quant à l'argument il faut : this car  le champ à vérifier est justement celui qui vient de perdre le focus. (dans html)
if(champ.value.length < 2 || champ.value.length > 25)
   {
      surligne(champ, true);
      return false;
   }else{
      surligne(champ, false);
      return true;
   }};
//-----------------verification du nom-------------------------------
function verifNomUser(champ) {  
if(champ.value.length < 2 || champ.value.length > 25) 
{
      surligne(champ, true);
      return false;
   }else{
      surligne(champ, false);
      return true;
   }};
//-------------------verification du mail----------------------------
//on utilise la méthode test() de l'objet RegExp pour vérifier que l'adresse e-mail satisfasse bien la regex ci-dessus.
function verifMail(champ) {
   var regexMail = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;
   if(!regexMail.test(champ.value)) { // la !
      surligne(champ, true);
      return false;
   }else{
      surligne(champ, false);
      return true;
   }
}
//--------------- Fonction finale de verification------------
//fonction qui renvoi true si prenom nom et mail sont ok
   function verifForm(f) {
   let prenomOk = verifPrenom(f.prenom);
   let nomUserOk = verifNomUser(f.nomUser);
   let mailOk = verifMail(f.email);
   //---variable pour afficher le JS dans l'alert :
   if(prenomOk && nomUserOk && mailOk) {

	alert("😀 Parfait ! Tu peux procèder au paiement");
     return true;
   } else {
      alert("😢 Oup's il doit y avoir une erreur ! Verifie les champs en rouge");
       return false;
   } }
//---------------------------------------------------------
//je n'arrivais pas à faire un traitement AJAX via JS donc j'ai essayé avec JQUERY
// l'auto-complétion : 
//Eentrée de la bibliothèque jQuery pour l'id CP
//cp la source -> pour l'action autocomplete
$("#cp").autocomplete({
	source: function (request, response) { // j'appel la fonction response  en passant le tableau qui contient les cp
		$.ajax({
			url: "https://api-adresse.data.gouv.fr/search/?postcode="+$("input[name='cp']").val(),
			data: { q: request.term },
			dataType: "json", // format json
			success: function (data) { // succes c'est la fct° de rappel à exécuter lorsque la requête Ajax réussit. genre rappel
				var postcodes = [];
				response($.map(data.features, function (item) {
					// on ajoute les CP dans un array pour ne pas avoir plusieurs fois le même
					if ($.inArray(item.properties.postcode, postcodes) == -1) {
						postcodes.push(item.properties.postcode);
						return { label: item.properties.postcode + " - " + item.properties.city, 
								 city: item.properties.city,
								 value: item.properties.postcode
						};
					}
				}));
			}
		});
	},
// du coup ca rempli la ville
	select: function(event, ui) {
		$('#ville').val(ui.item.city);
	}
});
//----------------------Le nom de ville---------------------------------------
$("#ville").autocomplete({
	source: function (request, response) {
		$.ajax({
			url: "https://api-adresse.data.gouv.fr/search/?city="+$("input[name='ville']").val(),
			data: { q: request.term },
			dataType: "json",
			success: function (data) {
				var cities = [];
				response($.map(data.features, function (item) {
					// Ici on est obligé d'ajouter les villes dans un array pour ne pas avoir plusieurs fois la même
					if ($.inArray(item.properties.postcode, cities) == -1) {
						cities.push(item.properties.postcode);
						return { label: item.properties.postcode + " - " + item.properties.city, 
								 postcode: item.properties.postcode,
								 value: item.properties.city
						};
					}
				}));
			}
		});
	},
// On remplit aussi le CP
	select: function(event, ui) {
		$('#cp').val(ui.item.postcode);
	}
});
//------------L'adresse-------------------------------------------
$("#adresse").autocomplete({
	source: function (request, response) {
		$.ajax({
			url: "https://api-adresse.data.gouv.fr/search/?postcode="+$("input[name='cp']").val(),
			data: { q: request.term },
			dataType: "json",
			success: function (data) {
				response($.map(data.features, function (item) {
					return { label: item.properties.name, value: item.properties.name};
				}));
			}
		});
	}
});
//-------------------------------------------------------------
        //  $(document).ready(function(){
        //      $("#get").click(function () {
        //         $("#output").html(
        //             $("#txt").val() + "<br/>" +
        //             $("input:radio[name=s]:checked").val()
		// 		);
		// 		console.log( $("#output"))
        //     });
        //  });