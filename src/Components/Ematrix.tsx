import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BsCheckSquare,
  BsPencilSquare,
  BsQuestionSquare,
  BsThreeDots,
  BsThreeDotsVertical,
  BsTrash3Fill,
  BsXSquare,
} from "react-icons/bs";

export default function Ematrix() {
  const [isHelpHidden, setIsHelpHidden] = useState(true);
  return (
    <>
      <div className="h-full w-full bg-gray-900">
        <div className="flex w-full justify-between items-center">
          <h1 className="m-4 font-bold text-3xl text-white">
            Eisenhower Matrix
          </h1>
          <button
            onClick={() => setIsHelpHidden(!isHelpHidden)}
            className="px-4 py-2 text-xs h-8 transition-colors text-nowrap rounded text-gray-200  hover:text-gray-400 flex justify-center items-center gap-2"
          >
            <span>
              <i>{`${isHelpHidden ? "Show" : "Hide"} Help`}</i>
            </span>
            {isHelpHidden ? (
              <BsQuestionSquare size={14} />
            ) : (
              <BsXSquare size={14} />
            )}
          </button>
        </div>
        <motion.div
        layout
        layoutId="help"
          className={`container mx-auto px-4 mt-4 overflow-hidden text-gray-200 ${
            isHelpHidden ? "h-0" : "h-auto"
          }`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: isHelpHidden ? 0 : "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <h3 className="text-xl font-semibold mb-6 text-white">What is it?</h3>
          <p className="mb-6 ml-4 text-sm font-light">
            The Eisenhower Matrix, also known as Urgent-Important Matrix was
            created by President Dwight D. Eisenhower. It is a visual
            decision-making tool that helps you prioritize tasks based on two
            key criteria: urgency and importance. It's perfect when your task
            list is too overwhelming and you need to make tough calls about what
            to focus on first, what can wait, and what to let go of entirely.
          </p>

          <h3 className="text-xl font-semibold mb-6 text-white">
            How it works:
          </h3>
          <ol className="list-decimal pl-4 mb-6 font-light">
            <li className="mb-2 ml-4 text-sm">
              <strong className="text-red-400">
                Important and Urgent <i>(Do First)</i>:
              </strong>{" "}
              Tackle these tasks right away!
            </li>
            <li className="mb-2 ml-4 text-sm">
              <strong className="text-orange-400">
                Important but Not Urgent <i>(Schedule)</i>:
              </strong>{" "}
              Plan a time to do these later.
            </li>
            <li className="mb-2 ml-4 text-sm">
              <strong className="text-yellow-400">
                Urgent but Not Important <i>(Delegate)</i>:
              </strong>{" "}
              Let someone else handle this.
            </li>
            <li className="mb-2 ml-4 text-sm">
              <strong className="text-green-400">
                Not Urgent and Not Important <i>(Delete)</i>:
              </strong>{" "}
              Get rid of these time-wasters.
            </li>
          </ol>
          <p className="mb-6 font-light text-sm">
            This web app is{" "}
            <strong>
              <i>free to use</i>
            </strong>{" "}
            and saves your tasks in your browser!
          </p>
          <p className="mb-6 font-light text-sm">
            Simply create tasks by clicking "Add card" and drag & drop them into
            the right quadrant. Need to make changes? Hit the edit icon on a
            task. Completed a task? Drag it to the trash area! Want to clear a
            whole quadrant? Click "Clear all".
          </p>

          <p className="text-lg font-semibold text-center text-white">
            Ready to conquer that task list? Let's go!
          </p>
        </motion.div>
        <Board />
      </div>
    </>
  );
}

function Board() {
  const [hasChecked, setHasChecked] = useState(false);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    hasChecked && localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    const cardData = localStorage.getItem("cards");
    setCards(cardData ? JSON.parse(cardData) : DEFAULT_CARDS);
    setHasChecked(true);
  }, []);

  return (
    <>
      <div className="sm:grid grid-rows-7 grid-cols-2 sm:h-screen h-full w-full space-y-8 sm:space-y-0 sm:gap-4 overflow-auto p-4 sm:p-8 pb-16">
        <div className="row-span-3 h-full" >
          <Column
            title="Important and Urgent"
            headingColor="text-red-400"
            column="Imp-Urg"
            cards={cards}
            setCards={setCards}
          />
        </div>

        <div className="row-span-3 h-full" >
          <Column
            title="Important"
            headingColor="text-orange-400"
            column="Imp"
            cards={cards}
            setCards={setCards}
          />
        </div>

        <div className="row-span-3 h-full" >
          <Column
            title="Urgent"
            headingColor="text-yellow-400"
            column="Urg"
            cards={cards}
            setCards={setCards}
          />
        </div>

        <div className="row-span-3 h-full" >
          <Column
            title="Not Important or Urgent"
            headingColor="text-green-400"
            column="Del"
            cards={cards}
            setCards={setCards}
          />
        </div>
        <div className="col-span-2 row-span-1 hidden sm:flex" >
          <DeleteBox setCards={setCards} />
        </div>
      </div>
    </>
  );
}

