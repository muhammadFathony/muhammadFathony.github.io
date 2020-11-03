document.addEventListener("DOMContentLoaded", () => {
    var elems = document.querySelectorAll(".sidenav");
    M.Sidenav.init(elems);

    const loadNav = () => {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if(this.readyState === 4){
                if(this.status != 200) return;

                document.querySelectorAll(".topnav, .sidenav").forEach(elm =>{
                    elm.innerHTML = xhttp.responseText;
                });

                document.querySelectorAll(".sidenav a, .topnav a").forEach( elm => {
                    elm.addEventListener("click", event => {
                        var sidenav = document.querySelector(".sidenav");
                        M.Sidenav.getInstance(sidenav).close();

                        page = event.target.getAttribute("href").substr(1);
                        loadPage(page);
                    });
                });
              
            }
        };
        xhttp.open("GET", "nav.html", true);
        xhttp.send();
    }
    loadNav();
   
    const loadPage = (page) => {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4){
                var content = document.querySelector("#body-content");

                if(page === "home"){
                    getRangking();
                } else if( page === "favteam"){
                    getTeamFav();
                } else if(page === "schedule"){
                    scheduleMatches();
                }
                if(this.status == 200){
                    content.innerHTML = xhttp.responseText;
                } else if(this.status == 404){
                    //content.innerHTML = "<p>Halaman tidak ditemukan</p>"
                    content.innerHTML = `<p>Halaman tidak ditemukan</p>`;
                } else {
                    content.innerHTML = `<p>Ups ... halaman tidak dapat di akses</p>`
                }
            }
        }
        xhttp.open("GET", "page/"+page+".html", true);
        xhttp.send();
    }
    var page = window.location.hash.substr(1);
    if(page == "") page = "home";
    loadPage(page);
})