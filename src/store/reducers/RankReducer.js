//types
import { FETCH_RANK_ERROR, SET_RANK_ARRAY, FETCH_RANK, TIME_OF_UPDATE } from "../actions/type";

const initialState = {
    rank: [],
    loading: false,
    error: null,
    timeOfLastUpdate: null
}

const rankReducer = (state = initialState, action) => {
    switch(action.type){
        case FETCH_RANK :
            return {
                ...state,
                loading: action.payload
            }
        case SET_RANK_ARRAY :
            return {
                ...state,
                rank: action.payload,
                loading : false
            }  
        case FETCH_RANK_ERROR :
            return {
                ...state,
                error: action.payload
            }  
        case TIME_OF_UPDATE :
            return {
                ...state,
                timeOfLastUpdate: action.payload
            }     
        default :
            return {
                ...state
            }      
            
    }
}

export default rankReducer