import axios from "axios";


const cardApi = axios.create({
    baseURL: "https://deckofcardsapi.com"
});

let deck_id = ""
export const getNewDeck = () => {
    return cardApi.get(`/api/deck/new`).then(({data})=>{
        deck_id = data.deck_id
        console.log(deck_id)
        return data;
        
    });
};

export const getBackOfCard = () => {
    return cardApi.get(`/static/img/back.png`).then(({data})=>{
        return data;
    })
}

export const drawCard = (count: number) => {
    return cardApi.get(`/api/deck/${deck_id}/draw/?count=${count}`).then(({data})=>{
        return data.cards
    })
}

export const addToPile = (pile_name: string, cards: any) => {
    
    return cardApi.get(`api/deck/${deck_id}/pile/${pile_name}/add/?cards=${cards}`)
}

const api = axios.create({
    baseURL: "https://liars-table-be.onrender.com/api",
  });
  export const fetchUserByEmail = async (email: string) => {
    const response = await api.get(`/users/${email}`);
    return response.data;
  };
  export const createUser = async (
    email: string,
    username: string,
    avatar: string,
    idToken: string
  ) => {
    const response = await api.post(
      "/users",
      { email, username, avatar },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      }
    );
    return response.data;
  };