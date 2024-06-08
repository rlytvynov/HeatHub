import { useEffect, useState } from 'react';

import MainHeader from "./MainHeader";
import UpperHeader from "./UpperHeader";
import Categories from './BottomHeader/Categories';
import SearchBar from './BottomHeader/SearchBar';
import Contacts from './BottomHeader/Contacts';

type LowerHeaderState = {
    categories: boolean,
    searchBar: boolean,
    contacts: boolean
}

const Header = () => {
    const [state, setState] = useState<LowerHeaderState>({
        categories: false,
        searchBar: false,
        contacts: false
    })

    const updateState = (newState: LowerHeaderState) => {
        setState(newState);
    };

    useEffect(() => {
        const handleResize = () => {
            if(window.innerWidth <= 768) {
                setState({
                    ...state,
                    categories: false,
                    searchBar: false,
                    contacts: false
                })
            } else {
                setState({
                    ...state,
                    categories: true,
                    searchBar: false,
                    contacts: false
                })
            }
          };
          handleResize()
      
          window.addEventListener('resize', handleResize);
      
          return () => {
            window.removeEventListener('resize', handleResize);
          };
          // eslint-disable-next-line
    }, [])

    return (
        <header id='header'>
            <UpperHeader/>
            <MainHeader state = {state} updateState = {updateState}/>
            {
                (() => {
                    if(state.categories) {return <Categories/>}
                    else if(state.contacts) {return <Contacts/>}
                    else if(state.searchBar) {return <SearchBar/>}
                    else return <></>
                })()
                
            }
        </header>
    ) 
}

export default Header