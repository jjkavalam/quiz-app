import "./styles.css";
import { Provider } from "react-redux";
import store from "./state";
import Quiz from "./Quiz";

export default function App() {
  return (
    <Provider store={store}>
      <Quiz />
    </Provider>
  );
}
