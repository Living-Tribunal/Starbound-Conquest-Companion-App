import { SpecialOrders } from "./SpecialOrders.js";

export const ShipAttributes =  {
Fighter: {
    hp: 1,
    toHit: 15,
    soak: 1,
    moveDistance: '80ft',
    capacity: 0,
    specialOrders: [
        [SpecialOrders[1].name, SpecialOrders[3].text],
        [SpecialOrders[2].name, SpecialOrders[2].text],
        [SpecialOrders[3].name, SpecialOrders[3].text],
    ],
    weaponType: ["Light Cannon"],
    firingArc: "Forward(90°)",
    weaponDamage: "1d4",
    weaponRange: "30ft",
    pointValue: 1
},

Destroyer: {
    hp: 8,
    toHit: 10,
    soak: 4,
    moveDistance: "60ft",
    capacity: 0,
    specialOrders: [
        "All Ahead Full",
        "Anti-Fighter Barrage",
        "Powerup Main Guns"
    ],
    weaponType: ["Medium Cannon"],
    firingArc: "Forward(90°)",
    weaponDamage: "1d6",
    weaponRange: "30ft",
    pointValue: 30 
},
Cruiser:{
    hp: 12,
    toHit: 8,
    soak: 6,
    moveDistance: "50ft",
    capacity: 0,
    specialOrders: [
        "All Ahead Full",
        "Reinforce Shields",
        "All Systems Fire",
        "Broadside"
    ],
    weaponType: [
        "Heavy Cannon",
        "Plasma Cannon"],
    firingArc: [
        "Forward(90°)",
        "Port/Starboard(90°)"],
    weaponDamage: [
        "1d8",
        "1d10"],
    weaponRange: [
        "30ft", 
        "60ft"],
    pointValue: 80
},
Carrier: {
    hp: 14,
    toHit: 6,
    soak: 7,
    moveDistance: "40ft",
    capacity: 20,
    specialOrders: [
        "All Ahead Full",
        "Reinforce Shields",
        "All Systems Fire",
        "Launch Fighters"
    ],
    weaponType: [
        "350mm Railgun",
        "Missile Battery"],
    firingArc: [
        "Forward/Aft(90°)",
        "All(360)"],
    weaponDamage: [
        "1d8",
        "1d6"],
    weaponRange: [
        "30ft-120ft", 
        "15ft-60ft"],
    pointValue: 120
},
Dreadnought: {
    hp: 30,
    toHit: 4,
    soak: 8,
    moveDistance: "30ft",
    capacity: 20,
    specialOrders: [
        "All Ahead Full",
        "Reinforce Shields",
        "All Systems Fire",
        "Launch Fighters",
        "Charge Ion Beam"
    ],
    weaponType: [
        "350mm Railgun",
        "Plasma Canon",
        "Ion Particle Beam"],
    firingArc: [
        "Forward/Aft(90°)",
        "Port/Starboard(90°)",
        "Forward(90°)"],
    weaponDamage: [
        "1d12",
        "1d10",
        '1d8'],
    weaponRange: [
        "30ft-120ft",
        "60ft",
        "30ft-60ft"],
    pointValue: 240
}
};