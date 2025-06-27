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







// ---------------------
// RUTA CON METADATOS DINÁMICOS
// ---------------------
// app.get("/post/:id", async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).send("Post no encontrado");

//     const html = `
//       <!DOCTYPE html>
//       <html lang="es">
//       <head>
//         <meta charset="utf-8" />
//         <title>${post.titulo} | Empatía Digital</title>
//         <meta name="description" content="${post.epigrafe || ""}" />

//         <!-- Open Graph -->
//         <meta property="og:title" content="${post.titulo}" />
//         <meta property="og:description" content="${post.epigrafe || ""}" />
//         <meta property="og:image" content="${post.portada}" />
//         <meta property="og:url" content="https://empatiadigital.com.ar/post/${post._id}" />
//         <meta property="og:type" content="article" />

//         <!-- Twitter Card -->
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta name="twitter:title" content="${post.titulo}" />
//         <meta name="twitter:description" content="${post.epigrafe || ""}" />
//         <meta name="twitter:image" content="${post.portada}" />
//       </head>
//       <body>
//         <script>
//           // Redirige al frontend (React)
//           window.location.href = "https://empatiadigital.com.ar/post/${post._id}";
//         </script>
//       </body>
//       </html>
//     `;

//     res.send(html);
//   } catch (error) {
//     console.error("Error al generar metadatos del post:", error);
//     res.status(500).send("Error del servidor");
//   }
// });

// });


// Conexión a la base de datos
mongoose.connect("mongodb+srv://empatiadigital2025:Gali282016@empatia.k2mcalb.mongodb.net/?retryWrites=true&w=majority&appName=Empatia", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión', err));

// Puerto
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
