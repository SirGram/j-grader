import { IDeck } from "../types/types";

export default function DeckTable({
    availableDecks,
    handleChange,
    selectedDecksNames
  }: {
    availableDecks: IDeck[];
    handleChange: (name: string) => void;
    selectedDecksNames:string[]
  }) {

  const totalDeckSize = availableDecks.reduce((acc, deck) => acc + (deck.cards.length), 0);
  const allSelected = availableDecks.every(deck => selectedDecksNames.includes(deck.name));

    return (
      <table className="table rounded-box overflow-hidden bg-secondary text-center">
        <thead className=" text-secondary-content">
          <tr>
            <th>Deck Name</th>
            <th>Card Count</th>
            <th>Select</th>
          </tr>
        </thead>
  
        <tbody className="bg-base-200 rounded-box  gap-2 p-4 ">
          {availableDecks.map((deck) => (
            <tr key={deck.name} className="hover:bg-base-300">
              <th>{deck.name.toUpperCase()}</th>
              <th>{deck.cards.length}</th>
              <th>
                <input
                  id={deck.name}
                  type="checkbox"
                  className="checkbox"
                  onChange={() => handleChange(deck.name)}
                  checked={selectedDecksNames.includes(deck.name)}
                />
              </th>
            </tr>
          ))}
           <tr key={"all"} className="hover:bg-base-300">
              <th>ALL</th>
              <th>{totalDeckSize}</th>
              <th>
                <input
                  id="all"
                  type="checkbox"
                  className="checkbox"
                  onChange={() => handleChange("all")}
                  checked={allSelected}
                />
              </th>
            </tr>

        </tbody>
      </table>
    );
  }