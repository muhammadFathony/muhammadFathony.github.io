const token = 'e0abc2ab26ed4cc3b3fae46638dfd359';
const baseURL = 'https://api.football-data.org/v2/';
const rankingLeague = `${baseURL}competitions/2021/standings`;
const profilteams = `${baseURL}teams/`;
const matchesEPL = `${baseURL}competitions/2021/matches?matchday=1`;

const status = response => {
    if(response.status !== 200){
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
};

const json = response => {
    return response.json();
};

const error = error => console.log('Error :' + error);
const loading = (prop) => {
    const load = document.querySelector(".overlay");
    load.style.display = prop;
};
const showNotification = (t,b = 'English Premier League.') => {
    const title = t || 'Classement Information';
    const options = {
        'body': b,
        'icon': 'images/epl.png'
    }
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification(title, options);
        });
    } else {
        console.error('FItur notifikasi tidak diijinkan.');
    }
};

const fetchAPI = url => {
    return fetch(url, {
        method: 'GET',
        headers: {
            'X-Auth-Token' : token
        }
    });
};

const viewSchedule = element => {
    var viewMatches = `<tr class="center-align">
                            <td class="center-align">${element.awayTeam.name}</td>
                            <td class="center-align">VS</td>
                            <td class="center-align">${element.homeTeam.name}</td>
                        </tr>`;
    return viewMatches;
}

const viewRangking = element => {
    var viewCard = "";
    viewCard = `<div class="col s12 m8 offset-m2 l6 offset-l3">
                        <div class="card-panel grey lighten-5 z-depth-1">
                            <div class="row valign-wrapper">
                                <div class="col l2 s6 club">
                                    <a onclick="filterclub(${element.team.id})">
                                    <img src="${element.team.crestUrl}" alt="club.png"
                                    onerror="this.src='images/football.png'"
                                    class="circle responsive-img">
                                    </a>
                                </div>
                                <div class="col l10 s6">
                                    <h2 class="black-text">
                                        ${element.team.name}
                                    </h2>
                                    <h3>Position : ${element.position}</h3>
                                </div>
                            </div>
                        </div>
                    </div>`;
    return viewCard;
};

const detailRangking = data => {
    var detailCard = "";
    detailCard =    `<div class="fixed-action-btn">
                        <a class="btn-floating btn-large blue" id="saved">
                            <i class="large material-icons">add_circle</i>
                        </a>
                    </div>
                    <div class="card">
                        <div class="card-image waves-effect waves-block waves-light">
                            <img class="activator" src="${data.crestUrl}"
                            alt="club.png" onerror="this.src='images/football.png'">
                        </div>
                        <div class="card-content">
                            <span class="card-title activator grey-text text-darken-4">${data.name}<i class="material-icons right">more_vert</i></span>
                        <p><a href="#">${data.email}</a></p>
                        </div>
                        <div class="card-reveal">
                            <span class="card-title grey-text text-darken-4">${data.name}<i class="material-icons right">close</i></span>
                        <p>address : ${data.address} <br> email : ${data.email} <br>founded: ${data.founded} <br> telp : ${data.phone} <br> Stadium : ${data.venue}</p>
                        </div>
                    </div>`;
    return detailCard;
};

const getRangking = () => {
    loading("block");
    if('caches' in window){
        caches.match(rankingLeague).then(response => {
            if(response){
                response.json().then(data => {
                    var cache_real = data.standings[0].table;
                    var articleHTML = "";
                    cache_real.forEach(element => {
                        articleHTML += viewRangking(element);
                    });
                    document.getElementById("home").innerHTML = articleHTML;
                    loading("none");
                });
            }
        });
    }
    fetchAPI(rankingLeague)
    .then(status)
    .then(json)
    .then(data=> {
        var real = data.standings[0].table;
        var articleHTML = "";
        real.forEach(element => {
            articleHTML += viewRangking(element);
        });
        document.getElementById("home").innerHTML = articleHTML;
        loading("none");
    }).catch(error);
};

const filterclub = (id) => {
    loading("block");
    return new Promise((resolve, reject) => {
        if("caches" in window){
            caches.match(profilteams+id).then(response => {
                if(response){
                    loading("none");
                    response.json().then(data => {
                         var profil = detailRangking(data);
                         document.getElementById("home").innerHTML = profil;
                         resolve(data);
                         const btnfav = document.getElementById("saved");
                         btnfav.addEventListener("click", () => {
                            addFav(data)
                         });
                    })
                }
            })
        }
     
         fetch(profilteams+id, 
             {
                 method: 'GET',
                 headers: {
                     'X-Auth-Token' : token
                 }
             })
             .then(status)
             .then(json)
             .then(data=> {
                loading("none");
                var profil = detailRangking(data);
                 document.getElementById("home").innerHTML = profil;
                 resolve(data);
                 const btnfav = document.getElementById("saved");
                 btnfav.addEventListener("click", () => {
                    addFav(data)
                 });
             }).catch(error);
    });
};

const getTeamFav = () => {
    getAll().then(club => {
        var articleHTML = "";
        if(club.length > 0){
            club.forEach(element => {
                articleHTML += `
                                <div class="col s12 m8 offset-m2 l6 offset-l3">
                                    <div class="card-panel grey lighten-5 z-depth-1">
                                        <div class="row valign-wrapper">
                                            <div class="col l2 s6 club">
                                                <a onclick="filterclub(${element.id})">
                                                <img src="${element.crestUrl}" alt="" class="circle responsive-img">
                                                </a>
                                            </div>
                                            <div class="col l10 s6">
                                                <h2 class="black-text">
                                                    ${element.name}
                                                </h2>
                                                <h3>Website : <a>${element.website}</a></h3>
                                                <a class="waves-effect waves-light btn-small color1" onclick="deleteFavorite(${element.id})"><i class="material-icons left">cancel</i>Delete</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
            });                
        } else {
            articleHTML += `<h2>Empty Favorites Team</h2>`
        }
        document.getElementById("home").innerHTML = articleHTML;  
    })
};

const deleteFavorite = id => {
    deleteFav(id)
        .then(() => getTeamFav());
};

const scheduleMatches = () => {
    loading("block")
    if('caches' in window){
        caches.match(matchesEPL).then(response => {
            if(response){
                response.json().then(data => {
                    const match = data;
                    var articleHTML = "";
                    match.matches.forEach(element => {
                        articleHTML += viewSchedule(element);
                    });
                    document.getElementById("body-match").innerHTML = articleHTML;
                    loading("none");
                });
            }
        });
    }
    fetch(matchesEPL, 
        {
            method: 'GET',
            headers: {
                'X-Auth-Token' : token
            }
        })
        .then(status)
        .then(json)
        .then(data=> {
            const match = data;
            var articleHTML = "";
            match.matches.forEach(element => {
                articleHTML += viewSchedule(element);
            });
            document.getElementById("body-match").innerHTML = articleHTML;
            loading("none");
        }).catch(error);
};


