import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { columns } from "./columns";

const GroupAllocationPage = () => {
  const data = [
    {
      id: 1,
      name: "Group 1",
      description: "Group 1 description",
    },
    {
      id: 2,
      name: "Group 2",
      description: "Group 2 description",
    },
  ];
  return (
    <div className="container mx-auto py-10 space-y-2">
      <div className="flex flex-row  justify-between items-end">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          All Groups
        </h3>

        <div className="flex space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default GroupAllocationPage;
