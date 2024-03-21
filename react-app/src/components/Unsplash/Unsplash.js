import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createApi } from 'unsplash-js';
import { getKey } from '../../store/unsplash';

const UnsplashComponent = () => {
  console.log('UnsplashComponent rendered');

  const dispatch = useDispatch();
  const apiKey = useSelector(state => state.unsplash?.key);
  const [images, setImages] = useState([]);


  useEffect(() => {
    console.log('Dispatching getKey action');
    dispatch(getKey());
  }, [dispatch]);


  useEffect(() => {
    console.log('Effect to fetch images, API Key: ', apiKey);
    if (apiKey) {

    }
  }, [apiKey]);


  useEffect(() => {
    if (apiKey) {
      const unsplash = createApi({ accessKey: apiKey });

      unsplash.search.getPhotos({ query: "nature", page: 1, perPage: 10 })
        .then(result => {
          if (result.errors) {
            console.log('error occurred: ', result.errors[0]);
          } else {
            const photo = result.response;
            setImages(photo.results);
          }
        });
    }
  }, [apiKey]);

  console.log('images****', images);

  return (
    <div>
      {images.map(image => (
        <img key={image.id} src={image.urls.small} alt={image.alt_description} />
      ))}
    </div>
  );
};

export default UnsplashComponent;
