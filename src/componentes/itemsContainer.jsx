import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage"; // Importar deleteObject de Firebase Storage
import { db, storage } from "../firebase/config"; // Asegúrate de importar storage también
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link } from "react-router-dom";

const MySwal = withReactContent(Swal);

function ItemsContainer() {
  const [audiovisuales, setAudiovisuales] = useState([]);
  const [filter, setFilter] = useState(''); // Estado para almacenar el tipo de filtro

  const audiovisualesColeccion = collection(db, "audiovisuales");

  const getAudiovisuales = async () => {
    const data = await getDocs(audiovisualesColeccion);
    setAudiovisuales(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const deleteAudiovisual = async (id, posterURL) => {
    const audiovisualDoc = doc(db, "audiovisuales", id);
    await deleteDoc(audiovisualDoc);

    if (posterURL) {
      const posterRef = ref(storage, posterURL); // Crear referencia al archivo en Storage
      deleteObject(posterRef).catch((error) => {
        console.error("Error al eliminar el archivo de Storage", error);
      });
    }
    getAudiovisuales();
  };

  const confirmDelete = (id, posterURL) => {
    MySwal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, bórralo!"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAudiovisual(id, posterURL);
        MySwal.fire("¡Eliminado!", "El elemento ha sido eliminado.", "success");
      }
    });
  };

  useEffect(() => {
    getAudiovisuales();
  }, []);

  // Filtrar los audiovisuales según el estado de filtro
  const filteredAudiovisuales = filter 
    ? audiovisuales.filter(audiovisual => audiovisual.tipo === filter)
    : audiovisuales;

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="d-grid d-grid-gap-2 mb-3">
            <button className="btn btn-secondary" onClick={() => setFilter('movie')}>Filtrar Películas</button>
            <button className="btn btn-secondary" onClick={() => setFilter('series')}>Filtrar Series</button>
            <button className="btn btn-secondary" onClick={() => setFilter('')}>Mostrar Todos</button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Tipo</th>
                <th>Poster</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAudiovisuales.map((audiovisual) => (
                <tr key={audiovisual.id}>
                  <td>{audiovisual.titulo}</td>
                  <td>{audiovisual.tipo}</td>
                  <td><img src={audiovisual.poster.startsWith('/') ? audiovisual.poster.substring(1) : audiovisual.poster} alt="poster" style={{ width: '100px' }} /></td>
                  <td>{audiovisual.descripcion}</td>
                  <td className="table-acciones">
                    <Link to={`/editar/${audiovisual.id}`} className="btn btn-edit">Editar</Link>
                    <button onClick={() => confirmDelete(audiovisual.id, audiovisual.poster)} className="btn btn-danger">Borrar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-grid gap-2 mb-3">
            <Link to="/crear" className="btn btn-create">Crear</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemsContainer;
