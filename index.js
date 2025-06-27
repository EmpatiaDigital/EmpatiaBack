const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const sociosRoutes =  require('./routes/authSocios')
const changePassword =  require('./routes/changePassword')
const postRoutes = require('./routes/postRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const routesActividades = require('./routes/routesActividades');
const activeRoutes = require('./routes/activeRoutes');
const descargaRoutes = require('./routes/descargaRoutes');
const testRoute = require('./routes/testRoute');
const path = require("path");
const userActividadRoutes = require('./routes/userActividad');
// Tu modelo Post
const Post = require("./models/Post");
// Usamos las rutas
dotenv.config();
const app = express();


// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/descargas", express.static(path.join(__dirname, "public/descargas")));
// Rutas
app.use('/api/test', testRoute); //esta es la ruta para test
app.use('/api', changePassword);
app.use('/api/auth', authRoutes);
app.use('/api',sociosRoutes);
app.use('/api',postRoutes);
app.use('/api', uploadRoutes);
app.use('/api', activeRoutes);
app.use('/api/actividades', routesActividades);
app.use('/api/descarga', descargaRoutes);
app.use('/api', userActividadRoutes);



// Conexión a la base de datos
mongoose.connect("mongodb+srv://empatiadigital2025:Gali282016@empatia.k2mcalb.mongodb.net/?retryWrites=true&w=majority&appName=Empatia", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión', err));

// -----------------------------
// RUTA ESPECIAL PARA METADATOS (LINK PREVIEW)
// -----------------------------
app.get("/post/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("No encontrado");

  const html = `
    <html>
    <head>
      <meta property="og:title" content="${post.titulo}" />
      <meta property="og:image" content="${post.portada}" />
      <meta property="og:description" content="${post.epigrafe || ""}" />
      <meta property="og:url" content="https://www.empatiadigital.com.ar/post/${post._id}" />
      <!-- más metas -->
    </head>
    <body>
      <script>
        window.location.href = "/post/${post._id}";
      </script>
    </body>
    </html>
  `;
  res.send(html);
});


// Puerto
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
