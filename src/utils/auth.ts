export const isLoggedIn = ()=>{
    const tokem = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    return !!tokem && !!userId;
}

export const logout =()=>{
    if(isLoggedIn()){
        console.log("logout")
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        
    }
}