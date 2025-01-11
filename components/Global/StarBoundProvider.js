import React, { createContext, useContext, useState } from 'react';
import { SHIP_TOGGLES_DONE } from '@/constants/Ships';

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


        isModalVisible, setIsModalVisible
        
        }}>
        {children}
    </StarBoundContext.Provider>
 );
};

export const useStarBoundContext = () => useContext(StarBoundContext);