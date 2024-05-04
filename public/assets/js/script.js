$(document).ready(function () {
  getData();
});
function getData() {
  $("#cuerpo").html("");
  axios.get("/deportes").then((data) => {
    let deportes = data.data.deportes;
    deportes.forEach((d, i) => {
      $("#cuerpo").append(`
            
            <tr>
            <th scope="row">${i + 1}</th>
            <td>${d.nombre}</td>
            <td>${d.precio}</td>
            <td>
              <button class="btn btn-warning" onclick='preEdit("${d.nombre}","${
        d.precio
      }")' data-toggle="modal" data-target="#exampleModal"><i class="fas fa-edit"></i> Editar</button>
              <button class="btn btn-danger" onclick='eliminar("${
                d.nombre
              }")'><i class="fas fa-trash-alt"></i> Eliminar</button>
            </td>
          </tr>
            
            `);
    });
  });
}

function preEdit(nombre, precio, newPrecio) {
  $("#nombreModal").val(nombre);
  $("#precioModal").val(precio);
  $("#newprecioModal").val(newPrecio);
}

function agregar() {
  let nombre = $("#nombre").val();
  let precio = $("#precio").val();
  axios.get(`/agregar?nombre=${nombre}&precio=${precio}`).then((data) => {
    alert("A sido agregado exitosamente : " + nombre);
    getData();
  });
  $("#exampleModal").modal("hide");
}

function edit() {
  let nombre = $("#nombreModal").val();
  let precio = $("#precioModal").val();
  let newPrecio = $("#newprecioModal").val();
  axios
    .put(`/editar?nombre=${nombre}&precio=${precio}&newprecio=${newPrecio}`)
    .then((data) => {
      alert(
        "A sido modificado exitosamente el precio de : " +
          nombre +
          "  valor anterior :" +
          precio +
          "  Nuevo valor : " +
          newPrecio
      );
      getData();
    });
  $("#exampleModal").modal("hide");
}

function eliminar(nombre) {
  axios.get(`/eliminar?nombre=${nombre}`).then((data) => {
    alert("El siguiente deporte a sido eliminado : " + nombre);
    getData();
  });
  $("#exampleModal").modal("hide");
}
