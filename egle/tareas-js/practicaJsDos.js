const heroes = [
{ nombre: "Iron Man", nivel: 5, equipo: "Avengers" },
{ nombre: "Batman", nivel: 4, equipo: "Justice League" },
{ nombre: "Thor", nivel: 8, equipo: "Avengers" },
{ nombre: "Spider-Man", nivel: 3, equipo: "Avengers" }
];

let newAvengerTeam = [];

const addAvengersTeam = (avengerName) => {
    //Buscamos el heroe avenger
     const foundAvenger = heroes.find(h => h.nombre.toLowerCase() === avengerName.toLowerCase() && h.equipo === "Avengers" );
    
    // validamos y armamos el equipo
     if(foundAvenger) {
        newAvengerTeam.push(foundAvenger);
         console.log(`Avenger: ${foundAvenger.nombre} agregado al equipo`);
    }else{
        console.log(`El Avenger: ${avengerName} no fue encontrado, intente con otro heroe`)
    }

};
// invocamos funcion e imprimimos resultado
addAvengersTeam("Iron Man");
addAvengersTeam("Thor");
addAvengersTeam("Spider-man");
addAvengersTeam("Batman");

console.log(newAvengerTeam);

//Función subir nivel
const levelUp = (heroeName) => {
//Buscamos el heroe 
const foundHeroe = heroes.find(h => h.nombre.toLowerCase() === heroeName.toLowerCase());
 // validamos el heroe y subimos nivel
if(foundHeroe) {
    foundHeroe.nivel += 1;
    console.log(`your ${foundHeroe.nombre} ha subido de nivel: ${foundHeroe.nivel}`)
} else {
    console.log(`your hero: ${heroeName} no encontrado`)
    
}

}

levelUp("Iron Man");
levelUp("Batman");
console.log(heroes);
