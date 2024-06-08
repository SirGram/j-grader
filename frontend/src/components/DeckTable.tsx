import { IDeck } from "../types/types";

export default function DeckTable({
    availableDecks,
    handleChange,
  }: {
    availableDecks: IDeck[];
    handleChange: (name: string) => void;
  }) {
    return (
      <table className="table rounded-box overflow-hidden bg-secondary-content text-center">
        <thead>
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
                  id="deck.id"
                  type="checkbox"
                  className="checkbox"
                  onChange={() => handleChange(deck.name)}
                />
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }