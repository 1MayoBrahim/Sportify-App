export const addLoginSession = (currentUser) => {
  fetch("/add-login-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(currentUser),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === 200) {
        return data.result;
      } else {
        return data.result;
      }
    });
};

export const deleteLoginSession = () => {
  fetch("/delete-login-session", {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === 200) {
        console.log(data.message);
      } else {
        console.log(data.message);
      }
    });
};
