import React, { useState, createContext, useEffect } from "react";

export const CurrentUserLocation = createContext(null);
export const CurrentUserLocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => null
    );
  }, []);

  const getDistance = (pos1, pos2) => {
    // return Math.sqrt( Math.pow(pos1.lat - pos2.lat, 2) + Math.pow(pos1.lng - pos2.lng, 2) );
    // Code source: https://www.geodatasource.com/resources/tutorials/how-to-calculate-the-distance-between-2-locations-using-javascript/
    if (pos1.lat === pos2.lat && pos1.lng === pos2.lng) {
      return 0;
    } else {
      let radlat1 = (Math.PI * pos1.lat) / 180;
      let radlat2 = (Math.PI * pos2.lat) / 180;
      let theta = pos1.lng - pos2.lng;
      let radtheta = (Math.PI * theta) / 180;
      let dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      dist = dist * 1.609344;

      return dist.toFixed(2);
    }
  };

  return (
    <CurrentUserLocation.Provider
      value={{
        currentLocation,
        getDistance,
      }}
    >
      {children}
    </CurrentUserLocation.Provider>
  );
};
