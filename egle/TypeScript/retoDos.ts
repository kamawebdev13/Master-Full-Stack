interface MongoId {
  $oid: string;
}

interface MongoDate {
  $date: string;
}

interface Codigos {
  number: number;
  string: string;
  boolean: boolean;
}


interface Respuesta {
  _id: MongoId;
  name: string;
  email: string;
  movie_id: MongoId;
  text: string;
  codes: Codigos;
  date: MongoDate;
}