export interface Card {   
    code: string;
    image: string;
    images: Record<string, string>;
    value: string;
    suit: string;
    svg: string;    
}


export type Cards =  Card[]; 

export interface Hand {
    user_id: string;
    cards: Card[];
  };

export type PlayerHandContextType = {
    user_id: string;
    pile_id: number;
    cards: Card[];
    hand: Hand;
    addCard: (card: Cards) => void;
    returnToCard: (card: Card, pile_id: number) => void;

};

