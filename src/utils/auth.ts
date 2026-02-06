export const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    return !!token && !!userId;
};

export const logout = () => {
    if (isLoggedIn()) {
        console.log("logout")
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");

    }
}