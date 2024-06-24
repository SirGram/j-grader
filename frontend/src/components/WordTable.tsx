import { IDeckCardWithState } from "../types/types";

export default function WordTable({ words }: { words: IDeckCardWithState[] }) {
  console.log("table", words);
  return (
    words.length > 0 && (
      <div className="overflow-x-auto max-w-xl bg-base-200 rounded-box collapse collapse-arrow">
        <input type="checkbox" />
        <h3 className="collapse-title font-thin text-3xl  p-4 w-full text-center  bg-gradient-to-b from-base-200 to-base-300 ">
          TESTED WORDS
        </h3>
        <table className="table collapse-content">
          {/* head */}
          <thead>
            <tr>
              <th>Vocab</th>
              <th>Reading</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            {words.map((word, index) => (
             
              <tr
                key={index}
                // if word.state text is red
                className={` ${word.state === "failed" ? "text-error" : ""} ${index % 2 === 0 ? "bg-base-300" : "bg-base-200"}`}
              >
                <td>{word.question}</td>
                <td>{word.answer}</td>
                <td>{word.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  );
}
