import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import ToggleBar from "./ToggleBar";
import Map from "./all-activities-map";
import Search from "./all-activities-search";
import FilterBar from "./filterBar";
import { CurrentUserLocation } from "../all-contexts/currentLocationContext";

// This the homepage, it navegates between a map, and regular homefeed


const Home = () => {
    // Get current user location, and getDistance function
    // These helpers are used to calculate the activity distance
    // from current user location
    const { currentLocation, getDistance } = useContext(CurrentUserLocation);

    // A state variable to control the toggle bar
    const [ displayedPage, setDisplayedPage ] = useState(1);
    // A state variable to store the posts data
    const [ postsData, setPostsData ] = useState([]);
    // A state variable to control the loading screen
    const [ postDataStatus, setPostDataStatus ] = useState('loading');

    const [ sportType, setSportType ] = useState('All');
    const [ sportLevel, setSportLevel ] = useState('All');

    useEffect(()=>{
        setPostDataStatus('loading');

        // get the data of all posts in the system
        fetch(`/posts?activityType=${sportType}&level=${sportLevel}`)
        .then(res=> res.json())
        .then(data => {
            setPostsData(data.posts); // Store all posts data in postsData state variable
            setPostDataStatus('idle');
        })
    },[sportType, sportLevel])

    // Add distance from current location for each post
    const updatePostsData = postsData.map( (post) => {
        const newPost = { ...post, distance: getDistance(currentLocation, post.activityAddress.coordinates ) };
        return newPost
    })

    // Sort the posts based on distance from current location
    const sortedPostsData = updatePostsData.sort( (a,b) => a.distance - b.distance);



    return(
        <Wrapper>
            <ToggleBar setDisplayedPage = { setDisplayedPage }/>
            <FilterBar sportType = { sportType } setSportType = { setSportType } sportLevel ={ sportLevel } setSportLevel={ setSportLevel }/>
            { displayedPage === 1
            ? <Search postsData = { sortedPostsData } postDataStatus ={ postDataStatus } />
            : <Map postsData = { sortedPostsData } postDataStatus ={ postDataStatus } />
            }
        </Wrapper>
    );
}

const Wrapper = styled.div`
width: 100%;
height: 100%;
`;

export default Home