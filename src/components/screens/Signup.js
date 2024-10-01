import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import M from 'materialize-css';

const SignIn = () => {
    const navigate = useNavigate(); // Use useNavigate instead of useHistory
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const PostData = () => {
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email", classes: "#c62828 red darken-3"})
            return 
        }
        fetch("/signup", { 
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,        
                password: password,
                email: email,
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                M.toast({html: data.error, classes: "#c62828 red darken-3"});
            } else {
                M.toast({html: data.message, classes: "#43a047 green darken-1"});
                navigate('/signin'); // Use navigate to redirect the user
            }
        })
        .catch(err => {
            console.error(err);
        });
   
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
                    type='password' // Changed to 'password' type for security
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={PostData}
                >
                    SignUp
                </button>    
                <h5>
                    <Link to="/Signin">Already have an account?</Link>
                </h5>
            </div>
        </div>
    );
}

export default SignIn;
