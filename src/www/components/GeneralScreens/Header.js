import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import SearchForm from './SearchForm';
import '../../Css/Header.css'
import { RiPencilFill } from 'react-icons/ri'
import { FaUserEdit } from 'react-icons/fa'
import { BiLogOut } from 'react-icons/bi'
import { BsBookmarks } from 'react-icons/bs'
import SkeletonElement from '../Skeletons/SkeletonElement';
import { AuthContext } from '../../Context/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';

const Header = () => {
    const bool = localStorage.getItem("authToken") ? true : false
    const [auth, setAuth] = useState(bool)
    const { activeUser } = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState(null)
    const navigate = useNavigate()

    useEffect(async () => {
        try {
            let config = {
                method: 'post',
                url: '/auth/private',
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            }

            const { data } = await axios.request(config)
            localStorage.setItem("authToken", data.token);
            setToken(data.token)
            setTimeout(() => {
                navigate("/")
            }, 1800)

        } catch (error) {
            navigate("/unauthorized")
        }
    }, []);


    useEffect(() => {

        setAuth(bool)
        setTimeout(() => {
            setLoading(false)
        }, 1600)

    }, [bool])

    useEffect(() => {
    }, [token])

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        // setTimeout(()=>{
        //     navigate('/?gcp-iap-mode=GCIP_SIGNOUT')
        // },1200)
    };

    return (

        <header>
            <div className="averager">

                <Link to="/" className="logo">
                    <h5>
                        DemoApp
                    </h5>
                </Link>
                <SearchForm />
                <div className='header_options'>
                    {auth ?
                        <div className="auth_options" style={{
                            "display": "flex",
                            "flexDirection": "row",
                            "alignItems": "center"
                        }}>
                            <Link className='addStory-link' to="/addstory"><RiPencilFill /> Write </Link>
                            <Link to="/readList" className='readList-link'>
                                <BsBookmarks />
                                <span id="readListLength">
                                    {activeUser.readListLength}
                                </span>
                            </Link>
                            <div className='header-profile-wrapper '>


                                {loading ?
                                    <SkeletonElement type="minsize-avatar" />
                                    :
                                    <>
                                        <img src="https://cdn-icons-png.flaticon.com/512/5332/5332306.png" alt="Logo" className='logo_header' />
                                    </>
                                }
                                <div className="sub-profile-wrap  ">
                                    <Link className='profile-link' to="/profile"  > <FaUserEdit />  Profile </Link>
                                    <button className='logout-btn' onClick={handleLogout}> <BiLogOut />  Logout</button>
                                </div>
                            </div>


                        </div>

                        :
                        <div className="logout-btn" style={{"textAlign": "center"}}>
                            <a href="/?gcp-iap-mode=GCIP_SIGNOUT" style={{ "fontSize": "1em", "textDecoration": "none" }}>{process.env.USERNAME ? process.env.USERNAME :
                                <>
                                    <button className='logout-btn' style={{"border": "none","background": "none","color": "red","fontSize": "large"}}> <BiLogOut />Login</button>
                                    <br />
                                    <>Unauthorized</>
                                </>
                            }</a>
                        </div>

                    }
                </div>

            </div>

        </header>

    )
}

export default Header;
