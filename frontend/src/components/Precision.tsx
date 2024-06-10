
import { useDeckStore } from '../stores/deckStore'; 

export default function Precision() {
  const { precision, setPrecision } = useDeckStore();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrecision(Number(e.target.value));
  };

  let shadowColorClass = "";
  if (precision > 90) {
    shadowColorClass = "range [--range-shdw:red]";
  } else if (precision > 60) {
    shadowColorClass = "range [--range-shdw:yellow]";
  } else {
    shadowColorClass = "range [--range-shdw:green]";
  }
  console.log(shadowColorClass)

  return (
    <div>
      <h2 className="mb-2">Sample size</h2>
      <input
        type="range"
        min={0}
        max={100}
        value={precision}
        onChange={e=>handleChange(e)}
        className={shadowColorClass}
        
      />
    </div>
  );
}
