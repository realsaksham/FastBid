
const addNotificationSelf = async (notifi) => {
    try {
        const searchparams = new URLSearchParams(window.location.search);
        const token = searchparams.get("token");
        const response = await fetch(`http://localhost:3003/api/auth/addNotificationSelf`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "auth-token": token
        },
        body: JSON.stringify({ message: notifi }),
        });
        const json = await response.json();
        console.log(json);

    } catch (error) {
        console.error("Error While Adding Notification" , error)
    }
}

export default addNotificationSelf
