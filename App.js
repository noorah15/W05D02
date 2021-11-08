const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(express.json());

//1- return all movies
app.get("/movies", (req, res) => {
  fs.readFile("./movies.json", (err, data) => {
    let movies = JSON.parse(data.toString());

    let allMovies = [];

    for (let i = 0; i < movies.length; i++) {
      if (movies[i].isdelete === false) allMovies.push(movies[i]);
    }

    if (allMovies.length !== 0) res.status(200).json(allMovies);
    else res.status(200).send("Not found");
  });
});

//2-Search movies by id
app.get("/movie", (req, res) => {
  const id = req.query.id;

  fs.readFile("./movies.json", (err, data) => {
    let movies = JSON.parse(data.toString());
    let findElm = movies.find((item) => {
      return item.id === Number(id);
    });

    if (findElm) res.status(200).json(findElm);
    else res.status(200).send("Not found");
  });
});

function addToMovies(movies) {
  fs.writeFile("./movies.json", JSON.stringify(movies), () => {
    console.log("Successful adding");
  });
}

//3-Create new movies
app.post("/create", (req, res) => {
  let newItemMovies = req.body;

  fs.readFile("./movies.json", (err, data) => {
    let newMovies = JSON.parse(data.toString());
    newMovies.push({
      id: newMovies.length + 1,
      ...newItemMovies,
      isdelete: false,
    });

    addToMovies(newMovies);
    res.status(200).json(newMovies);
  });
});

//4-Update Movies by id isfav or not
app.put("/update", (req, res) => {
  let updateItemMovies = req.body;

  fs.readFile("./movies.json", (err, data) => {
    let movies = JSON.parse(data.toString());
    let updatedMovies = movies.map((item) => {
      if (item.id === updateItemMovies.id) {
        item.isfav = updateItemMovies.isfav;
      }

      return item;
    });

    addToMovies(updatedMovies);
    res.status(200).json(updatedMovies);
  });
});

//5- show all fav

app.get("/allFav", (req, res) => {
  fs.readFile("./movies.json", (err, data) => {
    let movies = JSON.parse(data.toString());
    let favMovies = [];
    for (let i = 0; i < movies.length; i++) {
      if (movies[i].isfav === true) favMovies.push(movies[i]);
    }

    if (favMovies.length !== 0) res.status(200).json(favMovies);
    else res.status(200).send("Not found");
  });
});

//6- delete movies by id

app.put("/delete", (req, res) => {
  let deleteItemMovies = req.body.id;
  fs.readFile("./movies.json", (err, data) => {
    let movies = JSON.parse(data.toString());
    let updatedMovies = movies.map((item) => {
      if (item.id === deleteItemMovies) {
        item.isdelete = true;
      }

      return item;
    });

    addToMovies(updatedMovies);
    res.status(200).json(updatedMovies);
  });
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} is running.`);
});
