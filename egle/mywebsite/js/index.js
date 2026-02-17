const getUser = async (numResults = 1) => {

    try {

        const response = await fetch(`https://randomuser.me/api/?results=${numResults}`)
         if (!response.ok) {
            throw new Error("USUARIO NO ENCONTRADO");

        }
        
        const data = await response.json();
        const user = data.results[0];
        
        const userName = user.name.first;
        const userLastName = user.name.last;

        const userEmail = user.email;
        const userPictureUrl = user.picture.medium;

        console.log(`Nombre: ${userName}, Apellido: ${userLastName}`);
        console.log(`Email: ${userEmail}`);
        console.log(`Url de foto: ${userPictureUrl}`)


    } catch (error) {
        console.log("Error al contactar con la base de datos de uruario!!!");

    }

 
}
getUser(1);