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
      <div className="overflow-x-auto">
        <table className="table rounded-box bg-secondary text-center w-full">
          <thead className="text-secondary-content bg-secondary">
            <tr>
              <th>Deck Name</th>
              <th>Card Count</th>
              <th>Select</th>
            </tr>
          </thead>
        </table>
        <div className="max-h-[400px] overflow-y-auto">
          <table className="table rounded-box bg-secondary text-center w-full">
            <tbody className="bg-base-200 rounded-box gap-2 p-4">
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
            </tbody>
          </table>
        </div>
      </div>
    );
  }