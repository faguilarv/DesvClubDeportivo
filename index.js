import express from "express";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const app = express();
const __dirname = import.meta.dirname;

const pathFile = path.join(__dirname, "data/datos.deportes.json");

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/agregar", async (req, res) => {
  const { nombre, precio } = req.query;

  if (!nombre || !precio) {
    return res
      .status(400)
      .json({ ok: false, msg: "Favor completar toda la información" });
  }

  try {
    const data = await readFile(pathFile, "utf8");
    const deportes = JSON.parse(data);
    deportes.push({ nombre, precio });

    await writeFile(pathFile, JSON.stringify(deportes, null, 2));
    return res.json({ mensaje: "Has agregado correctamente el deporte" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, msg: "Has cometido un error intenta nuevamente" });
  }
});

app.get("/deportes", async (req, res) => {
  try {
    const data = await readFile(pathFile, "utf8");
    const deportes = JSON.parse(data);
    return res.json({ deportes });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, msg: "Error no hay deportes registrados" });
  }
});
app.put("/editar", async (req, res) => {
  try {
    const { nombre, precio, newprecio } = req.query;
    console.log(req.query);
    const data = await readFile(pathFile, "utf8");
    let deportes = JSON.parse(data);

    const deporteIndex = deportes.findIndex(
      (item) => item.nombre === nombre && item.precio === precio
    );
    console.log(req.query);
    console.log(deportes);
    console.log(deporteIndex);

    if (deporteIndex === -1) {
      return res
        .status(404)
        .json({ ok: false, Mensaje: "No se encontró el deporte" });
    }
    console.log(deportes[deporteIndex].precio);
    deportes[deporteIndex].precio = newprecio;
    console.log(deportes[deporteIndex].precio);

    await writeFile(pathFile, JSON.stringify(deportes, null, 2));

    console.log(deportes);

    return res.json({ mensaje: "Precio actualizado correctamente", deportes });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: "Error al editar precio" });
  }
});

app.get("/eliminar", async (req, res) => {
  try {
    const { nombre } = req.query;
    console.log(req.query);
    const data = await readFile(pathFile, "utf8");
    let deportes = JSON.parse(data);
    console.log(deportes);
    const deporte = deportes.find((item) => item.nombre === nombre);

    if (!deporte)
      return res
        .status(404)
        .json({ ok: false, msg: "no se encontró el Deporte" });

    const newDeporte = deportes.filter((item) => item !== deporte);

    await writeFile(pathFile, JSON.stringify(newDeporte));
    return res.json(newDeporte);
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, msg: "Error al eliminar deporte" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Conexión exitosa con el Puerto: ${PORT}`);
});
