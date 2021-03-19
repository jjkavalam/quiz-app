import store from "./state";
import { updateAnswers } from "./airtable";
import { debounce } from "lodash";

let syncInProgress = false;
let lastSync = Date.now();

const debouncedHandleChange = debounce(handleChange, 1000, { maxWait: 1000 });

async function handleChange() {
  console.log("attempt syncing", syncInProgress);
  if (syncInProgress) return;
  try {
    syncInProgress = true;
    await handleChangeInner();
  } finally {
    console.log("done syncing");
    syncInProgress = false;
  }
}

function shift10(records) {
  const batch = [];
  for (let i = 0; i < 10; i++) {
    const rec = records.shift();
    if (!rec) break;
    batch.push(rec);
  }
  return batch;
}

async function handleChangeInner() {
  const state = store.getState();
  console.log(state);
  if (state.questions) {
    // last sync timeshot and filtering should happen together
    const dirtyRecords = state.questions.filter(
      ({ _sync_last_update }) => _sync_last_update > lastSync
    );
    lastSync = Date.now();
    // take 10 records at a time and update
    let batch = shift10(dirtyRecords);
    while (batch.length > 0) {
      const updateRecords = batch.map((rec) => ({
        id: rec.id,
        answer: rec.answer,
        difficulty: rec.difficulty,
        time_spent: rec.time_spent
      }));
      console.log("to update", updateRecords);
      const len = await updateAnswers(updateRecords);
      console.log("updated", len);

      batch = shift10(dirtyRecords);
    }
  }
}

export function initialize() {
  store.subscribe(debouncedHandleChange);
}
