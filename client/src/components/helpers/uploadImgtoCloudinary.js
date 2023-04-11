const uploadImageToCloudinary = (userImage, handleInputChange) => {
  const data = new FormData();
  data.append("file", userImage);
  data.append("upload_preset", "chat-plateform");
  data.append("cloud_name", "sportify-app");
  fetch("https://api.cloudinary.com/v1_1/sportify-app/image/upload", {
    method: "POST",
    body: data,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data.url);
      handleInputChange("imgSrc", data.url);
    })
    .catch((err) => console.log(err));
};

export default uploadImageToCloudinary;
