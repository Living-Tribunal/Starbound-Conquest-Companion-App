import React, { createContext, useContext, useState } from 'react';
import { SHIP_TOGGLES_DONE, SHIP_CAPACITY, SHIP_TOGGLES  } from '@/constants/Ships';

const StarBoundContext = createContext();

export const StarBoundProvider = ({ children }) => {
    const [fighterImages, setFighterImages] = useState([]);
    const [destroyerImages, setDestroyerImages] = useState([]);
    const [cruiserImages, setCruiserImages] = useState([]);
    const [carrierImages, setCarrierImages] = useState([]);
    const [dreadnoughtImages, setDreadnoughtImages] = useState([]);

    const [showFighterClass, setShowFighterClass] = useState(true);
    const [showDestroyerClass, setShowDestroyerClass] = useState(true);
    const [showCarrierClass, setShowCarrierClass] = useState(true);
    const [showCruiserClass, setShowCruiserClass] = useState(true);
    const [showDreadnoughtClass, setShowDreadnoughtClass] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [text, setText] = useState("0");

    /* const [toggleDone, setToggleDone] = useState(Array(SHIP_TOGGLES_DONE[type]).fill(false));
    const [toggleStates, setToggleStates] = useState( Array(SHIP_TOGGLES[type]).fill(false));
    const [toggleCapacity, setToggleCapacity] = useState(Array(SHIP_CAPACITY[type]).fill(false)); */

    const [toggleDone, setToggleDone] = useState({
        fighter: Array(SHIP_TOGGLES_DONE.fighter).fill(false),
        destroyer: Array(SHIP_TOGGLES_DONE.destroyer).fill(false),
        cruiser: Array(SHIP_TOGGLES_DONE.cruiser).fill(false),
        carrier: Array(SHIP_TOGGLES_DONE.carrier).fill(false),
        dreadnought: Array(SHIP_TOGGLES_DONE.dreadnought).fill(false),
      });
    
      const [toggleStates, setToggleStates] = useState({
        fighter: Array(SHIP_TOGGLES.fighter).fill(false),
        destroyer: Array(SHIP_TOGGLES.destroyer).fill(false),
        cruiser: Array(SHIP_TOGGLES.cruiser).fill(false),
        carrier: Array(SHIP_TOGGLES.carrier).fill(false),
        dreadnought: Array(SHIP_TOGGLES.dreadnought).fill(false),
      });
    
      const [toggleCapacity, setToggleCapacity] = useState({
        fighter: Array(SHIP_CAPACITY.fighter).fill(false),
        destroyer: Array(SHIP_CAPACITY.destroyer).fill(false),
        cruiser: Array(SHIP_CAPACITY.cruiser).fill(false),
        carrier: Array(SHIP_CAPACITY.carrier).fill(false),
        dreadnought: Array(SHIP_CAPACITY.dreadnought).fill(false),
      });

return (
    <StarBoundContext.Provider value={{ 
        fighterImages, setFighterImages,
        destroyerImages, setDestroyerImages, 
        cruiserImages, setCruiserImages,
        carrierImages, setCarrierImages,
        dreadnoughtImages, setDreadnoughtImages,

        showFighterClass, setShowFighterClass,
        showDestroyerClass, setShowDestroyerClass,
        showCarrierClass, setShowCarrierClass,
        showCruiserClass, setShowCruiserClass,
        showDreadnoughtClass, setShowDreadnoughtClass,

        toggleDone, setToggleDone,
        toggleStates, setToggleStates,
        toggleCapacity, setToggleCapacity,

        isModalVisible, setIsModalVisible,
        

        text, setText
        
        }}>
        {children}
    </StarBoundContext.Provider>
 );
};

export const useStarBoundContext = () => useContext(StarBoundContext);