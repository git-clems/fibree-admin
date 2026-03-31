import { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import axios from 'axios';
import { Link } from 'react-router';

const MyCarousel = () => {
  const interval = 4000;

  const [affiches, setAffiche] = useState([])

  useEffect(() => {
    const dataFect = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/affiche')
        setAffiche(response.data)
      } catch (error) {
        console.log(error);
      }
    };
    dataFect()
  }, [])

  return (
        (affiches && affiches.length > 0) &&
        < Carousel className="overflow-hidden rounded-md border-2 border-gray-300 p-2 bg-[rgba(0,0,0,0.2)]">
          {
            affiches.map((affiche) => (
              (affiche.images.length && affiche.displayed) > 0 &&
              <Carousel.Item interval={interval}>
                <img src={affiche.images[0]} alt="" className="w-full max-[800px]:h-[200px] h-[400px] object-contain rounded-md" />
                <Carousel.Caption>
                  <p className='bg-[rgba(0,0,0,0.5)] rounded-md truncate'>{affiche.title}</p>
                </Carousel.Caption>
              </Carousel.Item>))
          }
        </Carousel >
  );
};

export default MyCarousel;