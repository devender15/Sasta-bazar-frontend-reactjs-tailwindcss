import React, { useState, useEffect } from 'react';
import { fetchUser } from "../utils/fetchUser";
import { TextField } from "@material-ui/core";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';



const ChangePassword = () => {
    
    const userToken = fetchUser();
    const [oldPass, setOldPass] = useState("");
    const [newPass1, setNewPass1] = useState("");
    const [newPass2, setNewPass2] = useState("");
    const [userDetails, setUserDetails] = useState({});
    
    const navigate = useNavigate();

    document.title = "Change account password | My Shop";

    const toastMessage = (type, message) => {
        toast(message, {
          type: type === "error" ? "error" : "success",
          theme: "colored",
          position: "top-center",
          autoClose: 2000,
        });
      };
      
      useEffect(() => {
        const fetchUserData = async () => {
          try {
            const headers = {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            };
    
            const resp = await axios.get(
              `${process.env.REACT_APP_API_URL}/user-auth/get-user`,
              { headers: headers }
            );
            setUserDetails(resp.data);
          } catch (err) {
            localStorage.removeItem("user");
          }
        };
    
        fetchUserData();
        // eslint-disable-next-line
      }, []);


    // console.log(user);
    const updatePassword = () => {
        if(oldPass.length === 0 || newPass1.length === 0 || newPass2.length === 0) {
            toastMessage("error", "Please fill all the details !")
        }
        else {
            if(newPass1 === newPass2) {
                fetch(`${process.env.REACT_APP_API_URL}/user-auth/change-password`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + userToken
                    },
                    body: JSON.stringify({
                        userId: userDetails?.id,
                        oldPass,
                        newPass1
                    })
                })
                .then(response => response.json())
                .then(data => {
                    toastMessage(data.status, data.msg);
                    setOldPass("");
                    setNewPass1("");
                    setNewPass2("");
                })
            }
            else {
                toastMessage("error", "Make sure that your new password is correct!")
            }
        }
    }

    return (
        <div className='flex flex-col justify-center items-center'>
            <div className='flex items-center justify-start w-full'>
                <BsFillArrowLeftCircleFill fontSize={30} className='hover:cursor-pointer ml-6' onClick={() => navigate(`/user-profile/${UserProfile?.fname}`)} />
                <h1 className='font-bold my-5 text-2xl ml-[30vw]'>Change password</h1>
            </div>
            {userToken ? (
                <div className='flex flex-col w-[85vw] h-[55vh] mt-10 rounded-md shadow-lg space-y-8 p-10 md:w-[30vw] justify-center '>
                    <TextField
                        id="outlined-basic"
                        label="Old Password"
                        varient="outlined"
                        value={oldPass}
                        onChange={(e) => setOldPass(e.target.value)}
                        type="password"
                    />

                    <TextField
                        id="outlined-basic"
                        label="New Password"
                        varient="outlined"
                        value={newPass1}
                        onChange={(e) => setNewPass1(e.target.value)}
                        type="password"
                    />

                    <TextField
                        id="outlined-basic"
                        label="Confirm New Password"
                        varient="outlined"
                        value={newPass2}
                        onChange={(e) => setNewPass2(e.target.value)}
                        type="password"
                    />

                    <button
                    className="bg-yellow-400 font-bold text-black p-3 rounded-md shadow-sm"
                    onClick={updatePassword}
                    >
                        Change password
                    </button>
                </div>
            ) : (
                <p>404</p>
            )}
            <ToastContainer />
        </div>
    )
}

export default ChangePassword;