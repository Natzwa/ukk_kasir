const express = require(`express`);
const app = express();
const PORT = 8080;
const cors = require(`cors`);
const bodyparser = require('body-parser')
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))
app.use(cors());

app.use(express.static(__dirname));

let routes = [
  // { prefix: `/auth`, route: require(`./routes/authRoute`) },
  { prefix: `/user`, route: require(`./routes/userRoute`) },
  { prefix: `/menu`, route: require(`./routes/menuRoute`) },
  { prefix: `/meja`, route: require(`./routes/mejaRoute`) },
  { prefix: `/transaksi`, route: require(`./routes/transaksiRoute`) },
];
for (let i = 0; i < routes.length; i++) {
  app.use(routes[i].prefix, routes[i].route);
}

app.listen(PORT, () => {
  console.log(`Server run on port ` + PORT);
});