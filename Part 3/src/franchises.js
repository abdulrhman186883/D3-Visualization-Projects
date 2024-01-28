import { index } from "d3-array";

export function movieFranchises(movies) {
  const moviesByImdbId = index(movies, (d) => d.imdbId);
  return {
    name: "franchises",
    children: [
      {
        name: "Star Wars",
        children: [
          {
            name: "Skywalker Saga",
            children: [
              moviesByImdbId.get("tt0076759"),
              moviesByImdbId.get("tt0080684"),
              moviesByImdbId.get("tt0086190"),
            ],
          },
          {
            name: "Prequel Trilogy",
            children: [
              moviesByImdbId.get("tt0120915"),
              moviesByImdbId.get("tt0121765"),
              moviesByImdbId.get("tt0121766"),
            ],
          },
          {
            name: "Sequel Trilogy",
            children: [
              moviesByImdbId.get("tt2488496"),
              moviesByImdbId.get("tt2527336"),
              moviesByImdbId.get("tt2527338"),
            ],
          },
          {
            name: "Standalone Films",
            children: [
              moviesByImdbId.get("tt1185834"),
              moviesByImdbId.get("tt3748528"),
              moviesByImdbId.get("tt3778644"),
            ],
          },
        ],
      },
      {
        name: "Marvel Cinematic Universe",
        children: [
          {
            name: "The Infinity Saga: Phase One",
            children: [
              moviesByImdbId.get("tt0371746"),
              moviesByImdbId.get("tt0800080"),
              moviesByImdbId.get("tt1228705"),
              moviesByImdbId.get("tt0800369"),
              moviesByImdbId.get("tt0458339"),
              moviesByImdbId.get("tt0118661"),
            ],
          },
          {
            name: "The Infinity Saga: Phase Two",
            children: [
              moviesByImdbId.get("tt1300854"),
              moviesByImdbId.get("tt1981115"),
              moviesByImdbId.get("tt1843866"),
              moviesByImdbId.get("tt2015381"),
              moviesByImdbId.get("tt2395427"),
              moviesByImdbId.get("tt0478970"),
            ],
          },
          {
            name: "The Infinity Saga: Phase Three",
            children: [
              moviesByImdbId.get("tt3498820"),
              moviesByImdbId.get("tt1211837"),
              moviesByImdbId.get("tt3896198"),
              moviesByImdbId.get("tt2250912"),
              moviesByImdbId.get("tt3501632"),
              moviesByImdbId.get("tt1825683"),
              moviesByImdbId.get("tt4154756"),
              moviesByImdbId.get("tt5095030"),
              moviesByImdbId.get("tt4154664"),
              moviesByImdbId.get("tt4154796"),
              moviesByImdbId.get("tt6320628"),
            ],
          },
        ],
      },

      {
        name: "Harry Potter",
        children: [
          {
            name: "Harry Potter",
            children: [
              moviesByImdbId.get("tt0241527"),
              moviesByImdbId.get("tt0295297"),
              moviesByImdbId.get("tt0304141"),
              moviesByImdbId.get("tt0330373"),
              moviesByImdbId.get("tt0373889"),
              moviesByImdbId.get("tt0417741"),
              moviesByImdbId.get("tt0926084"),
              moviesByImdbId.get("tt1201607"),
            ],
          },
          {
            name: "Fantastic Beasts",
            children: [
              moviesByImdbId.get("tt3183660"),
              moviesByImdbId.get("tt4123430"),
            ],
          },
        ],
      },

      {
        name: "DC Extended Universe",
        children: [
          moviesByImdbId.get("tt0770828"),
          moviesByImdbId.get("tt2975590"),
          moviesByImdbId.get("tt1386697"),
          moviesByImdbId.get("tt0451279"),
          moviesByImdbId.get("tt0974015"),
          moviesByImdbId.get("tt1477834"),
          moviesByImdbId.get("tt0448115"),
          moviesByImdbId.get("tt7713068"),
          moviesByImdbId.get("tt7126948"),
        ],
      },
      {
        name: "Jurassic Park",
        children: [
          {
            name: "Jurassic Park",
            children: [
              moviesByImdbId.get("tt0107290"),
              moviesByImdbId.get("tt0119567"),
              moviesByImdbId.get("tt0163025"),
            ],
          },
          {
            name: "Jurassic World",
            children: [
              moviesByImdbId.get("tt0369610"),
              moviesByImdbId.get("tt4881806"),
            ],
          },
        ],
      },
      {
        name: "Pirates of the Caribbean",
        children: [
          moviesByImdbId.get("tt0325980"),
          moviesByImdbId.get("tt0383574"),
          moviesByImdbId.get("tt0449088"),
          moviesByImdbId.get("tt1298650"),
          moviesByImdbId.get("tt1790809"),
        ],
      },
      {
        name: "The Lord of the Rings",
        children: [
          {
            name: "The Lord of the Rings",
            children: [
              moviesByImdbId.get("tt0120737"),
              moviesByImdbId.get("tt0167261"),
              moviesByImdbId.get("tt0167260"),
            ],
          },
          {
            name: "The Hobbit",
            children: [
              moviesByImdbId.get("tt0903624"),
              moviesByImdbId.get("tt1170358"),
              moviesByImdbId.get("tt2310332"),
            ],
          },
        ],
      },
    ],
  };
}
