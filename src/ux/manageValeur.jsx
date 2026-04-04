import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const ManageValeur = () => {
    const [mission_value, setMission_value] = useState({
        description: '',
        image: null,
    });

    const [id, setId] = useState(null)

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);

    useEffect(() => {
        const fetchCurrentData = async () => {
            try {
                setLoadingData(true);

                const response = await axios.get('http://localhost:8000/api/about');

                setId(response.data[0]._id)

                setMission_value({
                    description: response.data.description || '',
                    image: null,
                });
            } catch (error) {
                console.log(error);
            } finally {
                setLoadingData(false);
            }
        };
        fetchCurrentData();
    }, []);

    const inputHandler = (e) => {
        const { name, value } = e.target;
        setMission_value((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const fileHandler = (e) => {
        const file = e.target.files?.[0] || null;
        setMission_value((prev) => ({
            ...prev,
            image: file,
        }));
    };
    console.log(id);

    const SubmitForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const formData = new FormData();
            formData.append('description', mission_value.description);

            if (mission_value.image) {
                formData.append('image', mission_value.image);
            }


            await axios.put(`http://localhost:8000/api/about/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage('Modification avec succès !');

            const modalElement = document.getElementById('staticBackdrop');
            const modal = window.bootstrap?.Modal.getInstance(modalElement);

            if (modal) {
                modal.hide();
            }

            document.body.classList.remove('modal-open');
            document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
        } catch (e) {
            console.log(e);
            setMessage("Une erreur s'est produite !!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
            >
                <i className="fa-solid fa-pencil"></i>
            </button>

            <div
                className="modal fade"
                id="staticBackdrop"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex="-1"
                aria-labelledby="staticBackdropLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={SubmitForm}>
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="staticBackdropLabel">
                                    Modifier
                                </h1>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>

                            <div className="modal-body max-h-[70vh] overflow-auto">
                                {loadingData ? (
                                    <p>Chargement des données...</p>
                                ) : (
                                    <>
                                        <div className="mb-3">
                                            <label htmlFor="description" className="form-label">
                                                Qu'est-ce que la FIBREE ?
                                            </label>
                                            <textarea
                                                className="form-control"
                                                required
                                                name="description"
                                                onChange={inputHandler}
                                                id="description"
                                                rows="5"
                                                value={mission_value.description}
                                            ></textarea>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="image" className="form-label">
                                                Ajouter une image d'illustration
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="form-control"
                                                id="image"
                                                onChange={fileHandler}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading || loadingData}
                                >
                                    {loading ? 'Chargement...' : 'Enregistrer'}
                                </button>
                            </div>

                            <div className={`text-center ${message.includes('succès') ? 'text-green-500' : 'text-red-500'}`}>
                                <span>{message}</span>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default ManageValeur;