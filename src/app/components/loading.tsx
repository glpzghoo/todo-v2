import { ImSpinner10 } from "react-icons/im";

export default function Loading() {
  return (
    <div className="flex items-center gap-2">
      <div>Түр хүлээнэ үү!</div>
      <ImSpinner10 className=" animate-spin" />
    </div>
  );
}
