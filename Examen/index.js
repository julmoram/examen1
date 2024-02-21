const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 3000;

app.use(express.json());
app.use(morgan('dev'));

// Función para crear cookies
function createCookies(req, res) {
  // Cookie "Cookie 2m"
    res.cookie('Cookie 2m', "Esta es una cookie hola mundo", {
    httpOnly: false, // Permite que la cookie sea manipulada por la petición
    secure: true, // Solo se envía en conexiones HTTPS
    sameSite: 'lax',
    expires: new Date("2024-02-29"),
    });

  // Cookie "InfoNavegador"
    const agent = req.headers['user-agent'];
    res.cookie('InfoNavegador', agent, {
    maxAge: 60000 * 2, // Expira en 2 minutos
    });
}

// Datos de prueba
const data = [
    {
    afirst_name: "Ana Maria",
    last_name: "Arreola",
    email: "abanaria@ejemplo.com",
    country: "Alemania",
    },
    {
    afirst_name: "Ernesto José",
    last_name: "Encino",
    email: "ernestoencino@ejemplo.com",
    country: "Ecuador",
    },
    {
    afirst_name: "Ines",
    last_name: "Iglesias",
    email: "inesinglesias@ejemplo.com",
    country: "Italia",
    },
];

// Colección para almacenar las visitas
const visitas = [];

// Middleware para conteo de visitas
function conteoVisitas(req, res, next) {
  // Obtener la ruta actual
    const rutaActual = req.path;

  // Buscar si la ruta actual ya está en la colección
    const visitaEncontrada = visitas.find(visita => visita.ruta === rutaActual);

  // Si la ruta no está en la colección, agregarla
    if (!visitaEncontrada) {
    visitas.push({ ruta: rutaActual, visitas: 1 });
    } else {
    // Si la ruta ya está en la colección, aumentar el contador de visitas
    visitaEncontrada.visitas++;
    }

  // Invocar la siguiente función en el middleware
    next();
}

// Rutas

// Ruta "/"
app.get("/", (req, res) => {
  // Crear las cookies
    createCookies(req, res);

  // Enviar la información de las visitas en la cookie
    res.cookie("visitas", JSON.stringify(visitas), {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    expires: new Date("2024-02-29"),
    });

  // Enviar un mensaje de bienvenida
    res.send("Hola!");
});

// Registrar el middleware para que se ejecute en todas las rutas
app.use(conteoVisitas);

// Ruta "/data/all"
app.get("/data/all", (req, res) => {
    res.status(200).json(data);
});

// Ruta "/register"
app.post("/register", (req, res) => {
    try {
    const newR = req.body;

    // Validar que no falten campos
    if (!newR.afirst_name || !newR.last_name || !newR.email || !newR.country) {
        res.status(400).json({ message: "Faltan campos en el registro." });
        return;
    }

    // Agregar el nuevo registro a la lista
    data.push(newR);

    // Enviar el nuevo registro como respuesta
    res.status(201).json(newR);
    } catch (error) {
    res.status(500).json({ message: "Error" });
    }
});
app.get("/data", (req, res) => {
    const query_country=req.query.country
    const query_email=req.query.email
    const query_last_name=req.query.last_name
    const query_afirst_name=req.query.afirst_name
    if(query_afirst_name){
        const filtro= data.filter(item=>item.afirst_name==query_afirst_name)
        if(filtro.length>0){
            res.status(200).json(filtro)
        }else{
            res.status(404).json({message:"Noencontrado"})
        }
    }else if(query_last_name){
        const filtro= data.filter(item=>item.last_name==query_last_name)
        if(filtro.length>0){
            res.status(200).json(filtro)
        }else{
            res.status(404).json({message:"Noencontrado"})
        }
    }else if(query_email){
        const filtro= data.filter(item=>item.email==query_email)
        if(filtro.length>0){
            res.status(200).json(filtro)
        }else{
            res.status(404).json({message:"Noencontrado"})
        }
    }else if(query_country){
        const filtro= data.filter(item=>item.country==query_country)
        if(filtro.length>0){
            res.status(200).json(filtro)
        }else{
            res.status(404).json({message:"Noencontrado"})
        }
    }else{
        res.status(301).redirect("/data/all")
    }
});

// Ruta "/query"
app.get('/query', (req, res) => {
  const user = req.query.user; // Obtener el parámetro "user" de la query
  const role = req.query.role; // Obtener el parámetro "role" de la query

  // Validar que el parámetro "user" esté presente
    if (!user) {
    res.status(400).send
    }
});
app.listen(port, () => {
    console.log(`Escuchando puerto `,port);
})