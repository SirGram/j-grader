export default function Progress({value, max}:{value:number, max:number}){
    const percent = value * 100/ max
    console.log(percent)
    return (
        <div className="border border-gray-400 w-64 h-4">
          <div className="bg-primary h-full"
           style={{ width: `${percent}%` }}
          ></div>
        </div>
      );
}