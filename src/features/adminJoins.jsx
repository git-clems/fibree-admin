import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'


const AdminJoins = () => {
  const [joins, setJoins] = useState([])

  useEffect(() => {
    const fectData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/join')
        setJoins(response.data)
      } catch (error) {
        console.log(error);
      }
    };
    fectData();
  }, [])

  return (
    <div className='page'>
      {
        joins &&
        <>
        <h4 className='m-3'>{joins.length} demandes d'adhésion en attente</h4>
          {<table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nom complet</th>
                <th scope="col">Addresse</th>
                <th scope="col">Voir</th>
              </tr>
            </thead>
            <tbody>
              {joins.map((join, index) => (
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>
                    {join.fname} {join.lname}
                  </td>
                  <td>
                    {join.city}, {join.country}
                  </td>
                  <td>
                    <Link style={{ borderRadius: 5 }} to={`/admin/nouveau-membre/${join._id}`} className="m-2 h-[25px] w-[25px] p-1 flex justify-center items-center bg-green-400 hover:bg-green-300 rouded-1 ">
                      <i class="fa-solid fa-eye text-white"></i>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>}
        </>
      }
    </div>
  )
}

export default AdminJoins