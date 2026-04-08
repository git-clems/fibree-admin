import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'


const AdminMembers = () => {
  const [members, setMembers] = useState([])

  useEffect(() => {
    const fectData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/member')
        setMembers(response.data)
      } catch (error) {
        console.log(error);
      }
    };
    fectData();
  }, [])

  return (
    <div className='page'>
      {
        members &&
        <>
        <h4 className='m-3'>{members.length} membres de la FIBREE</h4>
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
              {members.map((member, index) => (
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>
                    {member.fname} {member.lname}
                  </td>
                  <td>
                    {member.city}, {member.country}
                  </td>
                  <td>
                    <Link style={{ borderRadius: 5 }} to={`/admin/nouveau-membre/${member._id}`} className="m-2 h-[25px] w-[25px] p-1 flex justify-center items-center bg-green-400 hover:bg-green-300 rouded-1 ">
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

export default AdminMembers