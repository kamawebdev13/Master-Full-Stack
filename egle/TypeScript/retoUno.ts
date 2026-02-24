interface PerfilUsuario {
  userName: string;
  email: string;
  edad: number;
  biografia?: string;
  telefono?: number
}

const usuario1: PerfilUsuario = {
  userName: "Pepeto Lopez",
  email: "pepeto13@yahoo.com",
  edad: 55,
  biografia: "Galan de barrio",
  telefono: 5678945

};

const usuario2: PerfilUsuario = {
  userName: "Maruja Majo",
  email: "lamaruja73@yahoo.com",
  edad: 58,

};

console.log(usuario1);
console.log(usuario2);