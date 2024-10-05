import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import M from 'materialize-css';

const SignIn = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");

    const uploadpic = () => {
        return new Promise((resolve, reject) => {
            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset", "insta-clone");
            data.append("cloud_name", "adejoh");

            fetch("https://api.cloudinary.com/v1_1/adejoh/image/upload", {
                method: "post",
                body: data
            })
            .then(res => res.json())
            .then(data => {
                setUrl(data.url);
                resolve();
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
        });
    };

    const uploadFields = useCallback(() => {
        console.log(email); // Debugging line

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            M.toast({ html: "invalid email", classes: "#c62828 red darken-3" });
            return;
        }

        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                password,
                email,
                pic: url
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                M.toast({ html: data.error, classes: "#c62828 red darken-3" });
            } else {
                M.toast({ html: data.message, classes: "#43a047 green darken-1" });
                navigate('/signin');
            }
        })
        .catch(err => {
            console.error(err);
        });
    }, [email, name, password, url, navigate]);

    useEffect(() => {
        if (url) {
            uploadFields();
        }
    }, [url, uploadFields]);

    const PostData = () => {
        if (image) {
            uploadpic().then(() => uploadFields());
        } else {
            uploadFields();
        }
    };

    return (
        <div className='mycard'>
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input
                    type='text'
                    placeholder='Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type='text'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="file-field input-field">
                    <div className="btn #64b5f6 blue lighten-2">
                        <span>Upload pic</span>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={PostData}>
                    SignUp
                </button>    
                <h5>
                    <Link to="/Signin">Already have an account?</Link>
                </h5>
            </div>
        </div>
    );
};

export default SignIn;
