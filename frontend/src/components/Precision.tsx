
import { useDeckStore } from '../stores/store'; 

export default function Precision() {
  const { precision, setPrecision } = useDeckStore();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrecision(Number(e.target.value));
  };

  let shadowColorClass = "";
  if (precision > 90) {
    shadowColorClass = "red";
  } else if (precision > 60) {
    shadowColorClass = "yellow";
  } else {
    shadowColorClass = "green";
  }

  return (
    <div>
      <h2 className="mb-2">Grading accuracy</h2>
      <input
        type="range"
        min={0}
        max={100}
        value={precision}
        onChange={e=>handleChange(e)}
        className={`range [--range-shdw:${shadowColorClass}]`}
      />
    </div>
  );
}
