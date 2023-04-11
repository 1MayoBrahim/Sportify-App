import React, { useCallback, useRef, useState, useContext } from "react";
import styled, { keyframes } from "styled-components";
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import mapStyles from "./map-management/mapStyles";
import InfoWindowContent from "./map-management/InfoWindowContent";
import orangeMarker from '../assets/orangeMarker.png';
import currentLocationImg from '../assets/currentLocationImg.png'; 
import CurrentLocationButton from "./map-management/currentLocation";
import { CurrentUserLocation } from "../all-contexts/currentLocationContext";

const Map = ({ postsData, postDataStatus }) => {

    const [selected, setSelected] = useState(null);
    const { currentLocation } = useContext(CurrentUserLocation);

    // import the places libraries
    const libraries = ["places"];

    // To avoid map re-rendering
    const mapRef = useRef();
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    // PanTo function that takes the user to the provided location in the map
    // e.g: if you pass lat,and lng to panTo, the map will take you to that location
    const panTo = useCallback( ({ lat, lng })=>{
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(11);
    },[])

    // Apply some styles to the map
    const options = {
        styles: mapStyles,
        disableDefaultUI: true,
        zoomControl: true,
    };

    // Set the width and height of the map component
    const mapContainerStyle = {
        width: "100%",
        height: "100%",
    };

    // Specify the center of the map when the map loads
    const center = currentLocation;

    

    // Provide the api key for using Google maps and  libraries
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
        libraries,

    });

    if (loadError) return <div>Error loading Maps</div>;
    if (!isLoaded) return <div>Loading Maps</div>;

    return (
        <Wrapper>
            <Title>Sportify App</Title>
            <CurrentLocationButton panTo = { panTo }/>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={11}
                center={center}
                options={options}
                onLoad={onMapLoad}
            >
                {postDataStatus !== "loading" && (
                    <>
                        <Marker
                                    key={Math.random()*10000}
                                    position={currentLocation}
                                    icon = {{
                                        url: currentLocationImg,
                                        scaledSize: new window.google.maps.Size(35,35)
                                    }}
                        />
                        
                        {postsData.map((post) => {
                            return (
                                <Marker
                                    key={post._id}
                                    position={{
                                        lat: post.activityAddress.coordinates?.lat,
                                        lng: post.activityAddress.coordinates?.lng,
                                    }}
                                    icon = {{
                                        url: orangeMarker,
                                        scaledSize: new window.google.maps.Size(35,50)
                                    }}
                                    onClick={() => {
                                        setSelected(post);
                                    }}
                                    animation={window.google.maps.Animation.DROP}
                                />
                            );
                        })}
                    </>
                )}

                {selected ?
                    <InfoWindow 
                        position={{
                            lat: selected.activityAddress.coordinates?.lat,
                            lng: selected.activityAddress.coordinates?.lng,
                        }}
                        onCloseClick = {()=> setSelected(null)}
                    >
                        <InfoWindowContent selected= {selected} />
                    </InfoWindow>
                : 
                    null
                }
            </GoogleMap>
        </Wrapper>
    );
};

const PuffInCenter = keyframes`
    0% {
        -webkit-transform: scale(2);
                transform: scale(2);
        -webkit-filter: blur(4px);
                filter: blur(4px);
        opacity: 0;
    }
    100% {
        -webkit-transform: scale(1);
                transform: scale(1);
        -webkit-filter: blur(0px);
                filter: blur(0px);
        opacity: 1;
    }
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: calc( 100% - 50px - 40px );
  animation: ${PuffInCenter} 0.4s both;
`;

const Title = styled.h1`
  position: absolute;
  padding: 10px;
  font-size: 1.3em;
  margin: 5px;
  z-index: 5;
  color: #293241;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
`;

export default Map;
