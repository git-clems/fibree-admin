import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AddMission from '../ux/addMission';

const AdminMissions = () => {
  const [missions, setMissions] = useState([]);
  const [deletingIds, setDeletingIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/mission');
        setMissions(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const deleteMissions = async (missionId) => {
    try {
      setDeletingIds((prev) => [...prev, missionId]);

      setTimeout(async () => {
        await axios.delete(`http://localhost:8000/api/mission/${missionId}`);

        setMissions((prevMissions) =>
          prevMissions.filter((mission) => mission._id !== missionId)
        );

        setDeletingIds((prev) => prev.filter((id) => id !== missionId));
      }, 400);
    } catch (error) {
      console.log(error);
      setDeletingIds((prev) => prev.filter((id) => id !== missionId));
    }
  };

  const toggleDisplay = async (missionId, currentValue) => {
    try {
      const updatedValue = !currentValue;

      await axios.put(`http://localhost:8000/api/mission/update/${missionId}`, {
        displayed: updatedValue,
      });

      setMissions((prevMissions) =>
        prevMissions.map((mission) =>
          mission._id === missionId
            ? { ...mission, displayed: updatedValue }
            : mission
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="page">
      {missions.length === 0 ? (
        <>
          <h1 className='ml-3'>Aucune mission disponible</h1>
          <AddMission />
          <table className='table'>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Titre</th>
                <th scope="col">Afficher</th>
                <th scope="col">Editer</th>
                <th scope="col">Supprimer</th>
              </tr>
            </thead>
          </table>
        </>

      ) : (
        <>
          <h1 className='ml-3'>Les missions</h1>
          <AddMission />
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Titre</th>
                <th scope="col">Afficher</th>
                <th scope="col">Editer</th>
                <th scope="col">Supprimer</th>
              </tr>
            </thead>

            <tbody>
              {missions.map((mission, index) => {
                const isDeleting = deletingIds.includes(mission._id);

                return (
                  <tr
                    key={mission._id}
                    className={`transition-all duration-500 ease-in-out ${isDeleting
                      ? 'opacity-0 translate-x-10'
                      : 'opacity-100 translate-x-0'
                      }`}
                  >
                    <th scope="row">{index + 1}</th>

                    <td>
                      <h6>{mission.title}</h6>
                      <p className="text-gray-500 truncate max-w-[40vw]">{mission.description}</p>
                    </td>

                    <td>
                      <input
                        type="checkbox"
                        className="m-2"
                        checked={mission.displayed}
                        onChange={() =>
                          toggleDisplay(mission._id, mission.displayed)
                        }
                      />
                    </td>

                    <td>
                      <Link
                        style={{ borderRadius: 5 }}
                        to={`/admin/mission/${mission._id}`}
                        className="m-2 h-[40px] w-[40px] p-2 flex justify-center items-center bg-green-400 hover:bg-green-300 rounded-1"
                      >
                        <i className="fa-solid fa-pencil"></i>
                      </Link>
                    </td>

                    <td>
                      <button
                        onClick={() => deleteMissions(mission._id)}
                        className="m-2 h-[40px] w-[40px] flex justify-center items-center bg-[red] hover:bg-red-400 rounded-1 text-white"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminMissions;