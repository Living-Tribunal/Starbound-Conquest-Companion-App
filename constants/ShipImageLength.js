
  

export const ShipImageLength = (fighterImages, destroyerImages, cruiserImages, carrierImages, dreadnoughtImages,) => ({
    fighter: {
      type: "Fighters",
      value: `${fighterImages.length} Ships`,
    },
    destroyer: {
      type: "Destroyers",
      value: `${destroyerImages.length} Ships`,
    },
    cruiser: {
      type: "Cruisers",
      value: `${cruiserImages.length} Ships`,
    },
    carrier: {
      type: "Carriers",
      value: `${carrierImages.length} Ships`,
    },
    dreadnought: {
      type: "Dreadnoughts",
      value: `${dreadnoughtImages.length} Ships`,
    },
});
