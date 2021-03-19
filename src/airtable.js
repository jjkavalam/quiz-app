var Airtable = require("airtable");
const API_KEY = "airtable_api_key";
let apiKey = window.localStorage.getItem(API_KEY);
if (!apiKey || window.location.hash === "#prompt_key") {
  apiKey = prompt("Enter key");
  window.localStorage.setItem(API_KEY, apiKey);
}
var base = new Airtable({ apiKey }).base("appvanulh63Stc0rr");

/**
 *
 * @param {{id, answer}} records max 10 records
 */
export function updateAnswers(records) {
  return new Promise((resolve, reject) => {
    const updateRecords = records.map(
      ({ id, answer, difficulty, time_spent }) => ({
        id,
        fields: {
          answer,
          difficulty,
          time_spent: time_spent / 1000
        }
      })
    );
    base("Questions").update(updateRecords, function (err, records) {
      if (err) {
        console.error(err);
        return reject(err);
      }
      return resolve(records.length);
    });
  });
}
export function fetchQuestions() {
  return new Promise((resolve, reject) => {
    const questions = [];
    base("Questions")
      .select({
        view: "Grid view",
        filterByFormula: "{included} = TRUE()",
        sort: [{ field: "seq", direction: "asc" }]
      })
      .eachPage(
        function page(records, fetchNextPage) {
          // This function (`page`) will get called for each page of records.

          records.forEach(function (record) {
            if (!record.get("text") && !record.get("image")) return;
            const imageField = record.get("image");
            const image = imageField && imageField[0] && imageField[0].url;
            questions.push({
              id: record.getId(),
              text: record.get("text"),
              answer: record.get("answer"),
              difficulty: record.get("difficulty"),
              time_spent: record.get("time_spent") * 1000,
              image
            });
          });

          // To fetch the next page of records, call `fetchNextPage`.
          // If there are more records, `page` will get called again.
          // If there are no more records, `done` will get called.
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            return reject(err);
          }
          console.log("fetched", questions);
          return resolve(questions);
        }
      );
  });
}

export function fetchQuiz() {
  return new Promise((resolve, reject) => {
    let quiz;
    base("Quiz")
      .select({
        view: "Grid view"
      })
      .eachPage(
        function page(records, fetchNextPage) {
          const rec = records[0];
          quiz = {
            start: new Date(rec.get("start")),
            end: new Date(rec.get("end"))
          };

          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            return reject(err);
          }
          console.log("fetched", quiz);
          return resolve(quiz);
        }
      );
  });
}
