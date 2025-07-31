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
mongoose.connect("mongodb+srv://empatiadigital2025:empatiadigital2025@empatia1.s1i7isu.mongodb.net/?retryWrites=true&w=majority&appName=Empatia1", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión', err));

// -----------------------------
// RUTA ESPECIAL PARA METADATOS (LINK PREVIEW)
// -----------------------------
// BACKEND: Modificar tu endpoint existente
app.get("/preview/post/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post no encontrado");
    
    const frontendUrl = `https://empatia-front.vercel.app/post/${post._id}`;
    const userAgent = req.get('User-Agent') || '';
    
    // Detectar si es un bot de redes sociales
    const isSocialBot = /WhatsApp|facebookexternalhit|Twitterbot|LinkedInBot|SkypeUriPreview|TelegramBot/i.test(userAgent);
    
    if (isSocialBot) {
      // Servir metadatos para bots
      const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <title>${post.titulo} - Empatía Digital</title>
          <meta name="description" content="${post.epigrafe || post.titulo}" />
          
          <!-- Open Graph -->
          <meta property="og:title" content="${post.titulo}" />
          <meta property="og:description" content="${post.epigrafe || post.titulo}" />
          <meta property="og:image" content="${post.portada}" />
          <meta property="og:url" content="${frontendUrl}" />
          <meta property="og:type" content="article" />
          <meta property="og:site_name" content="Empatía Digital" />
          
          <!-- Twitter Card -->
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${post.titulo}" />
          <meta name="twitter:description" content="${post.epigrafe || post.titulo}" />
          <meta name="twitter:image" content="${post.portada}" />
          
          <!-- Redirección inmediata para usuarios reales -->
          <script>
            // Solo redirigir si no es un bot
            if (!/bot|crawler|spider|crawling|facebook|twitter|whatsapp/i.test(navigator.userAgent)) {
              window.location.href = "${frontendUrl}";
            }
          </script>
          
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
            .loading { animation: pulse 1.5s infinite; }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
            img { max-width: 100%; border-radius: 8px; margin-bottom: 20px; }
            .btn { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="loading">
            <img src="${post.portada}" alt="${post.titulo}" />
            <h1>${post.titulo}</h1>
            <p>${post.epigrafe || ''}</p>
            <p>Redirigiendo a Empatía Digital...</p>
            <a href="${frontendUrl}" class="btn">Ir a Empatía Digital</a>
          </div>
        </body>
        </html>
      `;
      res.setHeader('Content-Type', 'text/html');
      return res.send(html);
    } else {
      // Redirección directa para usuarios reales
      return res.redirect(302, frontendUrl);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error del servidor");
  }
});




// Puerto
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
