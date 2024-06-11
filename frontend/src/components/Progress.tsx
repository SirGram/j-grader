export default function Progress({value, max}:{value:number| undefined, max:number | undefined}){
  if (value === undefined || max === undefined ) return null
  const  percent = value === 0 ? 0 : (value * 100) / max;

    console.log(percent)
    return (
        <div className="border border-gray-400 w-64 h-4">
          <div className="bg-primary h-full"
           style={{ width: `${percent}%` }}
          ></div>
        </div>
      );
}