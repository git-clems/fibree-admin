import React from 'react'

const CandSpontPage = () => {
    return (
        <div className='page flex justify-center flex-'>
            <div className='max-w-[800px] h-[max-content] min-[800px]:border-1 border-gray-200 rounded-3'>
                <h3 className='m-3 mb-5'>Vous souhaitez faire une demande d'adhésion à la FIBREE spontanement</h3>
                <div className='flex mb-3 justify-between flex-wrap'>
                    <div class="min-w-[300px] m-2 flex-1">
                        <label for="exampleFormControlInput1" class="form-label">Nom</label>
                        <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="" />
                    </div>
                    <div class="min-w-[300px] m-2 flex-1">
                        <label for="exampleFormControlInput1" class="form-label">Prénom(s)</label>
                        <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="" />
                    </div>
                </div>
                <div className='flex mb-3 justify-between flex-wrap'>
                    <div class="min-w-[300px] m-2 flex-1">
                        <label for="exampleFormControlInput1" class="form-label">Email</label>
                        <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="exemple@gmail.com" />
                    </div>
                    <div class="min-w-[300px] m-2 flex-1">
                        <label for="exampleFormControlInput1" class="form-label">Numéro de téléphone</label>
                        <input type="phone" class="form-control" id="exampleFormControlInput1" placeholder="+123 11 22 33 44" />
                    </div>
                </div>
                <div className='flex mb-3 justify-between flex-wrap'>
                    <div class="min-w-[300px] m-2 flex-1">
                        <label for="exampleFormControlInput1" class="form-label">Pays de résidence</label>
                        <input type="select" class="form-control" id="exampleFormControlInput1" placeholder="" />
                    </div>
                    <div class="min-w-[300px] m-2 flex-1">
                        <label for="exampleFormControlInput1" class="form-label">Ville de résidence</label>
                        <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="" />
                    </div>
                </div>
                <div class="min-w-[300px] m-2 flex-1">
                    <label for="exampleFormControlTextarea1" class="form-label">Votre motivation</label>
                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                </div>
            </div>
        </div>
    )
}

export default CandSpontPage
