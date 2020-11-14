//----- DOM Elements -----

const profileImage = document.getElementById("profile-image");
const nameDisplay = document.getElementById("name-display");
const profileName = document.getElementById("name");
const username = document.getElementById("username");
const bio = document.getElementById("bio");
const following = document.getElementById("following");
const followers = document.getElementById("followers");
const stars = document.getElementById("stars");
const login = document.getElementById("login");
const bigImage = document.getElementById("big-image");
const totalRepo = document.getElementById("total-repo");
const result = document.getElementById("result");
const boxContainer = document.querySelector(".result");

//------------------------

fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "bearer 5619a12da76ced8d172412142065bb4a6c79a226",
  },
  body: JSON.stringify({
    query: `
    query{
            viewer {
              login
              bio
              repositories(first: 20, orderBy: {field: UPDATED_AT, direction: DESC}) {
                totalCount
                nodes {
                  description
                  forkCount
                  name
                  stargazerCount
                  updatedAt
                  licenseInfo {
                    name
                  }
                  isPrivate
                  primaryLanguage {
                    color
                    name
                  }
                  viewerHasStarred
                }
              }
              avatarUrl(size: 298)
              following {
                totalCount
              }
              followers {
                totalCount
              }
              starredRepositories {
                totalCount
              }
              name
            }
          
  }
      `,
  }),
})
  .then((res) => res.json())
  .then((data) => {
    const database = data.data.viewer;


    const addInnerText = (db, elem, val1, val2, val3) => {
      if (!val2 && !val3) {
        return (elem.innerHTML = db[val1]);
      }

      if (!val3) {
        return (elem.innerHTML = db[val1][val2]);
      }

      return (elem.innerHTML = db[val1][val2][val3]);
    };


    const addImage = (elem) => {
      return (elem.src = database.avatarUrl);
    };


    const timeSince = (strDate) => {
      let date = Date.parse(strDate)

      let seconds = Math.floor((new Date() - date) / 1000);
      let intervalType;
    
      let interval = Math.floor(seconds / 31536000);
      if (interval >= 1) {
        intervalType = 'year';
      } else {
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
          intervalType = 'month';
        } else {
          interval = Math.floor(seconds / 86400);
          if (interval >= 1) {
            intervalType = 'day';
          } else {
            interval = Math.floor(seconds / 3600);
            if (interval >= 1) {
              intervalType = "hour";
            } else {
              interval = Math.floor(seconds / 60);
              if (interval >= 1) {
                intervalType = "minute";
              } else {
                interval = seconds;
                intervalType = "second";
              }
            }
          }
        }
      }
    
      if (interval > 1 || interval === 0) {
        intervalType += 's';
      }
    
      return `${interval} ${intervalType} ago`
    };


    const iterateDatabase = (db) => {
      const public = db.filter((re) => {
        return !re.isPrivate;
      });


      result.innerHTML = public.length;


      public.forEach((el) => {
        boxContainer.innerHTML += `<div class="repository-box">
        <div class="details">
          <h2>${el.name}</h2>
          <p>${el.description ? el.description : ""}</p>
          <div class="stats">
            <p ><span><img src="/github-icons/dot-fill (1).svg" alt=""></span>${
              el.primaryLanguage ? el.primaryLanguage.name : ""
            }</p>
            <p ><span><img src="/github-icons/star.svg" alt=""></span>${
              el.stargazerCount ? el.stargazerCount : ""
            }</p>
            <p ><span><img src="/github-icons/repo-forked.svg" alt=""></span>${
              el.forkCount ? el.forkCount : ""
            }</p>
            <p ><span><img src="/github-icons/law.svg" alt=""></span>${
              el.licenseInfo ? el.licenseInfo.name : ""
            }</p>
            <p>${timeSince(el.updatedAt)}</p>
          </div>
        </div>
        <div class="star">
          <button class="group"><img src="/github-icons/star.svg" alt="">${
            el.viewerHasStarred ? "Unstar" : "Star"
          }</button>
        </div>
      </div>`;
      });
    };


    addImage(profileImage);

    addImage(nameDisplay);

    addImage(bigImage);

    addInnerText(database, profileName, "name");

    addInnerText(database, username, "login");

    addInnerText(database, bio, "bio");

    addInnerText(database, following, "following", "totalCount");

    addInnerText(database, login, "login");

    addInnerText(database, followers, "followers", "totalCount");

    addInnerText(database, stars, "starredRepositories", "totalCount");

    addInnerText(database, totalRepo, "repositories", "totalCount");

    iterateDatabase(database.repositories.nodes);
  });
