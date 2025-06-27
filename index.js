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
app.get("/preview/post/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post no encontrado");

    const frontendUrl = `https://empatia-front.vercel.app/post/${post.id}`;

    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>${post.titulo}</title>
        <meta name="description" content="${post.epigrafe || ''}" />
        <meta property="og:title" content="${post.titulo}" />
        <meta property="og:description" content="${post.epigrafe || ''}" />
        <meta property="og:image" content="${post.portada}" />
        <meta property="og:url" content="${frontendUrl}" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${post.titulo}" />
        <meta name="twitter:description" content="${post.epigrafe || ''}" />
        <meta name="twitter:image" content="${post.portada}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body { font-family: sans-serif; padding: 2rem; }
          .card { border: 1px solid #ccc; padding: 2rem; border-radius: 12px; max-width: 600px; margin: auto; }
          .card img { max-width: 100%; border-radius: 8px; }
          .card h1 { font-size: 1.5rem; margin-top: 1rem; }
          .card p { font-size: 1rem; color: #444; }
          .card a { display: inline-block; margin-top: 1rem; text-decoration: none; color: white; background: #0077cc; padding: 0.5rem 1rem; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="card">
          <img src="${post.portada}" alt="Imagen del post" />
          <h1>${post.titulo}</h1>
          <p>${post.epigrafe || ''}</p>
          <a href="${frontendUrl}">Leer en Empatía Digital</a>
        </div>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error del servidor");
  }
});



// Puerto
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
