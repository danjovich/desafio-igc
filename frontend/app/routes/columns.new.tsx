import { ActionFunction, redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import NewColumnDialog from "~/components/dialogs/new-column-dialog";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import ApiService from "~/services/ApiService";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title") as string;

  await ApiService.getInstance().createColumn(title);

  return redirect("/");
};

export default function NewColumn() {
  const navigate = useNavigate();

  const onOpenChange = () => {
    navigate("/");
  };

  return (
    <Dialog defaultOpen modal onOpenChange={onOpenChange}>
      <DialogContent className="w-fit">
        <NewColumnDialog />
      </DialogContent>
    </Dialog>
  );
}
