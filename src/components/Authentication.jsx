import { useState } from "react"
import { useAuth } from "../context/AuthContext"

export default function Authentication(props) {
    const {handleCloseModal} = props
    const [isRegistration, setIsRegistration] = useState(false)
    const [email, setEmail] = useState("")
    const [passoword, setPassword] = useState("")
    const [isAuthenticating, setIsAuthenticating] = useState(false)
    const [error, setError] = useState(null)

   const { signUp, login } = useAuth()

    async function handleAuthenticate() {
        if(!email || !email.includes('@') || !passoword || passoword.length < 6 || isAuthenticating) {
            return }
        try {
            setIsAuthenticating(true)
            setError(null)

            if (isRegistration) {
                await signUp(email, passoword)
            } else {
                await login(email, passoword)
            }

            handleCloseModal()

        }  catch(err) {
            console.log(err.message)
            setError(err.message)
        } finally {
            setIsAuthenticating(false)
        }
    }

    return( 
        <>
          <h2 className="sign-up-text">{isRegistration ? "Sign Up" : "Login"}</h2>  
          <p>{isRegistration ? "Create an account" : "Sign in to your account"}</p>
          {error && (
            <p>❌ {error}</p>
          )}
          <input value={email} onChange={(e) => { setEmail(e.target.value)}}placeholder="Email"/>
          <input value={passoword} onChange={(e) => { setPassword(e.target.value)}} placeholder="*********" type="password"/>
          <button onClick={handleAuthenticate}><p>{isAuthenticating ? "Authenticating..." : "Submit"}</p></button>
          <hr />
          <div className="register-content">
            <p>{ isRegistration ? "Already have an account?" : "Don\'t have an account?"}</p>
            <button onClick={() => { setIsRegistration(!isRegistration)}}><p>{isRegistration ? "Sign in" : "Sign up"}</p></button>
          </div>
        </>
    )
}