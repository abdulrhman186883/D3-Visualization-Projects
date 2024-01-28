import * as d3 from "d3";
import { loadMoviesDataset } from "./src/movies.js";
import {
  tfidf,
  inverseDocumentFrequency,
  documentToWords,
} from "./src/wordvector.js";
import { tagCloud } from "./src/tagcloud.js";
import { wordcloud } from "./wordcloud.js";
import { treemap } from "./treemap.js";
import { theoryQuestions } from "./theory.js";
import { movieFranchises } from "./src/franchises.js";


theoryQuestions({ svg: d3.select("#theory") });

loadMoviesDataset().then((movies) => {

  const franchises = movieFranchises(movies);
  console.log(franchises);
  const color = d3
    .scaleOrdinal(d3.schemeTableau10)
    .domain(new Set(franchises.children, (d) => d.data.name));

  // Task 3: implement treemap.js
  treemap({
    svg: d3.select("svg#treemap"),
    data: franchises,
    color: color,
  });

  let textcorpus = movies.map((d) => ({
    title: d.title,
    description: d.overview,
  }));

  // array of documents, each document is an array of single words
  let wordsPerDocument = textcorpus.map((document) =>
    documentToWords(document.description)
  );


  const genres = Array.from(
    new Set(movies.map((movie) => movie.genres).flat())
  );

  const wordsPerGenre = genres.map((genre) =>
    wordsPerDocument.filter((_, i) => movies[i].genres.includes(genre)).flat()
  );
  const idfGenre = inverseDocumentFrequency(wordsPerGenre);
  const fakeData = new Map([["category 1", [["fake", 0.5], ["unfinished", 0.2], ["dataless", 0.1], ["artificial", 0.9]]]]);

  // Task 4: implement tagcloud.js
  wordcloud({
    svg: d3.select("#wordcloud"),
    wordsPerGroup: new Map(
      genres.map((genre, i) => [genre, tfidf(wordsPerGenre[i], idfGenre)])
    ),
    selection: d3.select("#genre"),
  });

});

