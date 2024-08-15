//types
import { STORE_SESSION_SCORE } from "../actions/type";

const initialState = {
    sessionScore: 0
}

const currentSessionReducer = (state = initialState, action) => {
    switch(action.type) {
        case STORE_SESSION_SCORE : 
            return {
                ...state,
                sessionScore: action.payload
            }
        default : 
            return {
                ...state
            }    
    }
}

export default currentSessionReducer

