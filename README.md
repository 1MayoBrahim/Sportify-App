# Sportify
Sportify is a full-stack web application that allows users to find and join nearby sports activities. With Sportify, users can create sports activities like basketball, soccer, tennis, and invite other users to join their activity. The app also has a real-time chat system using Socket.io, so users can communicate and coordinate with each other about the activity. A mapping API is integrated to show activity locations on a map.

# Features
User authentication and registration: Users can create an account and log in using their email accounts. Passwords are hashed using bcrypt.
Activity creation and joining: Users can create sports activities and invite other users to join them. Users can also search for nearby activities and join them.
Activity tracking: Users can track their sports activities and share their progress with others.
Social features: Users can follow other users, like and comment on their posts, and send them messages.
Real-time chat: Users can communicate with each other in real-time using Socket.io.
# Technology Stack
Front-end: React, React Router, styled-components
Back-end: NodeJS, Express, MongoDB
Real-time communication: Socket.io
Password hashing: bcrypt
Deployment: Heroku or Netlify
APIs and Packages Used
Google Maps API: To integrate a mapping API that shows activity locations on a map.
Geolocation: To use the current location to show nearby activities on the map.
Stretch Goals
Admin panel: Admins can manage user accounts, activities, and content on the platform.
Add activity recommendations based on user location and interests.
Add notifications for invite responses, activity updates, etc.
Add location tracking to show activity participants on the map in real-time.
Search: Users can search for activities by sport, location, date, time, etc.
Chat API: To enhance the real-time chat system.
# Installation
 Clone this repository.
# The Frontend (website):
Open a terminal.
Navigate to the client folder by typing cd client.
Install the dependencies with yarn install.
Boot React with yarn start.
# The Backend (server):
Open a new terminal (you can use a split terminal if you want).
Navigate to the server folder by typing cd server.
Install the dependencies with yarn install.
Boot the server with yarn start:server.
After following these steps, you should have 2 terminals. One should be running React, and the other should be running the server.
Create a .env file in the root folder and add the following environment variables:
makefile
# Copy code
REACT_APP_API_BASE_URL=<your API base URL>
REACT_APP_GOOGLE_MAPS_API_KEY=<your Google Maps API key>

# Deployment
To deploy Sportify, you can use either Heroku or Netlify. You need to set the same environment variables as mentioned above in the deployment platform.

# Conclusion
Sportify is a social platform that brings sports enthusiasts together. It offers many features and uses modern web development technologies to provide an excellent user experience. With its stretch goals, Sportify has the potential to be an even more robust social platform for sports enthusiasts.

Acknowledgments
Socket.io
bcrypt
Google Maps API
