import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import  {myFirebase} from '../firebase/firebase';
import {signup, signInWithGoogle} from '../firebase/FirebaseLoginUtils'
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBIcon, MDBModalFooter } from 'mdbreact';
import ReCAPTCHA from "react-google-recaptcha";
import { recaptchaKey } from 'keys'


const centerStyle = {
  margin: 'auto',
  width: '50%',
}

class SignUp extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      online: '',
      email: '',
      password: '',
      confpassword: '',
      username:'',
      recaptchaRef: React.createRef(),
    };
    this.onSignup = this.onSignup.bind(this);
    this.handleChange = this.handleChange.bind();
    this.googleLogin = this.googleLogin.bind(this);

  }

  googleLogin = async (e) => {
    e.preventDefault();
    var userid = await signInWithGoogle()
    console.log(userid)
    this.setState({
      online: true,
      uid: userid
    })
  }

  async componentDidMount(){
    myFirebase.auth().onAuthStateChanged(async (user) => {
      if(user){
        this.setState({online: true})
      }else{
        this.setState({online: false})
      }
      
   })
 }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSignup = (e) => {
    e.preventDefault();
    const { email, password, username, confpassword, recaptchaRef } = this.state;
    if (!recaptchaRef.current.getValue()){
      alert("Please fill reCaptcha box.")
      return
    }
    if ( confpassword !== password ){
      alert("Passwords does not match.")
      return;
    }
    signup(e, email, password, username);
    this.props.history.push('/notverified');
  }
  render() {
    const { email, password, username, recaptchaRef } = this.state;
    return (
    <div>
        <title>Login</title>
        <div className='bg-img'>
          <div className='content'>
            <header>Sign Up</header>
            <form onSubmit={(e)=>this.onSignup(e, email, password, username)}>
              <div className='field'>
                <span  className="fas fa-user"></span>
                <input required name="username" onChange={this.handleChange} type='text' placeholder='Username...'></input>
              </div>
              <div className='field space'>
                <span className="far fa-envelope"></span>
                <input required name="email" onChange={this.handleChange} type='email' placeholder='Email...'></input>
              </div>
              <div className='field space'>
                <span className="fas fa-lock">                  
                </span>
                <input required name="password" onChange={this.handleChange} type='password' placeholder='Pasword...'></input>
              </div>
              <div className='field space'>
                <span className="fas fa-lock"></span>
                <input required name="confpassword" onChange={this.handleChange} type='password' placeholder='Confirm Pasword...'></input>
              </div>
              <div className='space'>
                <ReCAPTCHA ref={recaptchaRef} sitekey={recaptchaKey}/>
              </div>
              <div className='field space'>
                <input type='submit' value='Sign Up'></input>
              </div>
              <div className='login'>———————— or ————————</div>
              <div className='pass'>
                <a href='/menu'>Continue as a guest</a>
              </div>
              <div className='pass'>
                Already have an account?  
                <a href="/LoginPage">Log in</a>
              </div>
            </form>
          </div>
        </div>
      </div>);
  }
}
//     return (
//         <MDBContainer>
//             <MDBRow className="mt-2 mb-3 d-flex justify-content-center">
//                 <MDBCol md="4">
//                     <MDBCard>
//                         <div className="header pt-3 blue-gradient">
//                             <MDBRow className="d-flex justify-content-center">
//                                 <h1 className="white-text mb-3 pt-3 font-weight-bold">
//                                 Sign Up
//                                 </h1>
//                             </MDBRow>
//                             <MDBRow className="mt-2 mb-3 d-flex justify-content-center">
//                                 <a onClick={this.googleLogin} className="fa-lg p-2 m-2 gplus-ic">
//                                     <MDBIcon fab className="fa-google-plus-g white-text fa-lg" />
//                                 </a>
//                             </MDBRow>
//                         </div>
//                         <MDBCardBody className="mx-4">
//                         <h3 align='center' className="blue-text mb-3 pt-3 font-weight-bold">
//                                 Start your trail today!
//                                 </h3>
//                           <form onSubmit={this.onSignup}>
//                             <div className="md-form mt-3">
//                               <i className="fa fa-envelope prefix grey-text"></i>
//                               <input required name="email" onChange={this.handleChange} type="email" id="materialSubscriptionFormPasswords" className="form-control"/>
//                               <label htmlFor="materialSubscriptionFormPasswords"> Email...</label>
//                             </div>
//                             <div className="md-form mt-3">
//                               <i className="fa fa-lock prefix grey-text"></i>
//                               <input required type="password" name="password" onChange={this.handleChange} id="materialSubscriptionFormPasswords" className="form-control"/>
//                               <label htmlFor="materialSubscriptionFormPasswords">Password...</label>
//                             </div> 
//                             <div className="md-form mt-3">
//                               <i className="fa fa-user prefix grey-text"></i>
//                               <input required type="text" name="username" onChange={this.handleChange} id="materialSubscriptionFormPasswords" className="form-control"/>
//                               <label htmlFor="materialSubscriptionFormPasswords">Username...</label>
//                             </div>  
//                             <div style={{margin: 'auto'}} className="text-center mb-3">
//                                 <MDBBtn
//                                     type="submit"
//                                     gradient="blue"
//                                     rounded
//                                     className="z-depth-1a"
//                                     style={{borderRadius: '18px',}}                                    
//                                 >
//                                   Sign up
//                                 </MDBBtn>
//                             </div>
//                           </form>
//                         </MDBCardBody>
//                     </MDBCard>
//                 </MDBCol>
//             </MDBRow>
//         </MDBContainer>
//     );}
// }
export default SignUp;