import { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../auth/firebase';

const MyCarousel = () => {
  const interval = 5000;

  const [affiches, setAffiche] = useState()

  useEffect(() => {
    const dataFect = async () => {
      try {
        const response = await getDocs(collection(db, 'carousel'))
        const data = response.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data()
        }))
        setAffiche(data)
      } catch (error) {
        console.log(error);
      }
    };
    dataFect()
  }, [])

  while (!affiches) {
    return (
      <div class="card" aria-hidden="true">
        <img src="..." class="card-img-top" alt="..." />
        <div class="card-body">
          <h5 class="card-title placeholder-glow">
            <span class="placeholder col-6"></span>
          </h5>
          <p class="card-text placeholder-glow">
            <span class="placeholder col-7"></span>
            <span class="placeholder col-4"></span>
            <span class="placeholder col-4"></span>
            <span class="placeholder col-6"></span>
            <span class="placeholder col-8"></span>
          </p>
          <a class="btn btn-primary disabled placeholder col-6" aria-disabled="true"></a>
        </div>
      </div>
    )
  }

  return (
    affiches &&
    < Carousel className="overflow-hidden rounded-md border-2 border-gray-300">
      {affiches.map((affiche) => (
        (affiche.displayed) > 0 &&
        <Carousel.Item interval={interval}>
          <img src={affiche.image} alt="" className="w-full max-[800px]:h-[200px] h-[400px] object-cover overflow-hidden rounded-md" />
          {/* <Carousel.Caption>
            <p className='bg-[rgba(0,0,0,0.5)] rounded-md truncate'>{affiche.title}</p>
          </Carousel.Caption> */}
        </Carousel.Item>))}
    </Carousel >
  );
};

export default MyCarousel;