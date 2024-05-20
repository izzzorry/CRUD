import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDoc, updateDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase/config';

function Edita() {
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("movie");
  const [descripcion, setDescripcion] = useState("");
  const [poster, setPoster] = useState(null);
  const [posterURL, setPosterURL] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const update = async (e) => {
    e.preventDefault();
    const audiovisualDoc = doc(db, "audiovisuales", id);

    let finalPosterURL = posterURL;
    if (poster) {
      const storage = getStorage();
      const storageRef = ref(storage, `posters/${poster.name}`);
      await uploadBytes(storageRef, poster);
      finalPosterURL = await getDownloadURL(storageRef);
    }

    await updateDoc(audiovisualDoc, {
      titulo: titulo,
      tipo: tipo,
      descripcion: descripcion,
      poster: finalPosterURL
    });

    navigate("/");
  };

  const getAudiovisualesById = async (id) => {
    const audiovisualDoc = await getDoc(doc(db, "audiovisuales", id));
    if (audiovisualDoc.exists()) {
      const data = audiovisualDoc.data();
      setTitulo(data.titulo);
      setTipo(data.tipo);
      setDescripcion(data.descripcion);
      setPosterURL(data.poster);
    } else {
      console.log("No such document!");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPoster(file);
    }
  };

  useEffect(() => {
    getAudiovisualesById(id);
  }, [id]);

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1>Editar Audiovisual</h1>
          <form onSubmit={update}>
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
              />
              {posterURL && (
                <div>
                  <img src={posterURL} alt="Poster" style={{ width: '100px', marginTop: '10px' }} />
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-primary">
              Actualizar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Edita;
