import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "../ui/card";
import Task from "~/interfaces/Task";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import CardDialogContent from "./card-dialog-content";

interface KanbanCardProps {
  task: Task;
}

export default function KanbanCard({ task }: KanbanCardProps) {
  const [cardDialogOpen, setCardDialogOpen] = useState(false);

  // the below logic was implemented to prevent the dialog from opening if
  // the outside click is in a card (as the event for opening the dialog is
  // a mouseup event)
  const [dialogClosedByOutsideClick, setDialogClosedByOutsideClick] =
    useState(false);

  useEffect(
    () =>
      void (
        dialogClosedByOutsideClick &&
        setTimeout(() => setDialogClosedByOutsideClick(false), 500)
      ),
    [dialogClosedByOutsideClick]
  );

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { ...task },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Dialog open={cardDialogOpen} onOpenChange={setCardDialogOpen} modal>
      <Card
        onMouseUp={() =>
          // avoids opening the dialog if there was an outside click with an open dialog
          !dialogClosedByOutsideClick && setCardDialogOpen(!cardDialogOpen)
        }
        {...listeners}
        {...attributes}
        ref={setNodeRef}
        style={style}
      >
        <p>{task.title}</p>
      </Card>
      <DialogContent
        onPointerDownOutside={() => setDialogClosedByOutsideClick(true)}
      >
        <CardDialogContent task={task} />
      </DialogContent>
    </Dialog>
  );
}
