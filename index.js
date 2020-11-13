fetch('https://developer.github.com/v4/explorer/', {
    method: "POST",
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
        query: `
        query{
            {
                viewer {
                  login
                  bio
                  repositories(first: 20, orderBy: {field: UPDATED_AT, direction: DESC}) {
                    totalCount
                    nodes {
                      description
                      forkCount
                      id
                      name
                      stargazerCount
                      updatedAt
                      licenseInfo {
                        name
                      }
                      isPrivate
                    }
                  }
                  avatarUrl(size: 10)
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
              
        }
        `
    })
})
    .then(res => res.json())
    .then(data => {
    console.log(data)
})