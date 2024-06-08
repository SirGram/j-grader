
import { useDeckStore } from '../stores/store'; 

export default function Precision() {
  const { precision, setPrecision } = useDeckStore();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrecision(Number(e.target.value));
  };
  return (
    <div>
      <h2 className="mb-2">Precision</h2>
      <input
        type="range"
        min={0}
        max={100}
        value={precision}
        onChange={e=>handleChange(e)}
        className="range"
      />
    </div>
  );
}
