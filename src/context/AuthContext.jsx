import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext } from "react";
import { useState, useEffect, useContext } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext() 

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider(props){
    const { children } = props
    const [globalUser, setGlobalUser] = useState(null)
    const [globalData, setGlobalData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)


    function signUp(email, passoword) {
        return createUserWithEmailAndPassword(auth, email, passoword)
    }

    function login(email, passoword) {
        return signInWithEmailAndPassword(auth, email, passoword)
    }

    function logOut(){
        setGlobalData(null)
        setGlobalUser(null)
        return signOut(auth)
    }

    function resetPassword(email){
        return sendPasswordResetEmail(auth, email)
    }

    const value = { globalUser, globalData, setGlobalData, isLoading, signUp, logOut, login }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => { 
            console.log("CURRENT USER: ", user)
            setGlobalUser(user)
            if(!user) {return}

            try {
                setIsLoading(true)

                const docRef = doc(db, 'users', user.uid)
                const docSnap = await getDoc(docRef)

                let firebaseData = {}
                if (docSnap.exists){
                    console.log('Found user data')
                        firebaseData = docSnap.data()
                }
                setGlobalData(firebaseData)
            } catch(err) {
                console.log(err.message)
            } finally {
                setIsLoading(false)
            }
        })
        return unsubscribe
    }, [])

    return (
        <AuthContext.Provider value={value}>
            { children }
        </AuthContext.Provider>
    )
}