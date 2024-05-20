import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Crea() {
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("movie"); // Inicializa con una de las opciones
  const [descripcion, setDescripcion] = useState("");
  const [poster, setPoster] = useState(null);
  const [posterURL, setPosterURL] = useState("");
  const navigate = useNavigate();
  const audiovisualesCollection = collection(db, "audiovisuales");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setPoster(file);
  };

  const store = async (e) => {
    e.preventDefault();
    if (poster) {
      const storage = getStorage();
      const storageRef = ref(storage, `posters/${poster.name}`);
      await uploadBytes(storageRef, poster);
      const downloadURL = await getDownloadURL(storageRef);
      setPosterURL(downloadURL);

      // Agregar el documento solo después de obtener el URL de la imagen
      await addDoc(audiovisualesCollection, {
        titulo: titulo,
        descripcion: descripcion,
        tipo: tipo,
        poster: downloadURL
      });
      navigate("/");
    } else {
      alert("Por favor selecciona una imagen.");
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1>Agregar Audiovisual</h1>
          <form onSubmit={store}>
            <div className="mb-3">
              <label className="form-label">Título</label>
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                type="text"
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="form-control"
                required
              >
                <option value="movie">Película</option>
                <option value="series">Serie</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="form-control"
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Poster</label>
              <input
                onChange={handleFileChange}
                type="file"
                className="form-control"
                accept="image/*"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Agregar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Crea;
