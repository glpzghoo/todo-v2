import { todo } from "../page";

export default function Card({ todo }: { todo: todo }) {
  return (
    <div className="card w-96 bg-base-100 card-xs shadow-sm p-6 rounded-2xl relative">
      <div className="card-body">
        <h2 className="card-title font-bold">{todo.taskName}</h2>
        <p>{todo.description}</p>
        <div className="justify-end card-actions">
          <button className="btn btn-primary">Засах</button>
        </div>
        <div className="absolute bottom-2 right-2">
          {todo.isDone ? (
            <div className=" text-green-400">Дууссан</div>
          ) : (
            <div className=" text-red-400">Дуусаагүй</div>
          )}
        </div>
        <div>{todo.createdAt}</div>
      </div>

      {/* <div className="flex justify-between">
        <div className="font-bold"></div>
        <div>{todo.priority}</div>
      </div>
      <div className="flex flex-col">
        <div>Дэлгэрэнгүй: </div>
        <div></div>
      </div>
     */}
    </div>
  );
}
