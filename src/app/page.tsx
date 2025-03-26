import Image from "next/image";
const types = ["Todo", "In-Progress", "Done", "Blocked"];
export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="w-8/10 h-8/10 fixed transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-foreground flex justify-evenly items-center">
        {types.map((type) => (
          <div className="w-[24%] h-9/10 bg-secondary shadow-2xl">
            <div className="p-4 font-semibold">{type}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