function DeleteBox({ setCards }: { setCards: Function }) {
  const [active, setActive] = useState(false);

  function handleDragOver(e: { preventDefault: () => void }) {
    e.preventDefault();
    setActive(true);
  }

  function handleDragLeave() {
    setActive(false);
  }

  function handleDragEnd(e: {
    dataTransfer: { getData: (arg0: string) => any };
  }) {
    const cardId = e.dataTransfer.getData("cardId");
    setActive(false);
    setCards((existingCards: any[]) =>
      existingCards.filter((card) => {
        return card.id !== cardId;
      })
    );
  }

  return (
    <div
      className={`grid h-full w-full shrink-0 place-content-center rounded border sm:text-3xl text-lg py-4 ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-gray-800 bg-gray-800/20 text-gray-500"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDragEnd}
    >
      {active && <BsTrash3Fill className="animate-ping" />}
      {!active && <BsTrash3Fill className="" />}
    </div>
  );
}

type CardType = {
  title: string;
  id: string;
  column: string;
  handleDragStart: Function;
  setCards: Function;
};

type ColumnProps = {
  title: string;
  headingColor: string;
  cards: CardType[];
  column: string;
  setCards: Function;
};

function Column({ title, headingColor, column, cards, setCards }: ColumnProps) {
  const [active, setActive] = useState(false);

  function handleDragStart(e: React.DragEvent<HTMLDivElement>, card: CardType) {
    e.dataTransfer?.setData("cardId", card.id);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  }

  function highlightIndicator(e: React.DragEvent<HTMLDivElement>) {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const nearest = getNearestIndicator(e, indicators);
    nearest.element.style.opacity = "1";
  }

  function clearHighlights(nearest?: HTMLElement[] | undefined) {
    const indicators: HTMLElement[] = nearest || getIndicators();
    indicators.forEach((indicator: HTMLElement) => {
      indicator.style.opacity = "0";
    });
  }

  function getNearestIndicator(
    e: React.DragEvent<HTMLDivElement>,
    indicators: HTMLElement[]
  ): { offset: number; element: HTMLElement } {
    const DISTANCE_OFFSET = 25;
    const nearest = indicators.reduce<{ offset: number; element: HTMLElement }>(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1], // Ensure there's a default
      }
    );
    return nearest;
  }

  function getIndicators(): HTMLElement[] {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  }

  function handleDragLeave() {
    setActive(false);
    clearHighlights();
  }

  function handleDragEnd(e: React.DragEvent<HTMLDivElement>) {
    setActive(false);
    clearHighlights();
    const cardId = e.dataTransfer?.getData("cardId");
    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);
    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];
      let cardToTransfer = copy.find((card) => card.id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, column };
      copy = copy.filter((card) => card.id !== cardId);
      const moveToBack = before === "-1";
      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertIndex = copy.findIndex((card) => card.id === before);
        if (insertIndex === undefined) return;
        copy.splice(insertIndex, 0, cardToTransfer);
      }
      setCards(copy);
    }
  }

  const filteredCards = cards.filter((card) => card.column === column);
  return (
    <div className="column w-half h-full shrink-0 ">
      <div className="sticky top-0 z-10 flex items-center justify-between pb-2 mb-2 shadow-gray-900 shadow-md bg-gray-900">
        <h3 className={`font-semibold ${headingColor} `}>{title}</h3>
        <span
          className={`rounded text-sm font-semibold mr-2 ${headingColor} opacity-70`}
        >
          {filteredCards.length}
        </span>
      </div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDragEnd}
        className={`column-inner h-[calc(100%-40px)] w-full transition-colors overflow-x-hidden overflow-y-auto pr-2 ${
          active ? "bg-gray-800/50" : ""
        }`}
      >
        {filteredCards.map((card) => (
          <Card
            key={card.id}
            {...card}
            handleDragStart={handleDragStart}
            setCards={setCards}
          />
        ))}
        <DropIndicator beforeId={"-1"} column={column} />
        <AddCard column={column} setCards={setCards} />
      </div>
    </div>
  );
}

function AddCard({ column, setCards }: { column: string; setCards: Function }) {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (!text.trim().length) return;
    const newCard = {
      column,
      title: text.trim(),
      id: crypto.randomUUID().toString(),
    };
    setCards((currentCards: any) => [...currentCards, newCard]);
    setAdding(false);
  }

  function handleClear() {
    setCards((currentCards: any) =>
      currentCards.filter((card: any) => {
        if (card.column !== column) return card;
      })
    );
  }

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            placeholder="Add a new task..."
            autoFocus
            onChange={(e) => setText(e.target.value)}
            className="border border-pink-400 bg-pink-400/30 rounded p-4 w-full text-gray-200 text-sm placeholder:italic placeholder-pink-300 focus:outline-0"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setAdding(false)}
              className="px-4 py-2 text-xs transition-colors text-gray-200 hover:text-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs transition-colors rounded bg-gray-200 text-gray-900 hover:bg-gray-400 flex justify-center items-center gap-2"
            >
              <span>Save task</span>
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.div layout className="flex justify-between">
          <button
            onClick={handleClear}
            name="Clear all cards"
            className="flex justify-between w-26 px-2 py-2 italic items-center text-xs gap-2 text-gray-200 transition-colors hover:text-gray-400"
          >
            <span>Clear all</span>
          </button>
          <button
            onClick={() => setAdding(true)}
            name="Add card"
            className="px-4 py-2 text-xs transition-colors rounded bg-gray-200 text-gray-900 hover:bg-gray-400 flex justify-center items-center gap-2"
          >
            <span>Add task</span>
          </button>
        </motion.div>
      )}
    </>
  );
}

function Card({ title, id, column, handleDragStart, setCards }: CardType) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(title);
  const [newText, setNewText] = useState(text);
  const [isContextOpen, setIsContextOpen] = useState(false);

  function handleClick() {
    setEditing(!editing);
  }

  function handleCancel() {
    setEditing(false);
    setText(newText);
  }

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (!text.trim().length) return;
    const updatedCard = {
      column,
      title: text.trim(),
      id,
    };
    setCards((currentCards: any) =>
      currentCards.map((card: { id: string }) => {
        if (card.id === updatedCard.id)
          return { ...card, title: updatedCard.title };
        return card;
      })
    );
    setNewText(text);
    setEditing(false);
  }

  function handleDelete(id: string) {
    setCards((currentCards: any) =>
      currentCards.filter((card: any) => {
        if (card.id !== id) return card;
      })
    );
  }

  function handleMove(column: string, id: string) {
    setCards((currentCards: any) => {
      let copy = [...currentCards];
      let cardToTransfer = copy.find((card)=>card.id === id)
      if (!cardToTransfer) return;
      cardToTransfer = {...cardToTransfer, column}
      copy = copy.filter((card)=>card.id !== id)
      copy.push(cardToTransfer)
      return copy
    });
  }

  const OPTIONS = [
    {
      column: "Imp-Urg",
      color: "bg-red-400",
      tcolor: "text-red-900",
      text: "Move to Important and Urgent",
    },
    {
      column: "Imp",
      color: "bg-orange-400",
      tcolor: "text-orange-900",
      text: "Move to Important",
    },
    {
      column: "Urg",
      color: "bg-yellow-400",
      tcolor: "text-yellow-800",
      text: "Move to Urgent",
    },
    {
      column: "Del",
      color: "bg-green-400",
      tcolor: "text-green-800",
      text: "Move to Not Important or Urgent",
    },
    {
      column: "delete",
      color: "border-gray-400 border-2",
      tcolor: "text-gray-400",
      text: "Delete Task",
    },
  ];

  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id+'drag'}
        draggable={!editing}
        onDragStart={(e) => handleDragStart(e, { title, id, column })}
        className={`cursor-grab active:cursor-grabbing rounded border px-4 py-2 ${
          editing
            ? "border-gray-200"
            : "border-gray-700  active:bg-gray-700 active:shadow-none active:border-gray-800"
        } shadow-sm shadow-gray-950 bg-gray-800`}
      >
       
        <motion.div layout layoutId={id+'main'} className="flex justify-between items-center">
            {!editing && <p className="text-sm text-gray-200">{title}</p>}
            {editing && (
              <form
                className="w-full flex gap-1 items-center text-gray-200"
                onSubmit={(e) => handleSubmit(e)}
              >
                <textarea
                  className="bg-gray-800 w-full resize-none outline-none p-0 m-0 text-sm"
                  autoFocus
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button
                  className="hover:bg-gray-700 rounded p-1 ml-2 mr-1"
                  hidden={!editing}
                  type="submit"
                  name="Save edit"
                >
                  <BsCheckSquare size={18} />
                </button>
              </form>
            )}

          <div className="flex gap-1 items-center text-gray-200">
            <button
              className=" p-1 hover:bg-gray-700 rounded"
              onClick={handleClick}
              hidden={editing}
              name="Edit"
            >
              <BsPencilSquare size={18} />
            </button>

            <button
              className="hover:bg-gray-700 rounded p-1"
              onClick={handleCancel}
              hidden={!editing}
              name="Cancel edit"
            >
              <BsXSquare size={18} />
            </button>

            <button
              className="hover:bg-gray-700 rounded p-1"
              onClick={() => setIsContextOpen(!isContextOpen)}
              name="Options"
            >
              {isContextOpen ? (
                <BsThreeDots size={18} />
              ) : (
                <BsThreeDotsVertical size={18} />
              )}
            </button>
          </div>
        </motion.div>
        <AnimatePresence>
        {isContextOpen && (
          <motion.div 
          layout 
          layoutId={id+'context'}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }} 
          style={{ originY: 0 }}
          className="flex flex-col gap-2 mt-2">
            {OPTIONS.map(
              (option) =>
                option.column !== column && (
                  <button
                  key={id+option.column}
                    className={`${option.color}  hover:opacity-70 ${option.tcolor} text-sm rounded px-4 py-2`}
                    onClick={() =>
                      option.column === "delete"
                        ? handleDelete(id)
                        : handleMove(option.column, id)
                    }
                  >
                    {option.text}
                  </button>
                )
            )}
          </motion.div>
        )}
      </AnimatePresence>
      </motion.div>
    </>
  );
}

function DropIndicator({
  beforeId,
  column,
}: {
  beforeId: string;
  column: string;
}) {
  return (
    <>
      <div
        data-before={beforeId || "-1"}
        data-column={column}
        className="my-0.5 h-0.5 w-full bg-pink-400 opacity-0"
      ></div>
    </>
  );
}

const DEFAULT_CARDS = [
  {
    title: "Resolve critical server outage immediately",
    id: "1",
    column: "Imp-Urg",
  },
  {
    title: "Prepare for tomorrow's client presentation",
    id: "2",
    column: "Imp-Urg",
  },
  { title: "Respond to CEO's urgent email", id: "3", column: "Imp-Urg" },
  { title: "Update team on project milestones", id: "4", column: "Imp" },
  { title: "Plan next quarter's team objectives", id: "5", column: "Imp" },
  { title: "Review and approve expense reports", id: "6", column: "Urg" },
  {
    title: "Restock office supplies before inventory check tomorrow",
    id: "7",
    column: "Urg",
  },
  { title: "Assign new intern onboarding tasks", id: "8", column: "Del" },
];
