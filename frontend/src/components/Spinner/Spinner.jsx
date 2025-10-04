import React from 'react'
import "./Spinner.css"
import { assets } from '../../assets/assets'


const Spinner = ()=> {
    
        return (
            <div className="Spinner">
                <img className="my-3" src={assets.spinner} alt="loading" />
            </div>
        )
}

export default Spinner