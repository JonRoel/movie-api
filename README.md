<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="css/styles.css">
  </head>
  <body>
    <h1>Movie API</h1>
    <p>This is a movie api that can be used to access a list of movie detials including: Movie Title, Genre, Directors and description.</p>
    <h2>Tools Used</h2>
    <p>Language</p>
    <p>Javascript</p>
    <p>Database</p>
    <p>MongoDB</p>
    <p>Framework</p>
    <p>Express</p>
    <p>Server Environment</p>
    <p>Node.js</p>
    <h2>Dependencies</h2>
    <p>Below is a list of all the dependencies required.</p>
    <ul>
    <li>express-validator</li>
    <li>jsonwebtoken</li>
    <li>lodash</li>
    <li>method-override</li>
    <li>mongoose</li>
    <li>morgan</li>
    <li>passport</li>
    <li>passport-jwt</li>
    <li>passport-local</li>
    <li>body-parser</li>
    <li>cors</li>
    </ul>
    <h2>API Endpoints</h2>
    <div class="table-wrapper">
      <table class="methods-table">
        <thead>
          <th>Request</th>
          <th>HTTP Method</th>
          <th>URL</th>
          <th>Request Format</ht>
          <th>Response</th>
        </thead>
        <tbody>
          <tr>
            <td>List all movies to user</td>
            <td>GET</td>
            <td>/movies</td>
            <td>- </td>
            <td>
            {
            .."Title": "Waterworld",
            .."description": "In a future where the polar ice-caps have melted and Earth is almost entirely submerged, a mutated mariner fights starvation and outlaw ..\"smokers,\" and reluctantly helps a woman and a young girl try to find dry land.",
            .."genre": "609eab2d182950cee2ca2381",
            .."director": "609eb15a182950cee2ca2389",
            .."_id": "609ec668182950cee2ca2392",
            .."imageUrl": "waterworld.png",
            .."featured": false
            }
            </td>
          </tr>
          <tr>
            <td>Return available data about specific movie</td>
            <td>GET</td>
            <td>/movies/[movie title] <br />e.g /movies/The%20Matrix</td>
            <td>- </td>
            <td>
            {
              .."Title": "The Matrix",
              .."description": "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
              .."genre": "609eab2d182950cee2ca2382",
              .."director": "609eb15a182950cee2ca2387",
              .."Actors": [],
              .."_id": "609ec5f1182950cee2ca238f",
              .."imageUrl": "matrix.png",
              .."featured": true
            }
            </td>
          </tr>
          <tr>
            <td>Return Directors Bio</td>
            <td>GET</td>
            <td>- </td>
            <td>/directors/[directors name]</td>
            <td>
            {
              .."_id": "609eb15a182950cee2ca2384",
              .."name": "Jonathan Demme",
              .."bio": "Robert Jonathan Demme was an American director, producer, and screenwriter.",
              .."birthyear": "1944-01-01",
              .."deathyear": "2017-01-01"
            }
            </td>
          </tr>
          <tr>
            <td>Sign up a new user</td>
            <td>POST</td>
            <td>/users</td>
            <td>{
              Username: String, required,
              Password: String, required,
              Email: String, required,
              Birthday: Date (YYYY-MM-DD)
            }</td>
            <td>-
            </td>
          </tr>
          <tr>
            <td>User login</td>
            <td>/</td>
            <td>/login</td>
            <td>- </td>
            <td>User can login to their account</td>
          </tr>
          <tr>
            <td>View users info</td>
            <td>GET</td>
            <td>- </td>
            <td>/users/[username]</td>
            <td>
            {
              "_id": "609ed5ca182950cee2ca2398",
              "Username": "William",
              "Password": (hashed password),
              "Birthday": "1991-06-10T00:00:00.000Z",
              "Email": "william@email.com",
              "Favorites": [
                  "609ec7d4182950cee2ca2394",
                  "609ec5bd182950cee2ca238d",
                  "609ec5f1182950cee2ca238f",
                  "609ec5f1182950cee2ca2390"
              ],
              }
              </td>
          </tr>
          <tr>
            <td>Delete account</td>
            <td>REMOVE</td>
            <td>/users/[username]</td>
            <td>- </td>
            <td>USER was deleted</td>
          </tr>
          <tr>
            <td>Update a users info</td>
            <td>PUT</td>
            <td>/users/[user-name]</td>
            <td>{
              Username: String, required,
              Password: String, required,
              Email: String, required,
              Birthday: Date (YYYY-MM-DD)
            }
            </td>
            <td>- </td>
          </tr>
          <tr>
            <td>Add to favorites</td>
            <td>POST</td>
            <td>/users/[username]/Movies/[MovieID]</td>
            <td>- </td>
            <td>- </td>
          </tr>
          <tr>
            <td>Remove from Favorites</td>
            <td>DELETE</td>
            <td>/users/[username]/Movies/remove/[MovieID]</td>
            <td>- </td>
            <td>- </td>
          </tr>
        </tbody>
      </table>
    </div>
    <h2>Screenshots for Endpoints</h2>
    <h3>/movies</h3>
    <img src="">
    <h3></h3>
    <img src="">
    <h3></h3>
    <img src="">
    <h3></h3>
    <img src="">
    <h3></h3>
    <img src="">
    <h3></h3>
    <img src="">
    <h3></h3>
    <img src="">
    <h3></h3>
    <img src="">
    <h3></h3>
    <img src="">
    <h3></h3>
    <img src="">
  </body>
  <footer></footer>
</html>